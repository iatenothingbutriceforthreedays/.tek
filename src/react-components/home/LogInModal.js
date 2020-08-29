import React, { useState,useCallback } from "react";
import Modal from 'react-modal';
import configs from "../../utils/configs";

import IfFeature from "../if-feature";

const logInButton = "https://str33m.dr33mphaz3r.net/static-assets/login/log-in-button.png";
const logInButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login/log-in-button.webp";
const signUpButton = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.png";
const signUpButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.webp";

const modalSmallBg = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.png";
const modalSmallBgWebp = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.webp";
import { Elements } from 'react-stripe-elements';

import InjectedCheckoutForm from './CheckoutForm';
import { useSignIn, SignInStep } from "../auth/SignInPage";

import { MenuComponent }  from "../coc/CoC";

function SubmitEmail({ onSubmitEmail, initialEmail }) {

    const [email, setEmail] = useState(initialEmail);
  
    const onSubmitForm = useCallback(
      e => {
        e.preventDefault();
        onSubmitEmail(email);
      },
      [onSubmitEmail, email]
    );
  
    return (
      <form onSubmit={onSubmitForm}>
        <h1>Sign In</h1>
        <b>Sign in to pin objects in rooms.</b>
        <input
          name="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@example.com"
        />
        {(configs.feature("show_terms") || configs.feature("show_privacy")) && (
          <b>
            By proceeding, you agree to the{" "}
            <IfFeature name="show_terms">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={configs.link("terms_of_use", "https://github.com/mozilla/hubs/blob/master/TERMS.md")}
              >
                terms of use
              </a>{" "}
            </IfFeature>
            {configs.feature("show_terms") && configs.feature("show_privacy") && "and "}
            <IfFeature name="show_privacy">
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={configs.link("privacy_notice", "https://github.com/mozilla/hubs/blob/master/PRIVACY.md")}
              >
                privacy notice
              </a>
            </IfFeature>.
          </b>
        )}
        <button type="submit">next</button>
      </form>
    );
  }

const VerifiedForm = () => {
    return (<React.Fragment><span style={{

        fontFamily: "Perpetua Titling MT",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "30px",
        lineHeight: "35px",
        textAlign: "center",
        color: "#FFE6C1",
        textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
        marginBottom: "1.5em"
    }}>
        YOUR ACCOUNT
  <br />HAS BEEN VERIFIED
  </span>
        <span style={{

            fontFamily: "Perpetua Titling MT",
            fontStyle: "normal",
            fontWeight: "300",
            fontSize: "19px",
            lineHeight: "19px",
            textAlign: "center",
            color: "#FFE6C1",
            textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
            marginBottom: "1.5em"
        }}>
            A SIGN-IN LINK HAS BEEN<br /> SENT TO YOUR EMAIL
</span>
        <span style={{

            fontFamily: "Perpetua Titling MT",
            fontStyle: "normal",
            fontWeight: "300",
            fontSize: "19px",
            lineHeight: "19px",
            textAlign: "center",
            color: "#FFE6C1",
            textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
            marginBottom: "1.5em"
        }}>
            PLEASE CLICK ON THE
<br /> LINK TO ENTER ~
</span>

    </React.Fragment>);
};

const LoginForm = ({ onSubmitEmail, initialEmail, isCocModalOpen, setCocModalOpen }) => {

    const [email, setEmail] = useState(initialEmail);

    const onSubmitForm = useCallback(
      e => {
        e.preventDefault();
        onSubmitEmail(email);
      },
      [onSubmitEmail, email]
    );
  

    return (<React.Fragment><span style={{

        fontFamily: "Perpetua Titling MT",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "30px",
        lineHeight: "35px",
        textAlign: "center",
        color: "#FFE6C1",
        textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
        marginBottom: "1.5em"
    }}>
        LOGIN TO
  <br />DR33MPHAZ3R
  </span>
        <input placeholder="YOUR EMAIL ADDRESS" style={{
            background: "unset",
            border: "1px solid #FFE6C1",
            boxSizing: "border-box",
            width: "280px",
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
            // textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
        }} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <br />
        <img src={logInButton} onClick={() => onSubmitEmail(email)} style={{ width: "180px" }} />
        <img src={signUpButton} style={{ width: "180px" }} />
        <a href="/coc" onClick={(e) => {
          e.preventDefault();
          setCocModalOpen(true);
          return false;
        }} style={{

fontFamily: "Perpetua Titling MT",
fontStyle: "normal",
fontWeight: "300",
fontSize: "18pxx",
lineHeight: "18px",
textAlign: "center",
color: "#FFE6C1",
textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
marginTop: "16px"
}}>
Code of Conduct
</a>
</React.Fragment>);
};

export const LogInModal = ({ isOpen, onRequestClose }) => {
    const qs = new URLSearchParams(location.search);

    const { step, submitEmail, cancel, email } = useSignIn();
    const [ loginState, setLoginState ] = useState({
      step: "NOT_LOGGED_IN"
    });
    const [isCocModalOpen, setCocModalOpen] = useState(false);


    console.log("got login step", step);


    return (<Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="dr33mphaz3r sign in"
        style={{
            content: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
        }}
    >
        <div style={{
            backgroundImage: `url(${modalSmallBg})`,
            minWidth: "600px",
            minHeight: "600px",
            backgroundPosition: "center",
            backgroundRepeat: "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
        }}>
          { loginState.step !== "PAYMENT_FLOW" ? 
            step === SignInStep.submit ? (
                <LoginForm isCocModalOpen={isCocModalOpen} setCocModalOpen={setCocModalOpen} onSubmitEmail={(email) => {
                  window
                  .fetch(`https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/search`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email
                    }),
                  }).then((resp) => {
                    if(resp.status === 200) {
                      submitEmail(email);
                    } else if(resp.status === 404) {
                      setLoginState({ step: "PAYMENT_FLOW", email: email })
                    } else {
                      throw resp;
                    }
                  });
                  // submitEmail(email);
                }} initialEmail={email} signInReason={qs.get("sign_in_reason")} />
            ) : (
                    <VerifiedForm />
                ) : <PaymentForm email={loginState.email} onSuccess={() => submitEmail(email)} />}

        </div>

    <Modal
        isOpen={isCocModalOpen}
        onRequestClose={() => setCocModalOpen(false)}
        contentLabel="dr33mphaz3r sign in"
        style={{
            content: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            },
        }}
    >
        <MenuComponent/>
    </Modal>);
    </Modal>);
};

const PaymentForm = ({ email, onSuccess }) => {
    return (<React.Fragment><span style={{

        fontFamily: "Perpetua Titling MT",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "30px",
        lineHeight: "35px",
        textAlign: "center",
        color: "#FFE6C1",
        textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
        marginBottom: "1.5em"
    }}>
        PAYMENT
  </span>
        <Elements>
            <InjectedCheckoutForm email={email} onStripeSuccess={onSuccess} />
        </Elements>

    </React.Fragment>);
};