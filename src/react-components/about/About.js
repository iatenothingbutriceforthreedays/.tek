import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { Page } from "../layout/Page";
import styles from "./About.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import backgroundAudio from "../../assets/gorloj-nagrume.mp3";

import getRoomMetadata from "../../room-metadata";

import qsTruthy from "../../utils/qs_truthy";

const aboutBack = "https://str33m.dr33mphaz3r.net/static-assets/about/about-back.png";
const aboutBackWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/about-back.webp";
const limboHover = "https://str33m.dr33mphaz3r.net/static-assets/about/limbo-hover.png";
const limboHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/limbo-hover.webp";
const limboNormal = "https://str33m.dr33mphaz3r.net/static-assets/about/limbo-normal.png";
const limboNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/limbo-normal.webp";
const metabNormal = "https://str33m.dr33mphaz3r.net/static-assets/about/metab-normal.png";
const metabNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/metab-normal.webp";
const metabHover = "https://str33m.dr33mphaz3r.net/static-assets/about/metab-hover.png";
const metabHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/metab-hover.webp";
const aDeathNormal = "https://str33m.dr33mphaz3r.net/static-assets/about/a-death-normal.png";
const aDeathNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/a-death-normal.webp";
const aDeathHover = "https://str33m.dr33mphaz3r.net/static-assets/about/a-death-hover.png";
const aDeathHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/a-death-hover.webp";
const exitNormal = "https://str33m.dr33mphaz3r.net/static-assets/about/exit-normal.png";
const exitNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/exit-normal.webp";
const exitHover = "https://str33m.dr33mphaz3r.net/static-assets/about/exit-hover.png";
const exitHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/about/exit-hover.webp";

const splashMp4 = "https://str33m.dr33mphaz3r.net/static-assets/splash2.mp4";
const splashWebm = "https://str33m.dr33mphaz3r.net/static-assets/splash2.webm";


const loginButton = "https://str33m.dr33mphaz3r.net/static-assets/login-button.png";
const loginButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button.webp";
const loginButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.png";
const loginButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.webp";


const enterButton = "https://str33m.dr33mphaz3r.net/static-assets/enter-button.gif";
const enterButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/enter-button-hover.gif";

const logoutButton = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.png";
const logoutButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.webp";

const logoutButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.png";
const logoutButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.webp";

addLocaleData([...en]);

const showLogin = qsTruthy("login");


const SvgHoverButton = ({ normalProps, hoverProps, style, href, ...otherProps }) => {
  const [isShown, setIsShown] = useState(false);

  if(href) {
    return (<a href={href}>
      <image
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        style={{
          ...style,
          cursor: "pointer"
        }}
        {...isShown ? hoverProps : normalProps}
        {...otherProps}
      />
      </a>)
  }

  return (
    <image
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{
        ...style,
        cursor: "pointer"
      }}
      {...isShown ? hoverProps : normalProps}
      {...otherProps}
    />
  )
};


const MenuComponent = () => {
  return (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100vw" height="100vh" viewBox="0 0 4961 3508">
  <image id="About" x="287" y="144" width="4463" height="3273" xlinkHref={aboutBack}/>
  <SvgHoverButton id="A-death" href="https://libcom.org/files/%5BCcru,_Nick_Land%5D_Ccru_Writings_1997-2003(BookZZ.org).pdf" hoverProps={{ x: "2630", y: "1526", width: "367", height: "167", xlinkHref: aDeathHover }} normalProps={{ x: "2630", y: "1526", width: "367", height: "167", xlinkHref: aDeathNormal }} />
  <SvgHoverButton id="Limbo" href="https://www.youtube.com/watch?v=ol4OSIGGukA" normalProps={{ x:"3369", y: "1289", width: "307", height: "206", xlinkHref: limboNormal }} hoverProps={{
    x: "3375", y: "1294", width: "296", height: "196", xlinkHref: limboHover
  }} />
  <SvgHoverButton href="https://www.discogs.com/Insectoid-Groovology-Of-The-Metaverse/release/565285" id="Metabolising" hoverProps={{ x: "2800", y: "2315", width: "987", height: "83", xlinkHref: metabHover }} normalProps={{ x: "2800", y: "2314", width: "987", height: "83", xlinkHref: metabNormal }} />
  <SvgHoverButton href="/" id="ExitButton" normalProps={{ x: "526", y: "434", width: "191", height: "191", xlinkHref: exitNormal }} hoverProps={{
    x: "507", y: "412", width: "226", height: "233", xlinkHref: exitHover
  }} />
</svg>
);

}

const LogoutButton = ({ onLinkClicked }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{
        border: "none",
        background: "none",
        padding: "0",
        margin: "0",
        cursor: "pointer"
      }}
      onClick={onLinkClicked}
    >
      {isShown ? (
        <picture>
          <source srcSet={logoutButtonHoverWebp} type="image/webp" />

          <img
            style={{
              maxWidth: "200px",
              marginRight: "-25px"
            }}
            src={logoutButtonHover}
          />
        </picture>
      ) : (
          <picture>
            <source srcSet={logoutButtonWebp} type="image/webp" />

            <img
              style={{
                maxWidth: "200px",
                marginRight: "-25px"
              }}
              src={logoutButton}
            />
          </picture>
        )}
    </button>
  );
};

const LoginButton = ({ onLinkClicked }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <a
      href="/signin"
      rel="noreferrer noopener"
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{
        border: "none",
        background: "none",
        padding: "0",
        margin: "0",
        cursor: "pointer"
      }}
    >
      {isShown ? (
        <picture>
          <source srcSet={loginButtonHoverWebp} type="image/webp" />

          <img
            style={{
              maxWidth: "200px"
            }}
            src={loginButtonHover}
          />
        </picture>
      ) : (
          <picture>
            <source srcSet={loginButtonWebp} type="image/webp" />

            <img
              style={{
                maxWidth: "200px"
              }}
              src={loginButton}
            />
          </picture>
        )}
    </a>
  );
};

const EnterButton = props => {
  const [isShown, setIsShown] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{
        border: "none",
        background: "none",
        padding: "0",
        margin: "0",
        cursor: "pointer"
      }}
      onClick={e => {
        e.preventDefault();
        const targetUrl = getRoomMetadata("lobby").url;
        if (targetUrl) {
          location.href = targetUrl;
        } else {
          console.error("invalid portal targetRoom:", this.data.targetRoom);
        }
      }}
    >
      <img
        style={{
          maxWidth: "120px",
          mixBlendMode: "lighten"
        }}
        src={isShown ? enterButtonHover : enterButton}
      />
    </button>
  );
};

export function About() {
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
          zIndex: "-100"
        }}
      >
        <video playsInline loop autoPlay muted className="video-container">
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
        <audio loop autoPlay>
          <source src={backgroundAudio} type="audio/mpeg" />
        </audio>
        <div
          style={{
            position: "relative"
          }}
        >
          <MenuComponent />
        </div>
        {auth.isSignedIn && (
          <div
            style={{
              marginLeft: "225px", // half of maxWidth above
              mixBlendMode: "lighten"
            }}
          >
            <EnterButton />
          </div>
        )}
      </div>
      <div className={styles.ctaButtons}>
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "16px",
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column"
          }}
        >
          {!auth.isSignedIn && showLogin && <LoginButton onLinkClicked={auth.showSignInDialog} />}
          {auth.isSignedIn && <LogoutButton onLinkClicked={auth.signOut} />}
          {auth.isSignedIn && (
            <div
              style={{
                color: "#667000",
                textTransform: "lowercase",
                maxWidth: "240px",
                textAlign: "right",
                marginTop: "24px",
                marginRight: "20px"
              }}
            >
              <span>
                <FormattedMessage id="sign-in.as" /> {auth.email}
              </span>{" "}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
