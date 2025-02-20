import React, { useState, useEffect } from "react";
import { deburr } from "lodash";
import { SvgHoverButton, SvgToggleButton } from "../utils/svg-helpers";
import { TextForm, TextArea } from "./text-form";
import { Slider } from "./slider";

import Modal from "react-modal";
import { SCHEMA } from "../storage/store";

import { handleTextFieldBlur, handleTextFieldFocus } from "../utils/focus-utils";

import { inLobby } from "../room-metadata";

const Backplate = "https://str33m.dr33mphaz3r.net/static-assets/menu/Backplate.png";
const BackplateWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Backplate.webp";
const HomeExit = "https://str33m.dr33mphaz3r.net/static-assets/menu/Home_Exit.png";
const HomeExitWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Home_Exit.webp";
const HomeExitHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Home_Exit_Hover.png";
const HomeExitHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Home_Exit_Hover.webp";
const LobbyExit = "https://str33m.dr33mphaz3r.net/static-assets/menu/Lobby_Exit.png";
const LobbyExitWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Lobby_Exit.webp";
const LobbyExitHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Lobby_Exit_Hover.png";
const LobbyExitHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Lobby_Exit_Hover.webp";
const MenuClosed = "https://str33m.dr33mphaz3r.net/static-assets/menu/Menu_Closed.png";
const MenuClosedWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Menu_Closed.webp";
const MenuOpen = "https://str33m.dr33mphaz3r.net/static-assets/menu/Menu_Open_Eyeball.png";
const MenuOpenWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Menu_Open_Eyeball.webp";
const Report = "https://str33m.dr33mphaz3r.net/static-assets/menu/Report.png";
const ReportWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Report.webp";
const SliderEye = "https://str33m.dr33mphaz3r.net/static-assets/menu/Slider.png";
const SliderEyeWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Slider.webp";
const ReportHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Report_Hover.png";
const ReportHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Report_Hover.webp";
const Room1Button = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_1_Button.png";
const Room1ButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_1_Button.webp";
const Room1ButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_1_Button_Hover.png";
const Room1ButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_1_Button_Hover.webp";
const Room2Button = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_2_Button.png";
const Room2ButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_2_Button.webp";
const Room2ButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_2_Button_Hover.png";
const Room2ButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_2_Button_Hover.webp";
const Room3Button = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_3_Button.png";
const Room3ButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_3_Button.webp";
const Room3ButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_3_Button_Hover.png";
const Room3ButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Room_3_Button_Hover.webp";
const ProfileButton = "https://str33m.dr33mphaz3r.net/static-assets/menu/Profile.png";
const ProfileButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Profile.webp";
const ProfileButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/Profile_Hover.png";
const ProfileButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/Profile_Hover.webp";
const MicrophoneOff = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOff.png";
const MicrophoneOffWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOff.webp";
const MicrophoneOffHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOff_Hover.png";
const MicrophoneOffHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOff_Hover.webp";
const MicrophoneOn = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOn.png";
const MicrophoneOnWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOn.webp";
const MicrophoneOnHover = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOn.png";
const MicrophoneOnHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/menu/MicrophoneOn.webp";

const modalSmallBg = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.png";
const modalSmallBgWebp = "https://str33m.dr33mphaz3r.net/static-assets/modal/modal-small-bg.webp";
const ExitButton = "https://str33m.dr33mphaz3r.net/static-assets/credits/ExitButton.png";
const ExitButtonWebp = "https://str33m.dr33mphaz3r.net/static-assets/credits/ExitButton.webp";
const ExitButtonHover = "https://str33m.dr33mphaz3r.net/static-assets/credits/ExitButtonHover.png";
const ExitButtonHoverWebp = "https://str33m.dr33mphaz3r.net/static-assets/credits/ExitButtonHover.webp";

const textStyles = {
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
};

const HoverButton = ({ normalProps, hoverProps, style, href, ...otherProps }) => {
  const [isShown, setIsShown] = useState(false);

  if (href) {
    return (
      <a href={href}>
        <img
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
          style={{
            ...style,
            cursor: "pointer"
          }}
          {...(isShown ? hoverProps : normalProps)}
          src={isShown ? hoverProps["src"] : normalProps["src"]}
          {...otherProps}
        />
      </a>
    );
  }

  return (
    <img
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      style={{
        ...style,
        cursor: "pointer"
      }}
      {...(isShown ? hoverProps : normalProps)}
      src={isShown ? hoverProps["src"] : normalProps["src"]}
      {...otherProps}
    />
  );
};

export const DoofLoadout = ({ isOpen, setInModal, name, onNameChange, doofstick, onDoofStickChange }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setInModal(false)}
      contentLabel="3dit dr33m"
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
          backgroundImage: `url(${modalSmallBg})`,
          position: "relative",
          width: "600px",
          height: "600px",
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
        <HoverButton
          onClick={e => {
            e.preventDefault();
            setInModal(false);
            return false;
          }}
          hoverProps={{ width: "32", height: "32", src: ExitButtonHover }}
          normalProps={{ width: "32", height: "32", src: ExitButton }}
          style={{
            top: "44px",
            left: "64px",
            position: "absolute",
            zIndex: "9001"
          }}
        />
        <span>nam3</span>
        <TextForm
          type="text"
          style={textStyles}
          value={name}
          onValueChange={name => {
            const trimmedString = deburr(name.substring(0, 32));
            onNameChange(trimmedString);
            window.APP.store.update({ profile: { displayName: trimmedString } });
          }}
          minLength={1}
          maxLength={64}
          spellCheck="false"
          pattern={SCHEMA.definitions.profile.properties.displayName.pattern}
          onFocus={e => handleTextFieldFocus(e.target)}
          onBlur={() => handleTextFieldBlur()}
        />
        <span>D00F571C</span>
        <TextArea
          id={"menu-doofstick-input"}
          value={doofstick}
          onValueChange={doofstick => {
            const trimmedString = deburr(doofstick.substring(0, 120));
            onDoofStickChange(trimmedString);
            window.APP.store.update({ profile: { doofStick: trimmedString } });
          }}
          minLength={0}
          maxLength={120}
          style={{
            ...textStyles,
            minHeight: "120px"
          }}
          spellCheck="false"
          pattern={SCHEMA.definitions.profile.properties.doofStick.pattern}
          onFocus={e => handleTextFieldFocus(e.target)}
          onBlur={() => handleTextFieldBlur()}
        />
      </div>
    </Modal>
  );
};

export const Menu = ({
  watching,
  hidden,
  muted,
  volume = 0.9,
  name,
  doofstick,
  onMenuToggle,
  onMuteToggle,
  onNameChange,
  onDoofStickChange,
  onWatchToggle,
  onVolumeChange,
  onReport,
  onHome,
  onLobby,
  onRoom1,
  onRoom2,
  onRoom3,
  style,
  ...otherProps
}) => {
  const [vw, setVw] = useState(1920);
  const [inModal, setInModal] = useState(false);

  useEffect(() => {
    setVw(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    // vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }, []);

  const svgScale = 0.2;
  const SVG_WIDTH = 1865;

  const WatchToggle = ({ watching, onToggle }) => {
    const baseProps = { y: "2771", width: "217", height: "217", xlinkHrefWebp: SliderEyeWebp, xlinkHref: SliderEye };
    return (
      <SvgToggleButton
        active={!watching}
        onToggle={onToggle}
        normalProps={{ x: "756", ...baseProps }}
        activeProps={{ x: "520", ...baseProps }}
      />
    );
  };

  const MuteButton = ({ muted, onMuteToggle }) => {
    const mutePosition = {
      x: 1120,
      y: 2752,
      width: 238,
      height: 238
    };

    return (
      inLobby() &&
      !watching && (
        <SvgToggleButton
          active={muted}
          onToggle={onMuteToggle}
          activeProps={{ ...mutePosition, xlinkHrefWebp: MicrophoneOffWebp, xlinkHref: MicrophoneOff }}
          activeHoverProps={{ ...mutePosition, xlinkHrefWebp: MicrophoneOffHoverWebp, xlinkHref: MicrophoneOffHover }}
          normalProps={{ ...mutePosition, xlinkHrefWebp: MicrophoneOnWebp, xlinkHref: MicrophoneOn }}
          normalHoverProps={{ ...mutePosition, xlinkHrefWebp: MicrophoneOnHoverWebp, xlinkHref: MicrophoneOnHover }}
        />
      )
    );
  };

  const editPosition = { x: "427", y: "1197", width: "1020", height: "908" };
  const homePosition = { x: "1022", y: "3974", width: "353", height: "491" };
  const lobbyPosition = { x: "518", y: "3974", width: "353", height: "491" };
  const reportPosition = { x: "478", y: "3000", width: "938", height: "461" };
  const room1Position = { x: "473", y: "3609", width: "281", height: "281" };
  const room2Position = { x: "826", y: "3609", width: "281", height: "280" };
  const room3Position = { x: "1178", y: "3605", width: "281", height: "281" };

  return (
    <>
      <div id="svg-container" style={{ pointerEvents: "none", position: "fixed", top: 0, right: 0, height: "100%" }}>
        <svg
          width={SVG_WIDTH}
          height={4689}
          draggable={"false"}
          style={{
            transform: `scale(${(0.12 * SVG_WIDTH) / vw})`,
            transformOrigin: "right top",
            pointerEvents: hidden ? "none" : "auto",
            ...style
          }}
        >
          {!hidden && (
            <>
              <image draggable={false} x={218} y={486} width={1461} height={3828} href={Backplate} />

              <WatchToggle watching={watching} onToggle={onWatchToggle} />

              <MuteButton muted={muted} onMuteToggle={onMuteToggle} />

              <Slider href={SliderEye} volume={volume} onVolumeChange={onVolumeChange} />

              <SvgHoverButton
                id="EditProfile"
                onClick={() => setInModal(true)}
                normalProps={{ ...editPosition, xlinkHrefWebp: ProfileButtonWebp, xlinkHref: ProfileButton }}
                hoverProps={{ ...editPosition, xlinkHrefWebp: ProfileButtonHoverWebp, xlinkHref: ProfileButtonHover }}
              />

              <SvgHoverButton
                id="Report"
                onClick={onReport}
                normalProps={{ ...reportPosition, xlinkHrefWebp: ReportWebp, xlinkHref: Report }}
                hoverProps={{ ...reportPosition, xlinkHrefWebp: ReportHoverWebp, xlinkHref: ReportHover }}
              />
              <SvgHoverButton
                id="HomeExit"
                onClick={onHome}
                normalProps={{ ...homePosition, xlinkHrefWebp: HomeExitWebp, xlinkHref: HomeExit }}
                hoverProps={{ ...homePosition, xlinkHrefWebp: HomeExitHoverWebp, xlinkHref: HomeExitHover }}
              />
              <SvgHoverButton
                id="LobbyExit"
                onClick={onLobby}
                normalProps={{ ...lobbyPosition, xlinkHrefWebp: LobbyExitWebp, xlinkHref: LobbyExit }}
                hoverProps={{ ...lobbyPosition, xlinkHrefWebp: LobbyExitHoverWebp, xlinkHref: LobbyExitHover }}
              />
              <SvgHoverButton
                id="Room1Button"
                onClick={onRoom1}
                normalProps={{ ...room1Position, xlinkHrefWebp: Room1ButtonWebp, xlinkHref: Room1Button }}
                hoverProps={{ ...room1Position, xlinkHrefWebp: Room1ButtonHoverWebp, xlinkHref: Room1ButtonHover }}
              />
              <SvgHoverButton
                id="Room2Button"
                onClick={onRoom2}
                normalProps={{ ...room2Position, xlinkHrefWebp: Room2ButtonWebp, xlinkHref: Room2Button }}
                hoverProps={{ ...room2Position, xlinkHrefWebp: Room2ButtonHoverWebp, xlinkHref: Room2ButtonHover }}
              />
              <SvgHoverButton
                id="Room3Button"
                onClick={onRoom3}
                normalProps={{ ...room3Position, xlinkHrefWebp: Room3ButtonWebp, xlinkHref: Room3Button }}
                hoverProps={{ ...room3Position, xlinkHrefWebp: Room3ButtonHoverWebp, xlinkHref: Room3ButtonHover }}
              />
            </>
          )}
          <SvgToggleButton
            style={{ pointerEvents: "auto", zIndex: 100 }}
            active={!hidden}
            onToggle={() => {
              if (inModal || hidden) setInModal(false);
              onMenuToggle(hidden);
            }}
            normalProps={{
              x: "1034",
              y: "132",
              width: "738",
              height: "734",
              xlinkHrefWebp: MenuClosedWebp,
              xlinkHref: MenuClosed
            }}
            activeProps={{
              x: "1044",
              y: "134",
              width: "726",
              height: "727",
              xlinkHrefWebp: MenuOpenWebp,
              xlinkHref: MenuOpen
            }}
          />
        </svg>
      </div>

      {!hidden && inModal && (
        <DoofLoadout
          isOpen={inModal}
          setInModal={setInModal}
          name={name}
          onNameChange={onNameChange}
          doofstick={doofstick}
          onDoofStickChange={onDoofStickChange}
        />
      )}
    </>
  );
};
