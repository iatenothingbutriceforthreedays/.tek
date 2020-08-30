import React from 'react';
import { injectStripe } from 'react-stripe-elements';
import { validate } from 'email-validator';

import { CardElement, AddressElement } from 'react-stripe-elements';

const signUpButton = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.png";
const signUpButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.webp";


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
      isSubmitting: false,
      email: props.email
    }
  }
  componentDidMount() {

  }

  handleSubmit = (e) => {
    e.preventDefault();

    const cardElement = this.props.elements.getElement('card');

    this.setState({
      isSubmitting: true
    });

    createPaymentIntent({
      amount: 333,
      currency: 'aud',
      payment_method_types: ['card'],
      metadata: {
        email: this.state.email,
      }
    })
    .then((clientSecret) => {
      this.props.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })
      .then((resp) => {
        
        if(resp.paymentIntent) {

        this.setState({
          isSubmitting: false
        });

          this.props.onStripeSuccess();
        } else {

        this.setState({
          isSubmitting: false,
          error: "There was an issue processing the payment details below. Please check your details and try again. Otherwise, please contact dr33mphaz3r@gmail.com."
        });

          // TODO: handle error case! (Toast error?)
        }
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          isSubmitting: false
        });
      });
    })
    .catch((err) => {
      this.setState({ error: err.message });
    });
  };

  render() {
    const buttonDisabled = this.state.isSubmitting || !validate(this.state.email);

    return (
      <form onSubmit={this.handleSubmit} style={{
        width: "300px",
        color: 'white'
      }}>
                { this.state.error && <span style={{
          boxSizing: "border-box",
          width: "300px",
          display: "block",
          paddingBottom: "16px",
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          color: "rgb(255, 0, 0)",
          textShadow: "4px 4px 10px rgba(255, 0, 0, 0.94)"
        }}>{ this.state.error }</span> }
                <span style={{
          boxSizing: "border-box",
          width: "300px",
          color: "white",
          display: "block",
          paddingBottom: "16px",
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          color: "#FFE6C1",
          textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
        }}>EMAIL ADDRESS</span>
        <input disabled placeholder="YOUR EMAIL ADDRESS" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"  style={{
          background: "unset",
          border: "1px solid #FFE6C1",
          boxSizing: "border-box",
          width: "300px",
          color: "white",
          padding: "8px",
          filter: "drop-shadow(2px 2px 10px rgba(255, 184, 0, 0.94))",
          borderRadius: "5px",
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "16px",
          lineHeight: "18px",
          textAlign: "center",
          color: "#FFE6C1",
          marginBottom: "16px"
          // textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
        }} type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
        <br/>
        <CardSection />
        <div style={{
          width: "300px",
          display: "flex",
          justifyContent: "center",
          marginTop: "32px"
        }}>
        <img src={signUpButton} aria-label="Sign Up" aria-disabled={buttonDisabled} aria-role="button" onClick={(e) => {
          if(!buttonDisabled) {
            this.handleSubmit(e)
          }
        }} style={{ width: "180px", cursor: buttonDisabled ? "disabled" : "pointer", opacity: buttonDisabled ? "0.3" : "1" }} />
        </div>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);