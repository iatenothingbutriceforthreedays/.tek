import { injectCustomShaderChunks } from "../utils/media-utils";
import { AVATAR_TYPES } from "../utils/avatar-utils";
import { registerComponentInstance, deregisterComponentInstance } from "../utils/component-utils";
import { debounce } from "lodash";

function ensureAvatarNodes(json) {
  const { nodes } = json;
  if (!nodes.some(node => node.name === "Head")) {
    // If the avatar model doesn't have a Head node. The user has probably chosen a custom GLB.
    // So, we need to construct a suitable hierarchy for avatar functionality to work.
    // We re-parent the original root node to the Head node and set the scene root to a new AvatarRoot.

    // Note: We assume that the first node in the primary scene is the one we care about.
    const originalRoot = json.scenes[json.scene].nodes[0];
    nodes.push({ name: "LeftEye", extensions: { MOZ_hubs_components: {} } });
    nodes.push({ name: "RightEye", extensions: { MOZ_hubs_components: {} } });
    nodes.push({
      name: "Head",
      children: [originalRoot, nodes.length - 1, nodes.length - 2],
      extensions: { MOZ_hubs_components: { "scale-audio-feedback": "" } }
    });
    nodes.push({ name: "Neck", children: [nodes.length - 1] });
    nodes.push({ name: "Spine", children: [nodes.length - 1] });
    nodes.push({ name: "Hips", children: [nodes.length - 1] });
    nodes.push({ name: "AvatarRoot", children: [nodes.length - 1] });
    json.scenes[json.scene].nodes[0] = nodes.length - 1;
  }
  return json;
}

// const getDoofStick = async (token) => {
//   const response = await fetch(
//     'https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/doofsticks',
//     {
//       method: 'GET',
//       headers: new Headers(
//         {
//           'Authorization': 'Bearer ' + token,
//           'Content-Type': 'application/json',
//         }
//       )
//     }
//   );
//   const myJson = await response.json();
//   return myJson
// }

/**
 * Sets player info state, including avatar choice and display name.
 * @namespace avatar
 * @component player-info
 */
AFRAME.registerComponent("player-info", {
  schema: {
    avatarSrc: { type: "string" },
    avatarType: { type: "string", default: AVATAR_TYPES.SKINNABLE },
    muted: { default: false }
  },
  init() {
    this.displayName = null;
    this.identityName = null;
    this.doofStick = null;
    this.isOwner = false;
    this.isRecording = false;
    this.applyProperties = this.applyProperties.bind(this);
    this.updateDisplayName = this.updateDisplayName.bind(this);
    this.applyDisplayName = this.applyDisplayName.bind(this);
    this.handleModelError = this.handleModelError.bind(this);
    this.update = this.update.bind(this);
    this.localStateAdded = this.localStateAdded.bind(this);
    this.localStateRemoved = this.localStateRemoved.bind(this);

    this.persist = this.persist.bind(this);
    this.persistBounced = debounce(this.persist, 15e3, { maxWait: 30e3, trailing: true })

    this.isLocalPlayerInfo = this.el.id === "avatar-rig";
    this.playerSessionId = null;

    if (!this.isLocalPlayerInfo) {
      NAF.utils.getNetworkedEntity(this.el).then(networkedEntity => {
        this.playerSessionId = NAF.utils.getCreator(networkedEntity);
        const playerPresence = window.APP.hubChannel.presence.state[this.playerSessionId];
        if (playerPresence) {
          this.updateDisplayNameFromPresenceMeta(playerPresence.metas[0]);
        }
      });
    }
    registerComponentInstance(this, "player-info");
  },
  remove() {
    deregisterComponentInstance(this, "player-info");
  },
  play() {
    this.el.addEventListener("model-loaded", this.applyProperties);
    this.el.sceneEl.addEventListener("presence_updated", this.updateDisplayName);
    if (this.isLocalPlayerInfo) {
      this.el.querySelector(".model").addEventListener("model-error", this.handleModelError);
    }
    window.APP.store.addEventListener("statechanged", this.update);

    this.el.sceneEl.addEventListener("stateadded", this.update);
    this.el.sceneEl.addEventListener("stateremoved", this.update);

    if (this.isLocalPlayerInfo) {
      this.el.sceneEl.addEventListener("stateadded", this.localStateAdded);
      this.el.sceneEl.addEventListener("stateremoved", this.localStateRemoved);
    }
  },
  pause() {
    this.el.removeEventListener("model-loaded", this.applyProperties);
    this.el.sceneEl.removeEventListener("presence_updated", this.updateDisplayName);

    if (this.isLocalPlayerInfo) {
      this.el.querySelector(".model").removeEventListener("model-error", this.handleModelError);
    }

    this.el.sceneEl.removeEventListener("stateadded", this.update);
    this.el.sceneEl.removeEventListener("stateremoved", this.update);
    window.APP.store.removeEventListener("statechanged", this.update);

    if (this.isLocalPlayerInfo) {
      this.el.sceneEl.removeEventListener("stateadded", this.localStateAdded);
      this.el.sceneEl.removeEventListener("stateremoved", this.localStateRemoved);
    }
  },

  update() {
    this.applyProperties();
  },
  updateDisplayName(e) {
    if (!this.playerSessionId && this.isLocalPlayerInfo) {
      this.playerSessionId = NAF.clientId;
    }
    if (!this.playerSessionId) return;
    if (this.playerSessionId !== e.detail.sessionId) return;

    this.updateDisplayNameFromPresenceMeta(e.detail);
  },

  updateDisplayNameFromPresenceMeta(presenceMeta) {
    this.displayName = presenceMeta.profile.displayName;
    this.identityName = presenceMeta.profile.identityName;
    this.doofStick = presenceMeta.profile.doofStick;
    this.isRecording = !!(presenceMeta.streaming || presenceMeta.recording);
    this.isOwner = !!(presenceMeta.roles && presenceMeta.roles.owner);
    this.applyDisplayName();
  },

  async persist(data) {
    fetch("https://us-central1-dr33mphaz3r-functions.cloudfunctions.net/dr33mphaz3r/doofsticks", {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + window.APP.store.state.credentials.token,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Not 2xx response");
        } else {
          console.log(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

  applyDisplayName() {
    const store = window.APP.store;

    const infoShouldBeHidden =
      this.isLocalPlayerInfo || (store.state.preferences.onlyShowNametagsInFreeze && !this.el.sceneEl.is("frozen"));

    const nametagEl = this.el.querySelector(".nametag");
    const identityNameEl = this.el.querySelector(".identityName");
    const doofStickEl = this.el.querySelector(".doofStick");

    if (this.isLocalPlayerInfo) {
      if (this.doofStick && doofStickEl && this.displayName && nametagEl) {
        if (
          window.APP.store.state.credentials.token &&
          (doofStickEl.getAttribute("text").value !== this.doofStick ||
            nametagEl.getAttribute("text").value !== this.displayName)
        ) {
          this.persistBounced({ message: this.doofStick, name: this.displayName });
        }
      }
    }

    if (this.displayName && nametagEl) {
      nametagEl.setAttribute("text", { value: this.displayName });
      nametagEl.object3D.visible = !infoShouldBeHidden;
    }

    if (this.doofStick && doofStickEl) {
      doofStickEl.setAttribute("text", { value: this.doofStick });
      doofStickEl.object3D.visible = !infoShouldBeHidden;
    }

    if (identityNameEl) {
      if (this.identityName) {
        identityNameEl.setAttribute("text", { value: this.identityName });
        identityNameEl.object3D.visible = this.el.sceneEl.is("frozen");
      }
    }

    const recordingBadgeEl = this.el.querySelector(".recordingBadge");
    if (recordingBadgeEl) {
      recordingBadgeEl.object3D.visible = this.isRecording && !infoShouldBeHidden;
    }

    const modBadgeEl = this.el.querySelector(".modBadge");
    if (modBadgeEl) {
      modBadgeEl.object3D.visible = !this.isRecording && this.isOwner && !infoShouldBeHidden;
    }
  },
  applyProperties(e) {
    this.applyDisplayName();

    const modelEl = this.el.querySelector(".model");
    if (this.data.avatarSrc && modelEl) {
      modelEl.components["gltf-model-plus"].jsonPreprocessor = ensureAvatarNodes;
      modelEl.setAttribute("gltf-model-plus", "src", this.data.avatarSrc);
    }

    if (!e || e.target === modelEl) {
      const uniforms = injectCustomShaderChunks(this.el.object3D);
      this.el.querySelectorAll("[hover-visuals]").forEach(el => {
        el.components["hover-visuals"].uniforms = uniforms;
      });
    }
  },
  handleModelError() {
    window.APP.store.resetToRandomDefaultAvatar();
  },
  localStateAdded(e) {
    if (e.detail === "muted") {
      this.el.setAttribute("player-info", { muted: true });
    }
  },
  localStateRemoved(e) {
    if (e.detail === "muted") {
      this.el.setAttribute("player-info", { muted: false });
    }
  }
});
