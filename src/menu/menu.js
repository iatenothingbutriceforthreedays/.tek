import React, { useState, useEffect } from "react";
import { SvgButton as SvgHoverButton, SvgToggleButton } from "../utils/svg-helpers";
import { TextForm, TextArea } from "./text-form";
import { Slider } from "./slider";

// import networkAsset from "../utils/network-asset"

import DialogContainer from "../react-components/dialog-container";
import Modal from "react-modal";
import { SCHEMA } from "../storage/store";

import { handleTextFieldBlur, handleTextFieldFocus } from "../utils/focus-utils";

import { inLobby } from "../room-metadata";

import Backplate from "../assets/menu/Backplate.png";
import HomeExit from "../assets/menu/Home_Exit.png";
import HomeExitHover from "../assets/menu/Home_Exit_Hover.png";
import LobbyExit from "../assets/menu/Lobby_Exit.png";
import LobbyExitHover from "../assets/menu/Lobby_Exit_Hover.png";
import MenuClosed from "../assets/menu/Menu_Closed.png";
import MenuOpen from "../assets/menu/Menu_Open_Eyeball.png";
import Report from "../assets/menu/Report.png";
import SliderEye from "../assets/menu/Slider.png";
import ReportHover from "../assets/menu/Report_Hover.png";
import Room1Button from "../assets/menu/Room_1_Button.png";
import Room1ButtonHover from "../assets/menu/Room_1_Button_Hover.png";
import Room2Button from "../assets/menu/Room_2_Button.png";
import Room2ButtonHover from "../assets/menu/Room_2_Button_Hover.png";
import Room3Button from "../assets/menu/Room_3_Button.png";
import Room3ButtonHover from "../assets/menu/Room_3_Button_Hover.png";

import ProfileButton from "../assets/menu/Profile.png";
import ProfileButtonHover from "../assets/menu/Profile_Hover.png";

import MicrophoneOff from "../assets/menu/MicrophoneOff.png";
import MicrophoneOffHover from "../assets/menu/MicrophoneOff_Hover.png";
import MicrophoneOn from "../assets/menu/MicrophoneOn.png";
import MicrophoneOnHover from "../assets/menu/MicrophoneOn.png";

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

export const DoofLoadout = ({ isOpen, setInModal, name, onNameChange, doofstick, onDoofstickChange }) => {
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
          onChange={e => onNameChange(e.target.value)}
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
          onChange={e => onDoofstickChange(e.target.value)}
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
  onDoofstickChange,
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
  // let vw = 1920; //, vh
  const [vw, setVw] = useState(1920);
  const [inModal, setInModal] = useState(false);

  useEffect(() => {
    setVw(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    // vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  }, []);

  const svgScale = 0.2;
  const SVG_WIDTH = 1865;

  const WatchToggle = ({ watching, onToggle }) => {
    const baseProps = { y: "2771", width: "217", height: "217", href: SliderEye };
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
          activeProps={{ ...mutePosition, href: MicrophoneOff }}
          activeHoverProps={{ ...mutePosition, href: MicrophoneOffHover }}
          normalProps={{ ...mutePosition, href: MicrophoneOn }}
          normalHoverProps={{ ...mutePosition, href: MicrophoneOnHover }}
        />
      )
    );
  };

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
                normalProps={{ x: "427", y: "1197", width: "1020", height: "908", href: ProfileButton }}
                hoverProps={{ x: "427", y: "1197", width: "1020", height: "908", href: ProfileButtonHover }}
              />

              <SvgHoverButton
                id="Report"
                onClick={onReport}
                normalProps={{ x: "478", y: "3098", width: "938", height: "461", href: Report }}
                hoverProps={{ x: "478", y: "3098", width: "938", height: "461", href: ReportHover }}
              />
              <SvgHoverButton
                id="HomeExit"
                onClick={onHome}
                normalProps={{ x: "1032", y: "3981", width: "336", height: "475", href: HomeExit }}
                hoverProps={{ x: "1022", y: "3974", width: "353", height: "491", href: HomeExitHover }}
              />
              <SvgHoverButton
                id="LobbyExit"
                onClick={onLobby}
                normalProps={{ x: "460", y: "3965", width: "475", height: "475", href: LobbyExit }}
                hoverProps={{ x: "518", y: "3974", width: "353", height: "491", href: LobbyExitHover }}
              />
              <SvgHoverButton
                id="Room1Button"
                onClick={onRoom1}
                hoverProps={{ x: "473", y: "3609", width: "281", height: "281", href: Room1ButtonHover }}
                normalProps={{ x: "486", y: "3624", width: "251", height: "251", href: Room1Button }}
              />
              <SvgHoverButton
                id="Room2Button"
                onClick={onRoom2}
                hoverProps={{ x: "826", y: "3609", width: "281", height: "280", href: Room2ButtonHover }}
                normalProps={{ x: "839", y: "3623", width: "251", height: "251", href: Room2Button }}
              />

              <SvgHoverButton
                id="Room3Button"
                onClick={onRoom3}
                hoverProps={{ x: "1178", y: "3605", width: "281", height: "281", href: Room3ButtonHover }}
                normalProps={{ x: "1191", y: "3620", width: "251", height: "251", href: Room3Button }}
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
            normalProps={{ x: "1034", y: "132", width: "738", height: "734", href: MenuClosed }}
            activeProps={{ x: "1044", y: "134", width: "726", height: "727", href: MenuOpen }}
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
          onDoofstickChange={onDoofstickChange}
        />
      )}
    </>
  );
};