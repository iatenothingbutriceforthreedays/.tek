import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import { lang, messages } from "../../utils/i18n";
import en from "react-intl/locale-data/en";
import classNames from "classnames";
import configs from "../../utils/configs";
import { Page } from "../layout/Page";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import queryString from "querystring";
import SignInDialog from "../sign-in-dialog.js";
import Modal from 'react-modal';

import backgroundAudio from "../../assets/gorloj-nagrume.mp3";

Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.75)';
Modal.defaultStyles.content = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: "0",
  left: "0",
}

import { getRoomURL } from "../../room-metadata";

import qsTruthy from "../../utils/qs_truthy";


import { LogInModal } from "./LogInModal";
import { AboutModal } from "../about/About";
import { CreditsModal } from "../credits/Credits";


const mainMenuBack = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/menu-back.png";
const mainMenuBackWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/menu-back.webp";
const aboutHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/about-hover.png";
const aboutHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/about-hover.webp";
const aboutNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/about-normal.png";
const aboutNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/about-normal.webp";
const creditHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/credits-hover.png";
const creditHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/credits-hover.webp";
const creditNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/credits-normal.png";
const creditNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/credits-normal.webp";
const loginHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/login-normal.png";
const loginHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/login-normal.webp";
const loginNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/login-hover.png";
const loginNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/login-hover.webp";

const bcHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/bc-hover.png";
const bcHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/bc-hover.webp";
const bcNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/bc-normal.png";
const bcNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/bc-normal.webp";
const fbHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/fb-hover.png";
const fbHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/fb-hover.webp";
const fbNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/fb-normal.png";
const fbNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/fb-normal.webp";
const scHover = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/sc-hover.png";
const scHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/sc-hover.webp";
const scNormal = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/sc-normal.png";
const scNormalWebp = "https://str33m.dr33mphaz3r.net/static-assets/main-menu/sc-normal.webp"; 
const splashMp4 = "https://str33m.dr33mphaz3r.net/static-assets/splash2.mp4";
const splashWebm = "https://str33m.dr33mphaz3r.net/static-assets/splash2.webm";

const aug20Image = "https://str33m.dr33mphaz3r.net/static-assets/aug22.gif";
const aug20ImageWebp = "https://str33m.dr33mphaz3r.net/static-assets/aug22.webp";

const loginButton = "https://str33m.dr33mphaz3r.net/static-assets/login-button.png";
const loginButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button.webp";
const loginButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.png";
const loginButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/login-button-hover.webp";

const logoImage = "https://str33m.dr33mphaz3r.net/static-assets/LineUptrial05h.png";
const logoImageWebp = "https://str33m.dr33mphaz3r.net/static-assets/LineUptrial05h.webp";

const enterButton = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button.gif";
const enterButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/Enter_Button_Hover.webp";

const logoutButton = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.png";
const logoutButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button.webp";

const logoutButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.png";
const logoutButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/logout-button-hover.webp";

addLocaleData([...en]);

const showLoginModal = qsTruthy("loginModal");
const showLogin = qsTruthy("login") || window.showLogin || showLoginModal;

export const BackgroundVideo = () => (
  <video playsInline loop autoPlay muted className="video-container">
    <source src={splashMp4} type="video/mp4" />
    <source src={splashWebm} type="video/webm" />
  </video>
);

const SvgHoverButton = ({ normalProps, hoverProps, style, href, ...otherProps }) => {
  const [isShown, setIsShown] = useState(false);

  if (href) {
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

const MenuComponent = ({ setIsModalOpen, setIsAboutModalOpen, setIsCreditsModalOpen }) => {
  const auth = useContext(AuthContext);
  
  return (<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100vw" height="100vh" viewBox="0 0 3372 3371">
    <image id="BACKPLATE" x="62" y="-149" width="4064" height="3251" xlinkHref={mainMenuBack} />
    <SvgHoverButton  onClick={async e => {
        e.preventDefault();
        setIsAboutModalOpen(true);
        return false;
      }} id="About_Button" normalProps={{ x: "2466", y: "1353", width: "472", height: "781", xlinkHref: aboutNormal }} hoverProps={{ x: "2466", y: "1353", width: "472", height: "781", xlinkHref: aboutHover }} />
    <SvgHoverButton  onClick={async e => {
        e.preventDefault();
        setIsCreditsModalOpen(true);
        return false;
      }} id="Credits_Button" hoverProps={{ x: "445", y: "1337", width: "465", height: "768", xlinkHref: creditHover }} normalProps={{ x: "445", y: "1337", width: "465", height: "768", xlinkHref: creditNormal }} />
    { (showLogin || auth.signedIn) && <SvgHoverButton id="LogIn_Button" hoverProps={{ x: "1528", y: "2273", width: "301", height: "76", xlinkHref: loginHover }} normalProps={{ x: "1520", y: "2265", width: "317", height: "93", xlinkHref: loginNormal }} onClick={(e) => {
      e.preventDefault();
      setIsModalOpen(true);
      return false;
    }} /> } 
        { auth.isSignedIn && <text dominantBaseline="middle" textAnchor="middle" x="1680" y="3025" style={{ fontSize: "48px" }} fill="white">
          { auth.email }
  </text> }
         
         
    <SvgHoverButton href="https://ultravirus.bandcamp.com/" id="BC_Button" normalProps={{ x: "2992", y: "2702", width: "170", height: "131", xlinkHref: bcNormal }} hoverProps={{ x: "2977", y: "2687", width: "200", height: "161", xlinkHref: bcHover }} />
    <SvgHoverButton href="https://www.facebook.com/ultravirus101" id="FB_Button" hoverProps={{ x: "2823", y: "2676", width: "183", height: "183", xlinkHref: fbHover }} normalProps={{ x: "2839", y: "2692", width: "151", height: "151", xlinkHref: fbNormal }} />
    <SvgHoverButton href="https://soundcloud.com/ultravirusss" id="SC_hover" hoverProps={{ x: "2627", y: "2688", width: "196", height: "161", xlinkHref: scHover }} normalProps={{ x: "2627", y: "2688", width: "196", height: "161", xlinkHref: scNormal }} />
    { (showLogin || auth.signedIn) && <SvgHoverButton 
      onClick={async e => {
        e.preventDefault();
        const targetUrl = await getRoomURL("lobby");
        if (targetUrl) {
          location.href = targetUrl;
        } else {
          console.error("invalid portal targetRoom:", this.data.targetRoom);
        }
      }} id="Enter" hoverProps={{ x: "1380", y: "2370", width: "600", height: "600", xlinkHref: enterButtonHover}} normalProps={{ x: "1380", y: "2370", width: "600", height: "600", xlinkHref: enterButton }} /> }
  </svg>);

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
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onLinkClicked();
        return false;
      }}
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

  // <a onClick={this.onLinkClicked(this.showSignInDialog)}></a>
  // <a onClick={this.onLinkClicked(this.signOut)}>

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
      onClick={async e => {
        e.preventDefault();
        const targetUrl = await getRoomURL("lobby");
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

export function HomePage() {
  const auth = useContext(AuthContext);

  /*
  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const featuredRooms = Array.from(new Set([...favoriteRooms, ...publicRooms])).sort(
    (a, b) => b.member_count - a.member_count
  );
  */

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

  const [isModalOpen, setIsModalOpen] = useState(showLoginModal);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);


  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;

  // const pageStyle = { backgroundImage: configs.image("home_background", true) };

  const pageStyle = {
    display: "flex",
    alignItems: "center"
  };

  /*
  const logoUrl = configs.image("logo");
  const showDescription = featuredRooms.length === 0;
  const logoStyles = classNames(styles.logoContainer, {
    [styles.centerLogo]: !showDescription
  });
  */

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
        <BackgroundVideo/>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "1",
          zIndex: "0"
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
          <MenuComponent setIsModalOpen={setIsModalOpen} setIsAboutModalOpen={setIsAboutModalOpen} setIsCreditsModalOpen={setIsCreditsModalOpen} />

        </div>
      </div>
      {/* <div className={styles.ctaButtons}>
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
          {!auth.isSignedIn && showLogin && <LoginButton onLinkClicked={() => setIsModalOpen(true)} />}
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
      </div> */}
      <LogInModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
      <AboutModal isOpen={isAboutModalOpen} onRequestClose={() => setIsAboutModalOpen(false)} />
      <CreditsModal isOpen={isCreditsModalOpen} onRequestClose={() => setIsCreditsModalOpen(false)} />


    </Page>
  );
}
