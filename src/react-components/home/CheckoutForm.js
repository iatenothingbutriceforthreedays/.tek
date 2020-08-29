import React from 'react';
import { injectStripe } from 'react-stripe-elements';

import { CardElement, AddressElement } from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
      <label>
        <span style={{
          boxSizing: "border-box",
          width: "280px",
          color: "white",
          display: "block",
          paddingBottom: "16px",
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          color: "#FFE6C1",
          textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
        }}>CARD DETAILS</span>
        <CardElement style={{ base: { fontSize: '18px', color: 'white' } }} />
      </label>
    );
  }
}



const createPaymentIntent = (options) => {
  return window
    .fetch(`https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/payment/intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log('API error:', { data });
        throw new Error('PaymentIntent API Error');
      } else {
        return data.client_secret;
      }
    });
};

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    }
  }
  componentDidMount() {
    createPaymentIntent({
      amount: 333,
      currency: 'aud',
      payment_method_types: ['card'],
      metadata: {
        email: this.props.email,
      }
    })
      .then((clientSecret) => {
        console.log("got client secret", clientSecret);
        this.setState({ clientSecret, disabled: false });
      })
      .catch((err) => {
        console.log("got error", err);
        this.setState({ error: err.message });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const cardElement = this.props.elements.getElement('card');

    this.setState({
      isSubmitting: true
    });

    this.props.stripe.confirmCardPayment(this.state.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    }).then((resp) => {
      this.setState({
        isSubmitting: false
      });
      
      if(resp.paymentIntent) {
        this.props.onStripeSuccess();
      } else {
        
        // TODO: handle error case! (Toast error?)
      }
    }).catch((err) => {
      this.setState({
        isSubmitting: false
      });
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{
        width: "300px",
        color: 'white'
      }}>
        <CardSection />
        <button disabled={this.state.isSubmitting}>Confirm order</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);