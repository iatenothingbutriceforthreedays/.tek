import Stripe from 'stripe';
import express from 'express';
import bodyParser from 'body-parser';
import env from 'dotenv';

import {
  dr33mApiClient,
  // User
 } from './hubs-api'

env.config();

const dr33m = dr33mApiClient(
  process.env.DR33M_ADMIN_ID as string,
  process.env.DR33M_SECRET as string,
)

dr33m.lookup("caspianbaska@gmail.com")

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2020-08-27',
});

const app = express();

// Use JSON parser for all non-webhook routes
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      bodyParser.json()(req, res, next);
    }
  }
);

app.post(
  '/webhook',
  // Stripe requires the raw body to construct the event
  bodyParser.raw({ type: 'application/json' }),
  (req: express.Request, res: express.Response): void => {
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event
    console.log('✅ Success:', event.id);

    console.log(JSON.stringify(event))

    // Cast event data to Stripe object
    if (event.type === 'payment_intent.succeeded') {
      const stripeObject: Stripe.PaymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
      /*
      console.log('Payment Success:', { intent });

      const user = parseSuccess(intent)

      let createdUser

      try {
        createdUser = await retry(async () => {
          const created = await createAccount(user)
          if (!created) throw new Error(`Failed to create user : ${user}`)
          return created
        }, { retries: 5 })
      } catch (e) {
        console.error("Failed to create user:", { intent, e });
        res.status(500).send('Failed to create user after successful payment').end()
        return
      }

      console.log('Account Creation Success:', { createdUser })
      */
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  }
);

/*
const parseSuccess = (intent: Stripe.PaymentIntent) => {
  const { email }: User = intent.charges.data[0].metadata as User

  return { email }
}
*/

app.listen(3000, (): void => {
  console.log('Example app listening on port 3000!');
});