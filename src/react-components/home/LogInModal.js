import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-modal";
import configs from "../../utils/configs";
import freeMode from "../../utils/free-mode"
import { validate } from "email-validator";

import IfFeature from "../if-feature";

const logInButton = "https://str33m.dr33mphaz3r.net/static-assets/login/log-in-button.png";
const logInButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login/log-in-button.webp";
const signUpButton = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.png";
const signUpButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login/sign-up-button.webp";

const modalSmallBg = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.png";
const modalSmallBgWebp = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.webp";

const modalLongBg = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-long-bg.png";
const modalLongBgWebp = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-long-bg.webp";

import { Elements } from "react-stripe-elements";

import InjectedCheckoutForm from "./CheckoutForm";
import { useSignIn, SignInStep } from "../auth/SignInPage";

import { CoCModal } from "../coc/CoC";

require("es6-promise").polyfill();

var originalFetch = require("isomorphic-fetch");
var fetch = require("fetch-retry")(originalFetch);

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
          </IfFeature>
          .
        </b>
      )}
      <button type="submit">next</button>
    </form>
  );
}

const PaymentPendingForm = ({ setLoginState, email }) => {
  useEffect(() => {
    {
      fetch(`https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        }),
        retries: 8,
        retryDelay: function(attempt, error, response) {
          return Math.pow(2, attempt) * 1000;
        },
        retryOn: [404, 503, 500]
      })
        .then(function(response) {
          if (response.status === 200) {
            setLoginState({ step: "PAYMENT_SUCCESSFUL" });
          } else if (response.status === 404) {
            throw response;
          } else {
            throw response;
          }
        })
        .catch(function(err) {
          console.log("got error :(", err);
        });
    }
  }, []);

  return (
    <React.Fragment>
      <span
        style={{
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "30px",
          lineHeight: "35px",
          textAlign: "center",
          color: "#FFE6C1",
          textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
          marginBottom: "1.5em"
        }}
      >
        PROCESSING PAYMENT
      </span>
    </React.Fragment>
  );
};

const VerifiedForm = ({ proceed, buttonDisabled }) => {
  const style = {
    fontFamily: "Perpetua Titling MT",
    fontStyle: "normal",
    fontWeight: "300",
    fontSize: "30px",
    lineHeight: "35px",
    textAlign: "center",
    color: "#FFE6C1",
    marginBottom: "1.5em"
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <React.Fragment>
      <span style={{ ...style, lineHeight: "35px", fontSize: "30px" }}>
        YOUR ACCOUNT
        <br />
        pƐIℲIɹƐΛ NƎƎq S∀H
      </span>
      <span style={{ ...style, lineHeight: "19px", fontSize: "19px" }}>
        A SIGN-IN LINK HAS BEEN
        <br /> SENT TO YOUR EMAIL
      </span>
      <button
        onClick={proceed}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...style,
          ...(isHovered ? { textShadow: "3px 3px 8px rgba(255, 184, 0, 0.94)" } : {}),
          opacity: buttonDisabled ? "0.3" : "1",
          background: "unset",
          border: "1px solid #FFE6C1",
          boxSizing: "border-box",
          width: "280px",
          padding: "8px",
          filter: "drop-shadow(2px 2px 10px rgba(255, 184, 0, 0.94))",
          borderRadius: "5px",
          fontWeight: "300",
          lineHeight: "19px",
          fontSize: "19px"
        }}
      >
        <span>~ ENTER ~</span>
        <br />
      </button>
      <span></span>
    </React.Fragment>
  );
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

  const buttonDisabled = !validate(email);

  return (
    <React.Fragment>
      <span
        style={{
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "30px",
          lineHeight: "35px",
          textAlign: "center",
          color: "#FFE6C1",
          textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
          marginBottom: "1.5em"
        }}
      >
        LOGIN TO
        <br />
        DR33MPHAZ3R
      </span>
      <input
        placeholder="YOUR EMAIL ADDRESS"
        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
        style={{
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
          color: "#FFE6C1"
          // textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
        }}
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <br />
      <img
        src={logInButton}
        onClick={() => {
          if (buttonDisabled) {
            return;
          }
          onSubmitEmail(email);
        }}
        style={{
          width: "180px",
          cursor: buttonDisabled ? "disabled" : "pointer",
          opacity: buttonDisabled ? "0.3" : "1"
        }}
      />
      <img
        src={signUpButton}
        onClick={() => {
          if (buttonDisabled) {
            return;
          }
          onSubmitEmail(email);
        }}
        style={{
          width: "180px",
          cursor: buttonDisabled ? "disabled" : "pointer",
          opacity: buttonDisabled ? "0.3" : "1"
        }}
      />
      {/* <a href="/coc" onClick={(e) => {
      e.preventDefault();
      setCocModalOpen(true);
      return false;
    }} style={{
kj/
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
</a> */}
    </React.Fragment>
  );
};

export const LogInModal = ({ isOpen, onRequestClose }) => {
  const qs = new URLSearchParams(location.search);

  const { step, submitEmail, cancel, email } = useSignIn();
  const redirectUrl = qs.get("sign_in_destination_url") || "/";

  useEffect(() => {
    if (step === SignInStep.complete) {
      window.location = redirectUrl;
    }
  }, [step, redirectUrl]);

  const [loginState, setLoginState] = useState({
    step: "NOT_LOGGED_IN"
  });
  const [isCocModalOpen, setCocModalOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="dr33mphaz3r sign in"
      style={{
        content: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }}
    >
      <div
        style={{
          backgroundImage: loginState.step === "PAYMENT_FLOW_STARTED" ? `url(${modalLongBg})` : `url(${modalSmallBg})`,
          minWidth: loginState.step === "PAYMENT_FLOW_STARTED" ? "800px" : "600px",
          minHeight: loginState.step === "PAYMENT_FLOW_STARTED" ? "800px" : "600px",
          backgroundPosition: "center",
          backgroundRepeat: "none",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {loginState.step !== "PAYMENT_FLOW_STARTED" ? (
          step === SignInStep.submit ? (
            <LoginForm
              isCocModalOpen={isCocModalOpen}
              setCocModalOpen={setCocModalOpen}
              onSubmitEmail={email => {
                if (freeMode) {
                  submitEmail(email);
                } else {
                  window
                    .fetch(`https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/search`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify({
                        email
                      })
                    })
                    .then(resp => {
                      if (resp.status === 200) {
                        submitEmail(email);
                      } else if (resp.status === 404) {
                        setLoginState({ step: "PAYMENT_FLOW_STARTED", email: email });
                      } else {
                        throw resp;
                      }
                    });
                }
                // submitEmail(email);
              }}
              initialEmail={email}
              signInReason={qs.get("sign_in_reason")}
            />
          ) : loginState.step === "PAYMENT_PENDING" ? (
            <PaymentPendingForm setLoginState={setLoginState} email={loginState.email} />
          ) : (
            <VerifiedForm
              buttonDisabled={isCocModalOpen}
              proceed={() => {
                setCocModalOpen(true);
              }}
            />
          )
        ) : (
          <PaymentForm
            email={loginState.email}
            onSuccess={() => {
              setLoginState({ step: "PAYMENT_PENDING", email: loginState.email });
              submitEmail(loginState.email);
            }}
          />
        )}
      </div>

      <CoCModal isOpen={isCocModalOpen} onRequestClose={() => setCocModalOpen(false)} />
    </Modal>
  );
};

const PaymentForm = ({ email, onSuccess }) => {
  return (
    <React.Fragment>
      <span
        style={{
          fontFamily: "Perpetua Titling MT",
          fontStyle: "normal",
          fontWeight: "300",
          fontSize: "30px",
          lineHeight: "35px",
          textAlign: "center",
          color: "#FFE6C1",
          textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
          marginBottom: "1.5em"
        }}
      >
        PAYMENT
      </span>
      <div
        style={{
          maxWidth: "300px",
          textAlign: "center",
          marginBottom: "2em"
        }}
      >
        <div
          style={{
            fontFamily: "Perpetua Titling MT",
            fontStyle: "normal",
            fontWeight: "300",
            fontSize: "16px",
            textAlign: "center",
            color: "#FFE6C1",
            textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)",
            marginBottom: "1em"
          }}
        >
          To commence your ~ dr33m ~ we kindly ask for $3.33 AUD to contribute to artists fees and ongoing operation
          costs.
        </div>
        <div
          style={{
            fontFamily: "Perpetua Titling MT",
            fontStyle: "normal",
            fontWeight: "300",
            fontSize: "16px",
            textAlign: "center",
            color: "#FFE6C1",
            textShadow: "4px 4px 10px rgba(255, 184, 0, 0.94)"
          }}
        >
          Payment will secure you a login code, which gives you permanent and unlimited access to the website{" "}
        </div>
      </div>

      <Elements>
        <InjectedCheckoutForm email={email} onStripeSuccess={onSuccess} />
      </Elements>
    </React.Fragment>
  );
};
