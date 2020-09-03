import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { Page } from "../layout/Page";
import styles from "./CoC.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import backgroundAudio from "../../assets/gorloj-nagrume.mp3";

import { getRoomMetadata } from "../../room-metadata";
import { SvgHoverButton } from "../../utils/svg-helpers";

import qsTruthy from "../../utils/qs_truthy";
import { check_webp_feature_support_cache } from "../../utils/compat";
import Modal from "react-modal";
import { getRoomURL } from "../../room-metadata";


const enterButton = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button.gif";
const enterButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button.webp";
const enterButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button_Hover.gif";
const enterButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button_Hover.webp";


const cocBack = "https://str33m.dr33mphaz3r.net/static-assets/coc/coc-back.png";
const cocBackWebp = "https://str33m.dr33mphaz3r.net/static-assets/coc/coc-back.webp";

const splashMp4 = "https://str33m.dr33mphaz3r.net/static-assets/splash2.mp4";
const splashWebm = "https://str33m.dr33mphaz3r.net/static-assets/splash2.webm";


const loginButton = "https://str33m.dr33mphaz3r.net/static-assets/login-button.png";
const loginButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button.webp";
const loginButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.png";
const loginButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.webp";

const logoutButton = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.png";
const logoutButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.webp";

const logoutButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.png";
const logoutButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.webp";

addLocaleData([...en]);

const showLogin = qsTruthy("login");

export const CoCModal = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Credits"
      style={{
        content: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }}
    >
      <MenuComponent onRequestClose={onRequestClose} />
    </Modal>
  );
};

export const MenuComponent = () => {
  let backImage = cocBack;

  if (check_webp_feature_support_cache("lossy")) {
    backImage = cocBackWebp;
  }

  return (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100vw" height="100vh" viewBox="0 0 3601 3737">
  <image id="CodeofConduct" x="78" y="95" width="3425" height="3579" xlinkHref={backImage}/>
  <SvgHoverButton 
      onClick={async e => {
        e.preventDefault();
        const targetUrl = await getRoomURL("lobby");
        if (targetUrl) {
          location.href = targetUrl;
        } else {
          console.error("invalid portal targetRoom:", this.data.targetRoom);
        }
      }} id="Enter" hoverProps={{ x: "1479", y: "2760", width: "612", height: "623", xlinkHref: enterButtonHover, xlinkHrefWebp: enterButtonHoverWebp}} normalProps={{ x: "1479", y: "2760", width: "612", height: "623", xlinkHref: enterButton, xlinkHrefWebp: enterButtonWebp }} />
</svg>
);

}

export function CoC() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }
  }, []);

  const pageStyle = {
    display: "flex",
    alignItems: "center"
  };

  return (
    <Page className={styles.homePage} style={pageStyle}>
      <div
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
          overflow: "hidden",
          zIndex: "-100",
          background: "#000000"
        }}
      >
        <video playsInline loop autoPlay muted className="video-container" style={{
          opacity: "0.2"
        }}>
          <source src={splashMp4} type="video/mp4" />
          <source src={splashWebm} type="video/webm" />
        </video>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          zIndex: "1"
        }}
      >
        <audio volume={0.5} loop autoPlay>
          <source src={backgroundAudio} type="audio/mpeg" />
        </audio>
        <div
          style={{
            position: "relative"
          }}
        >
          <MenuComponent />
        </div>
      </div>
    </Page>
  );
}
