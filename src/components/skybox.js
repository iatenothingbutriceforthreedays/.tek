import "three/examples/js/pmrem/PMREMGenerator";
import "three/examples/js/pmrem/PMREMCubeUVPacker";

import { Room3Shader, registerRegularShader } from "../gltf-component-mappings"
//import Skybox1 from "../shaders/Skybox1"

import qsTruthy from "../utils/qs_truthy";
const isBotMode = qsTruthy("bot");


const {
  Scene,
  CubeCamera,
  Object3D,
  Vector3,
  BoxBufferGeometry,
  ShaderMaterial,
  UniformsUtils,
  BackSide,
  Mesh,
  UniformsLib,
  PMREMGenerator,
  PMREMCubeUVPacker
} = THREE;

const Shader = Room3Shader;

export default class Sky extends Object3D {
  static shader = {
    uniforms: UniformsUtils.merge([
      UniformsLib.fog,
      {
        luminance: { value: 1 },
        turbidity: { value: 10 },
        rayleigh: { value: 2 },
        mieCoefficient: { value: 0.005 },
        mieDirectionalG: { value: 0.8 },
        sunPosition: { value: new Vector3() }
      },
      Shader.uniforms
    ]),
    vertexShader: Shader.vertexShader,
    fragmentShader: Shader.fragmentShader
  };

  static _geometry = new BoxBufferGeometry(1, 1, 1);

  constructor() {
    super();

    this.shader = {
      fragmentShader: Sky.shader.fragmentShader,
      vertexShader: Sky.shader.vertexShader,
      uniforms: UniformsUtils.clone(Sky.shader.uniforms),
      side: BackSide,
      fog: true
    }

    const material = new ShaderMaterial(this.shader);

    this.skyScene = new Scene();
    this.cubeCamera = new CubeCamera(1, 10000000000, 512);
    this.skyScene.add(this.cubeCamera);

    this.sky = new Mesh(Sky._geometry, material);
    this.sky.name = "Sky";
    this.add(this.sky);

    this._inclination = 0;
    this._azimuth = 0.15;
    this._distance = 8000;
    this.updateSunPosition();
  }

  tick() {
    if (!this.registered) {
      const sceneEl = AFRAME.scenes[0];
      const effectsSystem = sceneEl && sceneEl.systems["hubs-systems"].effectsSystem;
      if (effectsSystem && effectsSystem.ready) {
        effectsSystem.registerShader(this.shader);
        this.registered = true;
      }
    }
  }


  get turbidity() {
    return this.sky.material.uniforms.turbidity.value;
  }

  set turbidity(value) {
    this.sky.material.uniforms.turbidity.value = value;
  }

  get rayleigh() {
    return this.sky.material.uniforms.rayleigh.value;
  }

  set rayleigh(value) {
    this.sky.material.uniforms.rayleigh.value = value;
  }

  get luminance() {
    return this.sky.material.uniforms.luminance.value;
  }

  set luminance(value) {
    this.sky.material.uniforms.luminance.value = value;
  }

  get mieCoefficient() {
    return this.sky.material.uniforms.mieCoefficient.value;
  }

  set mieCoefficient(value) {
    this.sky.material.uniforms.mieCoefficient.value = value;
  }

  get mieDirectionalG() {
    return this.sky.material.uniforms.mieDirectionalG.value;
  }

  set mieDirectionalG(value) {
    this.sky.material.uniforms.mieDirectionalG.value = value;
  }

  get inclination() {
    return this._inclination;
  }

  set inclination(value) {
    this._inclination = value;
    this.updateSunPosition();
  }

  get azimuth() {
    return this._azimuth;
  }

  set azimuth(value) {
    this._azimuth = value;
    this.updateSunPosition();
  }

  get distance() {
    return this._distance;
  }

  set distance(value) {
    this._distance = value;
    this.updateSunPosition();
  }

  updateSunPosition() {
    const theta = Math.PI * (this._inclination - 0.5);
    const phi = 2 * Math.PI * (this._azimuth - 0.5);

    const distance = Math.min(1000, this._distance);

    const x = distance * Math.cos(phi);
    const y = distance * Math.sin(phi) * Math.sin(theta);
    const z = distance * Math.sin(phi) * Math.cos(theta);

    this.sky.material.uniforms.sunPosition.value.set(x, y, z).normalize();
    this.sky.scale.set(distance, distance, distance);
  }

  generateEnvironmentMap(renderer) {
    this.skyScene.add(this.sky);
    this.cubeCamera.update(renderer, this.skyScene);
    this.add(this.sky);
    const vrEnabled = renderer.vr.enabled;
    renderer.vr.enabled = false;
    const pmremGenerator = new PMREMGenerator(this.cubeCamera.renderTarget.texture);
    pmremGenerator.update(renderer);
    const pmremCubeUVPacker = new PMREMCubeUVPacker(pmremGenerator.cubeLods);
    pmremCubeUVPacker.update(renderer);
    renderer.vr.enabled = vrEnabled;
    pmremGenerator.dispose();
    pmremCubeUVPacker.dispose();
    return pmremCubeUVPacker.CubeUVRenderTarget.texture;
  }

  copy(source, recursive = true) {
    if (recursive) {
      this.remove(this.sky);
    }

    super.copy(source, recursive);

    if (recursive) {
      const skyIndex = source.children.indexOf(source.sky);

      if (skyIndex !== -1) {
        this.sky = this.children[skyIndex];
      }
    }

    this.turbidity = source.turbidity;
    this.rayleigh = source.rayleigh;
    this.luminance = source.luminance;
    this.mieCoefficient = source.mieCoefficient;
    this.mieDirectionalG = source.mieDirectionalG;
    this.inclination = source.inclination;
    this.azimuth = source.azimuth;
    this.distance = source.distance;

    return this;
  }
}

AFRAME.registerComponent("skybox", {
  schema: {
    turbidity: { type: "number", default: 10 },
    rayleigh: { type: "number", default: 2 },
    luminance: { type: "number", default: 1 },
    mieCoefficient: { type: "number", default: 0.005 },
    mieDirectionalG: { type: "number", default: 0.8 },
    inclination: { type: "number", default: 0 },
    azimuth: { type: "number", default: 0.15 },
    distance: { type: "number", default: 8000 }
  },

  init() {
    this.sky = new Sky();
    this.sky.cubeCamera.children.forEach(o => (o.matrixNeedsUpdate = true));
    this.el.setObject3D("mesh", this.sky);

    this.updateEnvironmentMap = this.updateEnvironmentMap.bind(this);
    // HACK: Render environment map on next frame to avoid bug where the render target texture is black.
    // This is likely due to the custom elements attached callback being synchronous on Chrome but not Firefox.
    // Added timeout due to additional case where texture is black in Firefox.
    requestAnimationFrame(() => setTimeout(this.updateEnvironmentMap));
  },

  tick() {
    this.sky.tick();
  },

  update(oldData) {
    if (this.data.turbidity !== oldData.turbidity) {
      this.sky.turbidity = this.data.turbidity;
    }

    if (this.data.rayleigh !== oldData.rayleigh) {
      this.sky.rayleigh = this.data.rayleigh;
    }

    if (this.data.luminance !== oldData.luminance) {
      this.sky.luminance = this.data.luminance;
    }

    if (this.data.mieCoefficient !== oldData.mieCoefficient) {
      this.sky.mieCoefficient = this.data.mieCoefficient;
    }

    if (this.data.mieDirectionalG !== oldData.mieDirectionalG) {
      this.sky.mieDirectionalG = this.data.mieDirectionalG;
    }

    if (this.data.inclination !== oldData.inclination) {
      this.sky.inclination = this.data.inclination;
      this.el.object3D.matrixNeedsUpdate = true;
    }

    if (this.data.azimuth !== oldData.azimuth) {
      this.sky.azimuth = this.data.azimuth;
      this.el.object3D.matrixNeedsUpdate = true;
    }

    if (this.data.distance !== oldData.distance) {
      const distance = this.data.distance;

      // HACK Remove this if condition and always set the scale based on distance when the existing environments
      // have their sky scales set to 1.
      this.sky.distance = this.el.object3D.scale.x === 1 ? distance : 1;
      this.sky.matrixNeedsUpdate = true;
    }

    this.updateEnvironmentMap();
  },

  updateEnvironmentMap() {
    const environmentMapComponent = this.el.sceneEl.components["environment-map"];

    if (environmentMapComponent && !isBotMode) {
      const renderer = this.el.sceneEl.renderer;
      const envMap = this.sky.generateEnvironmentMap(renderer);
      environmentMapComponent.updateEnvironmentMap(envMap);
    }
  },

  remove() {
    this.el.removeObject3D("mesh");
  }
});
