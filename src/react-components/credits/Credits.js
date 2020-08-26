import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import { Page } from "../layout/Page";
import styles from "./Credits.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import backgroundAudio from "../../assets/gorloj-nagrume.mp3";

import getRoomMetadata from "../../room-metadata";

import qsTruthy from "../../utils/qs_truthy";

import creditsBack from '../../assets/images/credits/credits-back.png';

import mozilla from '../../assets/images/credits/mozilla.png';
import mozillaHover from '../../assets/images/credits/mozillaHover.png';
import altjira from '../../assets/images/credits/altjira.png';
import altjiraHover from '../../assets/images/credits/altjiraHover.png';
import DBR_hybrid from '../../assets/images/credits/DBR_hybrid.png';
import DBR_hybridHover from '../../assets/images/credits/DBR_hybridHover.png';
import factorXIII from '../../assets/images/credits/factorXIII.png';
import factorXIIIHover from '../../assets/images/credits/factorXIIIHover.png';
import hamLaosethakul from '../../assets/images/credits/hamLaosethakul.png';
import hamLaosethakulHover from '../../assets/images/credits/hamLaosethakulHover.png';
import harold from '../../assets/images/credits/harold.png';
import haroldHover from '../../assets/images/credits/haroldHover.png';
import kia from '../../assets/images/credits/kia.png';
import kiaHover from '../../assets/images/credits/kiaHover.png';
import woody92 from '../../assets/images/credits/woody92.png';
import woody92Hover from '../../assets/images/credits/woody92Hover.png';
import _LuulI_ from '../../assets/images/credits/_LuulI_.png';
import _LuulI_Hover from '../../assets/images/credits/_LuulI_Hover.png';
import Bartolomé from '../../assets/images/credits/Bartolomé.png';
import BartoloméHover from '../../assets/images/credits/BartoloméHover.png';
import DGrade_x_Durin_s_Bane from '../../assets/images/credits/DGrade_x_Durin_s_Bane.png';
import DGrade_x_Durin_s_BaneHover from '../../assets/images/credits/DGrade_x_Durin_s_BaneHover.png';
import Meuko___Meuko__live from '../../assets/images/credits/Meuko___Meuko__live.png';
import Meuko___Meuko__liveHover from '../../assets/images/credits/Meuko___Meuko__liveHover.png';
import Nicha_N_Hooch from '../../assets/images/credits/Nicha_N_Hooch.png';
import Nicha_N_HoochHover from '../../assets/images/credits/Nicha_N_HoochHover.png';
import s1m0nc3ll0 from '../../assets/images/credits/s1m0nc3ll0.png';
import s1m0nc3ll0Hover from '../../assets/images/credits/s1m0nc3ll0Hover.png';
import Synergetix_live from '../../assets/images/credits/Synergetix_live.png';
import Synergetix_liveHover from '../../assets/images/credits/Synergetix_liveHover.png';
import Thick_Owens_pres_The_Coretaker from '../../assets/images/credits/Thick_Owens_pres_The_Coretaker.png';
import Thick_Owens_pres_The_CoretakerHover from '../../assets/images/credits/Thick_Owens_pres_The_CoretakerHover.png';
import ExitButton from '../../assets/images/credits/ExitButton.png';
import ExitButtonHover from '../../assets/images/credits/ExitButtonHover.png';
import _Artemis from '../../assets/images/credits/_Artemis.png';
import _ArtemisHover from '../../assets/images/credits/_ArtemisHover.png';
import DJ_Marcelle from '../../assets/images/credits/DJ_Marcelle.png';
import DJ_MarcelleHover from '../../assets/images/credits/DJ_MarcelleHover.png';
import KL_Mai from '../../assets/images/credits/KL_Mai.png';
import KL_MaiHover from '../../assets/images/credits/KL_MaiHover.png';
import Mija_Healey from '../../assets/images/credits/Mija_Healey.png';
import Mija_HealeyHover from '../../assets/images/credits/Mija_HealeyHover.png';
import Nar from '../../assets/images/credits/Nar.png';
import NarHover from '../../assets/images/credits/NarHover.png';
import Pyruvic_Acid from '../../assets/images/credits/Pyruvic_Acid.png';
import Pyruvic_AcidHover from '../../assets/images/credits/Pyruvic_AcidHover.png';
import Spekki_Webu from '../../assets/images/credits/Spekki_Webu.png';
import Spekki_WebuHover from '../../assets/images/credits/Spekki_WebuHover.png';
import Vox_supreme from '../../assets/images/credits/Vox_supreme.png';
import Vox_supremeHover from '../../assets/images/credits/Vox_supremeHover.png';

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
    <image id="Ultravirus_ID01_W" x="72" y="74" width="4810" height="3420" xlinkHref={creditsBack} />
<SvgHoverButton id="mozilla" href="https://github.com/mozilla/reticulum" hoverProps={{x: "3550", y: "3090", width: "509", height: "118", xlinkHref: mozillaHover}} normalProps={{x: "3550", y: "3090", width: "509", height: "118", xlinkHref: mozilla}} />
<SvgHoverButton id="altjira" href="https://soundcloud.com/leerinc" hoverProps={{x: "2411", y: "2314", width: "177", height: "60", xlinkHref: altjiraHover}} normalProps={{x: "2388", y: "2291", width: "223", height: "107", xlinkHref: altjira}} />
<SvgHoverButton id="DBR_hybrid" href="https://soundcloud.com/breezydbr" hoverProps={{x: "2308", y: "2390", width: "352", height: "61", xlinkHref: DBR_hybridHover}} normalProps={{x: "2284", y: "2365", width: "400", height: "110", xlinkHref: DBR_hybrid}} />
<SvgHoverButton id="factorXIII" href="https://soundcloud.com/factorxiii" hoverProps={{x: "2341", y: "2468", width: "298", height: "45", xlinkHref: factorXIIIHover}} normalProps={{x: "2319", y: "2442", width: "343", height: "96", xlinkHref: factorXIII}} />
<SvgHoverButton id="hamLaosethakul" href="https://soundcloud.com/ham-laosethakul" hoverProps={{x: "2251", y: "2540", width: "481", height: "48", xlinkHref: hamLaosethakulHover}} normalProps={{x: "2229", y: "2516", width: "526", height: "97", xlinkHref: hamLaosethakul}} />
<SvgHoverButton id="harold" href="https://soundcloud.com/djharoldd" hoverProps={{x: "2398", y: "2615", width: "187", height: "48", xlinkHref: haroldHover}} normalProps={{x: "2376", y: "2591", width: "233", height: "97", xlinkHref: harold}} />
<SvgHoverButton id="kia" href="https://soundcloud.com/kia-sydney" hoverProps={{x: "2449", y: "2693", width: "90", height: "47", xlinkHref: kiaHover}} normalProps={{x: "2426", y: "2668", width: "135", height: "96", xlinkHref: kia}} />
<SvgHoverButton id="woody92" href="https://soundcloud.com/woody92" hoverProps={{x: "2366", y: "2765", width: "252", height: "61", xlinkHref: woody92Hover}} normalProps={{x: "2341", y: "2741", width: "301", height: "108", xlinkHref: woody92}} />
<SvgHoverButton id="_LuulI_" href="https://soundcloud.com/luuli" hoverProps={{x: "3760", y: "2414", width: "177", height: "48", xlinkHref: _LuulI_Hover}} normalProps={{x: "3737", y: "2389", width: "224", height: "96", xlinkHref: _LuulI_}} />
<SvgHoverButton id="Bartolomé" href="https://soundcloud.com/bartolenosis" hoverProps={{x: "3713", y: "2262", width: "286", height: "48", xlinkHref: BartoloméHover}} normalProps={{x: "3690", y: "2237", width: "333", height: "96", xlinkHref: Bartolomé}} />
<SvgHoverButton id="DGrade_x_Durin_s_Bane" href="https://soundcloud.com/dgradeknockoff" hoverProps={{x: "3518", y: "2339", width: "646", height: "48", xlinkHref: DGrade_x_Durin_s_BaneHover}} normalProps={{x: "3494", y: "2314", width: "694", height: "96", xlinkHref: DGrade_x_Durin_s_Bane}} />
<SvgHoverButton id="Meuko___Meuko__live" href="https://soundcloud.com/meukomeuko" hoverProps={{x: "3552", y: "2487", width: "595", height: "60", xlinkHref: Meuko___Meuko__liveHover}} normalProps={{x: "3528", y: "2462", width: "642", height: "110", xlinkHref: Meuko___Meuko__live}} />
<SvgHoverButton id="Nicha_N_Hooch" href="https://soundcloud.com/alwaysanicha" hoverProps={{x: "3642", y: "2563", width: "414", height: "48", xlinkHref: Nicha_N_HoochHover}} normalProps={{x: "3619", y: "2538", width: "460", height: "96", xlinkHref: Nicha_N_Hooch}} />
<SvgHoverButton id="s1m0nc3ll0" href="https://soundcloud.com/simon-villaret" hoverProps={{x: "3694", y: "2637", width: "314", height: "48", xlinkHref: s1m0nc3ll0Hover}} normalProps={{x: "3670", y: "2612", width: "361", height: "97", xlinkHref: s1m0nc3ll0}} />
<SvgHoverButton id="Synergetix_live" hoverProps={{x: "3627", y: "2714", width: "442", height: "60", xlinkHref: Synergetix_liveHover}} normalProps={{x: "3603", y: "2689", width: "492", height: "110", xlinkHref: Synergetix_live}} />
<SvgHoverButton id="Thick_Owens_pres_The_Coretaker"  href="https://soundcloud.com/thickowens" hoverProps={{x: "3393", y: "2788", width: "912", height: "59", xlinkHref: Thick_Owens_pres_The_CoretakerHover}} normalProps={{x: "3369", y: "2763", width: "960", height: "109", xlinkHref: Thick_Owens_pres_The_Coretaker}} />
<SvgHoverButton id="ExitButton" href="/" hoverProps={{x: "285", y: "348", width: "204", height: "210", xlinkHref: ExitButtonHover}} normalProps={{x: "303", y: "367", width: "172", height: "172", xlinkHref: ExitButton}} />
<SvgHoverButton id="_Artemis"  href="https://soundcloud.com/artemis_424" hoverProps={{x: "1014", y: "2310", width: "221", height: "47", xlinkHref: _ArtemisHover}} normalProps={{x: "991", y: "2285", width: "268", height: "97", xlinkHref: _Artemis}} />
<SvgHoverButton id="DJ_Marcelle" href="https://soundcloud.com/marcelle" hoverProps={{x: "966", y: "2384", width: "320", height: "58", xlinkHref: DJ_MarcelleHover}} normalProps={{x: "942", y: "2359", width: "368", height: "106", xlinkHref: DJ_Marcelle}} />
<SvgHoverButton id="KL_Mai" href="https://instagram.com/pd_sky/" hoverProps={{x: "1012", y: "2461", width: "225", height: "47", xlinkHref: KL_MaiHover}} normalProps={{x: "990", y: "2436", width: "272", height: "97", xlinkHref: KL_Mai}} />
<SvgHoverButton id="Mija_Healey" href="https://soundcloud.com/mijahealey"  hoverProps={{x: "963", y: "2534", width: "330", height: "62", xlinkHref: Mija_HealeyHover}} normalProps={{x: "941", y: "2510", width: "375", height: "109", xlinkHref: Mija_Healey}} />
<SvgHoverButton id="Nar" href="https://soundcloud.com/naaaaar" hoverProps={{x: "1076", y: "2612", width: "101", height: "45", xlinkHref: NarHover}} normalProps={{x: "1053", y: "2587", width: "147", height: "96", xlinkHref: Nar}} />
<SvgHoverButton id="Pyruvic_Acid" href="https://soundcloud.com/mynameisnotmata" hoverProps={{x: "953", y: "2685", width: "348", height: "62", xlinkHref: Pyruvic_AcidHover}} normalProps={{x: "932", y: "2661", width: "393", height: "109", xlinkHref: Pyruvic_Acid}} />
<SvgHoverButton id="Spekki_Webu" href="https://soundcloud.com/spekkiwbu" hoverProps={{x: "950", y: "2759", width: "354", height: "61", xlinkHref: Spekki_WebuHover}} normalProps={{x: "926", y: "2735", width: "401", height: "110", xlinkHref: Spekki_Webu}} />
<SvgHoverButton id="Vox_supreme" href="https://soundcloud.com/voxsupreme" hoverProps={{x: "945", y: "2837", width: "359", height: "58", xlinkHref: Vox_supremeHover}} normalProps={{x: "922", y: "2810", width: "407", height: "109", xlinkHref: Vox_supreme}} />
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

export function Credits() {
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
