import "./components/gltf-model-plus";
import { getSanitizedComponentMapping } from "./utils/component-mappings";
import { getRoomMetadata } from "./room-metadata";

import { TYPE, SHAPE, FIT } from "three-ammo/constants";
const COLLISION_LAYERS = require("./constants").COLLISION_LAYERS;

var css2obj = (str) => {
  return JSON.parse('{'+str
    .replace(/(\w*:)/g, '$1"')  //create json format
    .replace(/[;]/g, '";')
    .replace(/(\'{2,})/g, '"')
    .replace(/;(?!$)/g, ',')
    .replace(/;/g, '')
    .replace(/(['"])?([a-zA-Z0-9_-]+)(['"])?:/g, '"$2": ')
    .replace(/,\s*\}/,'}')
    .trim()+'}');
}

import { Glassy } from './shaders/Glassy.js';
import { ShinyShader } from './shaders/ShinyShader.js';
import { Flame } from './shaders/Flame.js'
import { Jelly } from './shaders/ShaderFrog/Jelly.js'
import { Neurons } from './shaders/ShaderFrog/Neurons.js'
import { Liquifier } from './shaders/ShaderFrog/Liquifier.js'
import { Room3Shader } from './shaders/Room3Shader.js'

import room1Preview from "./assets/textures/room1_1.png";
import room2Preview from "./assets/textures/room2_1.png";
import room3Preview from "./assets/textures/room3_1.png";
import lobbyPreview from "./assets/textures/lobby_1_grey.png"; // muted colours

export { Glassy, ShinyShader, Flame, Jelly, Neurons, Liquifier, Room3Shader }

const roomPreviews = {
  'room1': room1Preview,
  'room2': room2Preview,
  'room3': room3Preview,
  'lobby': lobbyPreview
}

const imageLoader = new THREE.TextureLoader();

//allow cross origin loading
imageLoader.crossOrigin = '';

const setUniforms = (material, uniforms) => {
  if (uniforms) {
    for (var key in uniforms) {
      material.uniforms[key].value = uniforms[key];
    }
  }
}

export const registerShaderFrogShader = (srcShader, uniforms) => {
  const sceneEl = AFRAME.scenes[0];
  const effectsSystem = sceneEl && sceneEl.systems["hubs-systems"].effectsSystem;
  if (effectsSystem) {
    var shader = JSON.parse(JSON.stringify(srcShader)) // deep copy to prevent shared uniforms
    shader.name = shader.name+Math.random().toString(); // Prevent ShaderFrog from linking with shaders with the same name
    var mat = effectsSystem.registerShaderFrogShader(shader);
    setUniforms(mat, uniforms)
    return mat;
  }
};

export const registerRegularShader = (srcShader, uniforms) => {
  const sceneEl = AFRAME.scenes[0];
  const effectsSystem = sceneEl && sceneEl.systems["hubs-systems"].effectsSystem;
  if (effectsSystem) {
    var shader = JSON.parse(JSON.stringify(srcShader)) // deep copy to prevent shared uniforms
    effectsSystem.registerShader(shader);
    var mat = new THREE.ShaderMaterial(shader);
    setUniforms(mat, uniforms);
    return mat;
  }
};

AFRAME.GLTFModelPlus.registerComponent("cube1_prop", "cube1_prop", (el, componentName, componentData) => {
  if (effectsSystem) {
    el.object3D.children[0].material = registerRegularShader(Flame, {});
    el.object3D.children[0].material.transparent = true;
  }
});

function registerRootSceneComponent(componentName) {
  AFRAME.GLTFModelPlus.registerComponent(componentName, componentName, (el, componentName, componentData) => {
    if (!el.classList.contains("DefaultAvatar")) {
      // (Avatar "background" property sometimes seems to override the one set on the scene)
      const sceneEl = AFRAME.scenes[0];

      sceneEl.setAttribute(componentName, componentData);

      sceneEl.addEventListener(
        "reset_scene",
        () => {
          sceneEl.removeAttribute(componentName);
        },
        { once: true }
      );
    }
  });
}

registerRootSceneComponent("fog");
// registerRootSceneComponent("background");

AFRAME.GLTFModelPlus.registerComponent("portal", "portal", (el, componentName, componentData) => {
  if (componentData.includes(':')) { //css style multi-attribute
    componentData = css2obj(componentData);
  } else {
    // old version with just the targetRoom
    componentData = {targetRoom: componentData};
  }
  if (componentData.targetRoom) {
    el.object3DMap.mesh.material = registerShaderFrogShader(Liquifier, {
      "tex": imageLoader.load(roomPreviews[componentData.targetRoom])
    });
  }
  const rm = getRoomMetadata();
  componentData['padding'] = rm.portalPadding !== undefined ? rm.portalPadding : -0.15;
  el.setAttribute("portal", componentData);
});

AFRAME.GLTFModelPlus.registerComponent("orb", "orb", (el, componentName, componentData) => {
  el.object3DMap.mesh.material = registerShaderFrogShader(Neurons, {});
  el.setAttribute("portal", {targetUrl: componentData, padding: 0.1, openInNewWindow:true});
});

AFRAME.GLTFModelPlus.registerComponent("setlist", "setlist");

AFRAME.GLTFModelPlus.registerComponent("duck", "duck", el => {
  el.setAttribute("duck", "");
  el.setAttribute("quack", { quackPercentage: 0.1 });
});
AFRAME.GLTFModelPlus.registerComponent("quack", "quack");
AFRAME.GLTFModelPlus.registerComponent("sound", "sound");
AFRAME.GLTFModelPlus.registerComponent("css-class", "css-class");
AFRAME.GLTFModelPlus.registerComponent("interactable", "css-class", (el, componentName) => {
  el.setAttribute(componentName, "interactable");
});
AFRAME.GLTFModelPlus.registerComponent("super-spawner", "super-spawner", (el, componentName, componentData) => {
  //TODO: Do not automatically add these components
  el.setAttribute("is-remote-hover-target", "");
  el.setAttribute("tags", { isHandCollisionTarget: true });
  el.setAttribute("hoverable-visuals", "");
  el.setAttribute(componentName, componentData);
});
AFRAME.GLTFModelPlus.registerComponent("gltf-model-plus", "gltf-model-plus");
AFRAME.GLTFModelPlus.registerComponent("media-loader", "media-loader");
AFRAME.GLTFModelPlus.registerComponent("body", "body-helper", el => {
  //This is only required for migration of old environments with super-spawners
  //will no longer be needed when spawners are added via Spoke instead.
  el.setAttribute("body-helper", {
    mass: 0,
    type: TYPE.STATIC,
    collisionFilterGroup: COLLISION_LAYERS.INTERACTABLES,
    collisionFilterMask: COLLISION_LAYERS.DEFAULT_SPAWNER
  });
});
AFRAME.GLTFModelPlus.registerComponent("ammo-shape", "shape-helper");
AFRAME.GLTFModelPlus.registerComponent("hide-when-quality", "hide-when-quality");
AFRAME.GLTFModelPlus.registerComponent("light", "light", (el, componentName, componentData) => {
  if (componentData.distance === 0) {
    componentData.decay = 0;
  }
  el.setAttribute(componentName, componentData);
  if (componentData.castShadow) {
    // HACK: component.light isn't set until one frame after setArrtibute
    setTimeout(() => {
      el.components.light.light.shadow.camera.matrixNeedsUpdate = true;
    }, 0);
  }
});
AFRAME.GLTFModelPlus.registerComponent("ambient-light", "ambient-light");
AFRAME.GLTFModelPlus.registerComponent("directional-light", "directional-light");
AFRAME.GLTFModelPlus.registerComponent("hemisphere-light", "hemisphere-light");
AFRAME.GLTFModelPlus.registerComponent("point-light", "point-light");
AFRAME.GLTFModelPlus.registerComponent("spot-light", "spot-light");

AFRAME.GLTFModelPlus.registerComponent("simple-water", "simple-water");
AFRAME.GLTFModelPlus.registerComponent("skybox", "skybox");
AFRAME.GLTFModelPlus.registerComponent("layers", "layers");
AFRAME.GLTFModelPlus.registerComponent("shadow", "shadow");
AFRAME.GLTFModelPlus.registerComponent("water", "water");
AFRAME.GLTFModelPlus.registerComponent("scale-audio-feedback", "scale-audio-feedback");
AFRAME.GLTFModelPlus.registerComponent("morph-audio-feedback", "morph-audio-feedback");
AFRAME.GLTFModelPlus.registerComponent("animation-mixer", "animation-mixer");
AFRAME.GLTFModelPlus.registerComponent("loop-animation", "loop-animation");
AFRAME.GLTFModelPlus.registerComponent("uv-scroll", "uv-scroll");
AFRAME.GLTFModelPlus.registerComponent(
  "box-collider",
  "shape-helper",
  (() => {
    const euler = new THREE.Euler();
    return (el, componentName, componentData) => {
      const { scale, rotation } = componentData;
      euler.set(rotation.x, rotation.y, rotation.z);
      const orientation = new THREE.Quaternion().setFromEuler(euler);
      el.setAttribute(componentName, {
        type: SHAPE.BOX,
        fit: FIT.MANUAL,
        offset: componentData.position,
        halfExtents: { x: scale.x / 2, y: scale.y / 2, z: scale.z / 2 },
        orientation: { x: orientation.x, y: orientation.y, z: orientation.z, w: orientation.w }
      });
    };
  })()
);
AFRAME.GLTFModelPlus.registerComponent("visible", "visible", (el, componentName, componentData) => {
  if (typeof componentData === "object") {
    el.setAttribute(componentName, componentData.visible);
  } else {
    el.setAttribute(componentName, componentData);
  }
});
AFRAME.GLTFModelPlus.registerComponent("spawn-point", "spawn-point", el => {
  el.setAttribute("waypoint", {
    canBeSpawnPoint: true,
    canBeOccupied: false,
    canBeClicked: false,
    willDisableMotion: false,
    willDisableTeleporting: false,
    willMaintainWorldUp: true
  });
});
AFRAME.GLTFModelPlus.registerComponent("sticky-zone", "sticky-zone");
AFRAME.GLTFModelPlus.registerComponent("nav-mesh", "nav-mesh", (el, _componentName, componentData) => {
  const nav = AFRAME.scenes[0].systems.nav;
  const zone = componentData.zone || "character";
  let found = false;
  el.object3D.traverse(node => {
    if (node.isMesh && !found) {
      found = true;
      nav.loadMesh(node, zone);
    }
  });
  // There isn't actually an a-frame nav-mesh component, but we want to tag this el as a nav-mesh since
  // nav-mesh-helper will query for it later.
  el.setAttribute("nav-mesh");
});

AFRAME.GLTFModelPlus.registerComponent("pinnable", "pinnable");

AFRAME.GLTFModelPlus.registerComponent("waypoint", "waypoint", (el, componentName, componentData, components) => {
  if (componentData.canBeOccupied) {
    el.setAttribute("networked", {
      template: "#template-waypoint-avatar",
      attachTemplateToLocal: false,
      owner: "scene",
      persistent: true,
      networkId: components.networked.id
    });
  }
  el.setAttribute("waypoint", componentData);
});

AFRAME.GLTFModelPlus.registerComponent("media", "media", (el, componentName, componentData) => {
  if (componentData.id) {
    el.setAttribute("networked", {
      template: "#interactable-media",
      owner: "scene",
      persistent: true,
      networkId: componentData.id
    });
  }

  const mediaLoaderAttributes = {
    src: componentData.src,
    fitToBox: componentData.contentSubtype ? false : true,
    resolve: true,
    fileIsOwned: true,
    animate: false,
    contentSubtype: componentData.contentSubtype
  };

  if (componentData.version) {
    mediaLoaderAttributes.version = componentData.version;
  }

  el.setAttribute("media-loader", mediaLoaderAttributes);

  if (componentData.pageIndex) {
    el.setAttribute("media-pdf", { index: componentData.pageIndex });
    el.setAttribute("media-pager", { index: componentData.pageIndex });
  }

  if (componentData.paused !== undefined) {
    el.setAttribute("media-video", { videoPaused: componentData.paused });
  }

  if (componentData.time) {
    el.setAttribute("media-video", { time: componentData.time });
  }
});

async function mediaInflator(el, componentName, componentData, components) {
  let isControlled = true;

  if (components.networked) {
    isControlled = componentData.controls || componentName === "link";

    const hasVolume = componentName === "video" || componentName === "audio";
    const templateName = isControlled || hasVolume ? "#static-controlled-media" : "#static-media";

    el.setAttribute("networked", {
      template: templateName,
      owner: "scene",
      persistent: true,
      networkId: components.networked.id
    });
  }

  const mediaOptions = {};

  if (componentName === "video" || componentName === "image") {
    mediaOptions.projection = componentData.projection;
    mediaOptions.alphaMode = componentData.alphaMode;
    mediaOptions.alphaCutoff = componentData.alphaCutoff;
  }

  if (componentName === "video" || componentName === "audio") {
    mediaOptions.videoPaused = !componentData.autoPlay;
    mediaOptions.volume = componentData.volume;
    mediaOptions.loop = componentData.loop;
    mediaOptions.audioType = componentData.audioType;
    mediaOptions.hidePlaybackControls = true; // !isControlled;

    if (componentData.audioType === "pannernode") {
      mediaOptions.distanceModel = componentData.distanceModel;
      mediaOptions.rolloffFactor = componentData.rolloffFactor;
      mediaOptions.refDistance = componentData.refDistance;
      mediaOptions.maxDistance = componentData.maxDistance;
      mediaOptions.coneInnerAngle = componentData.coneInnerAngle;
      mediaOptions.coneOuterAngle = componentData.coneOuterAngle;
      mediaOptions.coneOuterGain = componentData.coneOuterGain;
    }

    el.setAttribute("video-pause-state", { paused: mediaOptions.videoPaused });
  }

  const src = componentName === "link" ? componentData.href : componentData.src;

  el.setAttribute("media-loader", {
    src,
    fitToBox: true,
    resolve: true,
    fileIsOwned: true,
    animate: false,
    mediaOptions
  });
}

AFRAME.GLTFModelPlus.registerComponent("image", "image", mediaInflator);
AFRAME.GLTFModelPlus.registerComponent("audio", "audio", mediaInflator, (name, property, value) => {
  if (property === "paused") {
    return { name: "video-pause-state", property, value };
  } else {
    return null;
  }
});
AFRAME.GLTFModelPlus.registerComponent("video", "video", mediaInflator, (name, property, value) => {
  if (property === "paused") {
    return { name: "video-pause-state", property, value };
  } else {
    return null;
  }
});
AFRAME.GLTFModelPlus.registerComponent("link", "link", mediaInflator);

AFRAME.GLTFModelPlus.registerComponent("hoverable", "is-remote-hover-target", el => {
  el.setAttribute("is-remote-hover-target", "");
  el.setAttribute("tags", { isHandCollisionTarget: true });
});

AFRAME.GLTFModelPlus.registerComponent("spawner", "spawner", (el, componentName, componentData) => {
  el.setAttribute("media-loader", {
    src: componentData.src,
    resolve: true,
    fileIsOwned: true,
    animate: false,
    moveTheParentNotTheMesh: true
  });
  el.setAttribute("css-class", "interactable");
  el.setAttribute("super-spawner", {
    src: componentData.src,
    resolve: true,
    template: "#interactable-media"
  });
  el.setAttribute("hoverable-visuals", "");
  el.setAttribute("body-helper", {
    mass: 0,
    type: TYPE.STATIC,
    collisionFilterGroup: COLLISION_LAYERS.INTERACTABLES,
    collisionFilterMask: COLLISION_LAYERS.DEFAULT_SPAWNER
  });
  el.setAttribute("is-remote-hover-target", "");
  el.setAttribute("tags", { isHandCollisionTarget: true });
});

const publicComponents = {
  video: {
    mappedComponent: "video-pause-state",
    publicProperties: {
      paused: {
        mappedProperty: "paused",
        getMappedValue(value) {
          return !!value;
        }
      }
    }
  },
  "loop-animation": {
    mappedComponent: "loop-animation",
    publicProperties: {
      paused: {
        mappedProperty: "paused",
        getMappedValue(value) {
          return !!value;
        }
      }
    }
  }
};

AFRAME.GLTFModelPlus.registerComponent(
  "trigger-volume",
  "trigger-volume",
  (el, componentName, componentData, components, indexToEntityMap) => {
    const {
      size,
      target,
      enterComponent,
      enterProperty,
      enterValue,
      leaveComponent,
      leaveProperty,
      leaveValue
    } = componentData;

    let enterComponentMapping, leaveComponentMapping, targetEntity;

    try {
      enterComponentMapping = getSanitizedComponentMapping(enterComponent, enterProperty, publicComponents);
      leaveComponentMapping = getSanitizedComponentMapping(leaveComponent, leaveProperty, publicComponents);

      targetEntity = indexToEntityMap[target];

      if (!targetEntity) {
        throw new Error(`Couldn't find target entity with index: ${target}.`);
      }
    } catch (e) {
      console.warn(`Error inflating gltf component "trigger-volume": ${e.message}`);
      return;
    }

    // Filter out scope and colliders properties.
    el.setAttribute("trigger-volume", {
      colliders: "#avatar-pov-node",
      size,
      target: targetEntity,
      enterComponent: enterComponentMapping.mappedComponent,
      enterProperty: enterComponentMapping.mappedProperty,
      enterValue: enterComponentMapping.getMappedValue(enterValue),
      leaveComponent: leaveComponentMapping.mappedComponent,
      leaveProperty: leaveComponentMapping.mappedProperty,
      leaveValue: leaveComponentMapping.getMappedValue(leaveValue)
    });
  }
);

AFRAME.GLTFModelPlus.registerComponent("heightfield", "heightfield", (el, componentName, componentData) => {
  el.setAttribute("shape-helper__heightfield", {
    type: SHAPE.HEIGHTFIELD,
    margin: 0.01,
    fit: FIT.MANUAL,
    heightfieldDistance: componentData.distance,
    offset: componentData.offset,
    heightfieldData: componentData.data
  });
});

AFRAME.GLTFModelPlus.registerComponent("trimesh", "trimesh", el => {
  el.setAttribute("shape-helper__trimesh", {
    type: SHAPE.MESH,
    margin: 0.01,
    fit: FIT.ALL,
    includeInvisible: true
  });
});

AFRAME.GLTFModelPlus.registerComponent("particle-emitter", "particle-emitter");

AFRAME.GLTFModelPlus.registerComponent("networked-drawing-buffer", "networked-drawing-buffer");

AFRAME.GLTFModelPlus.registerComponent("audio-settings", "audio-settings", (el, _componentName, componentData) => {
  el.sceneEl.systems["hubs-systems"].audioSettingsSystem.updateAudioSettings(componentData);
});
