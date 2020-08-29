import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

import Stripe from 'stripe';

import fetch from 'node-fetch'

import * as retry from 'async-retry'
import * as express from 'express';

import * as cors from 'cors';

import { addMonths, subSeconds, getUnixTime } from 'date-fns'

import { omitBy, isUndefined } from 'lodash'

import {
  sign,
  // verify,
  decode,
} from 'jsonwebtoken'

import { v4 as uuidv4 } from 'uuid';

const db = admin.firestore()

const env = functions.config()

const STRIPE_KEY = env.stripe.key || 'pk_stripe'
const STRIPE_WH_SECRET = env.stripe.wh_secret || 'wh_stripe'

const DR33M_SECRET = env.dr33m.secret || 'super_secret'
const DR33M_ADMIN_ID = env.dr33m.admin_id || '1234'

const stripe = new Stripe(STRIPE_KEY, { apiVersion: '2020-03-02' });

const app = express();

interface Token {
  aud: string
  iss: string
  exp: number
  iat: number
  nbf: number
  jti: string
  sub: string
  typ: string
}

const createJWT = () => {
  const issuedAt = new Date()
  const expireAt = addMonths(issuedAt, 12)
  const notBefore = subSeconds(issuedAt, 1)

  const payload: Token = {
    aud: 'ret',
    iss: 'ret',
    exp: getUnixTime(expireAt),
    iat: getUnixTime(issuedAt),
    nbf: getUnixTime(notBefore),
    jti: uuidv4(),
    sub: DR33M_ADMIN_ID,
    typ: 'access',
  }

  return sign(payload, DR33M_SECRET, { algorithm: 'HS512' })
}

const HUBS_API_BASE = 'https://dr33mphaz3r.net/api/v1';
const HUBS_AUTH_HEADER = { 'Authorization': `Bearer ${createJWT()}` }

// `null` if not present
const lookup = async (email: string) => {
  const res = await fetch(`${HUBS_API_BASE}/accounts/search`, {
    method: 'POST',
    headers: { ...HUBS_AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });

  if (!res.ok) {
    functions.logger.error(await res.text())
    return null
  }

  const data = await res.json()

  const { data: [{ id }] } = data

  return { email, id }
}

const createAccount = async ({ email }: User) => {
  const res = await fetch(`${HUBS_API_BASE}/accounts`, {
    method: 'POST',
    headers: { ...HUBS_AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { email } })
  });

  return res.ok ? lookup(email) : null
}

/*
const updateAccount = async (email : string, name : string) => {
  const res = await fetch(`${HUBS_API_BASE}/accounts`, {
    method: 'PATCH',
    headers: { ...HUBS_AUTH_HEADER, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {email, name} })
  });

  if (!res.ok) return null

  const data = await res.json()

  const { data: { id }} = data

  return {email, name, id}
}
*/


app.use(cors({ origin: true }))

// dr33mphaz3r
///////////////////////////////////////////////////////////////////////////////////////////////////

const DOOFSTICKS = 'doofsticks'

app.post('/search', async (req, res) => {
  const { email } = req.body
  const user = await lookup(email)

  if (user)
    res.send(user)
  else
    res.sendStatus(404)
});

// const validateToken = jwtMiddleware({ secret: DR33M_SECRET, algorithms: ['HS512'] })

const parseAndExtractUser = (req: express.Request) => {
  try {
    const token = (req.headers.authorization as string).split(' ')[1]
    // 3ast3r 3gg
    // const payload: Token = verify(token, DR33M_SECRET, { algorithms: ['HS512'] }) as Token
    const payload: Token = decode(token) as Token
    return payload.sub
  } catch (error) {
    functions.logger.error({ error });
    return null;
  }
}

app.get('/doofsticks', async (req: express.Request, res) => {
  const userId = parseAndExtractUser(req)
  if (!userId) {
    res.sendStatus(401)
  } else {
    const document = await db.collection(DOOFSTICKS).doc(userId).get()
    document.exists ? res.send(document.data()) : res.sendStatus(404)
  }
})

app.post('/doofsticks', async (req: express.Request, res) => {
  const userId = parseAndExtractUser(req)

  if (!userId) {
    res.sendStatus(401)
  } else {

    const meta = omitBy(req.body, isUndefined)
    await db.collection(DOOFSTICKS).doc(userId).set({ ...meta }, {merge: true})

    res.sendStatus(200)
  }
})

// Stripe
///////////////////////////////////////////////////////////////////////////////////////////////////

// Generate a payment intent
app.post('/payment/intents', async (req, res) => {
  const paymentIntentParams: Stripe.PaymentIntentCreateParams = req.body;

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

  res.send(paymentIntent);
});



// Notify payment's status
app.post('/payment/webhook', express.raw({type: "application/json"}), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WH_SECRET)
  } catch (e) {
    functions.logger.error("Failed to construct webhook event", { e, body: req.body })
    res.status(400).end()
    return
  }

  functions.logger.debug({ event })

  const intent = event.data.object

  // Handle Type of webhook
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Create user account
      functions.logger.log("Payment Success:", { intent });

      const user = parseSuccess(intent)

      let createdUser

      try {
        createdUser = await retry(async () => {
          const created = await createAccount(user)
          if (!created) throw new Error(`Failed to create user : ${user}`)
          return created
        }, { retries: 5 })
      } catch (e) {
        functions.logger.error("Failed to create user:", { intent, e });
        res.status(500).send('Failed to create user after successful payment').end()
        return
      }

      functions.logger.log('Account Creation Success:', { createdUser })

      break;
    case 'payment_intent.payment_failed':
      // const message = intent.last_payment_error && intent.last_payment_error.message
      functions.logger.log('Failed Payment:', { intent })
      break;
  }

  res.sendStatus(200);
});

interface User {
  email: string
}

const parseSuccess = (intent: any) => {
  const {
    charges: {
      data: [{ metadata: { email } }]
    }
  }: { charges: { data: { metadata: User }[] } } = intent

  return { email, name }
}

export const dr33mphaz3r = functions.https.onRequest(app);
