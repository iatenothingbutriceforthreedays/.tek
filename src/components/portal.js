// modified from trigger-volume.js

import { getRoomMetadata, getRoomURL } from "../room-metadata";
import { redirectIfNotAuthorized } from "../access-control";

// const sizeVec = new THREE.Vector3();
const boundingSphereWorldPositionVec = new THREE.Vector3();
const colliderWorldPositionVec = new THREE.Vector3();

AFRAME.registerComponent("portal", {
  schema: {
    colliders: { type: "selectorAll", default: "#avatar-pov-node" },
    padding: { type: "float", default: 0.01 },
    targetRoom: { type: "string", default: null },
    targetUrl: { type: "string", default: null },
    targetPos: { type: "vec3", default: null },
    targetObj: { type: "string", default: null },
    openInNewWindow: { type: "boolean", default: false }
  },
  init() {
    this.boundingSphere = new THREE.Sphere();
    this.collidingLastFrame = {};

    this.characterController = this.el.sceneEl.systems["hubs-systems"].characterController;
  },
  update() {
    const mesh = this.el.getObject3D("mesh");
    mesh.getWorldPosition(boundingSphereWorldPositionVec);
    mesh.geometry.computeBoundingSphere();
    boundingSphereWorldPositionVec.add(mesh.geometry.boundingSphere.center);
    this.boundingSphere.set(boundingSphereWorldPositionVec, mesh.geometry.boundingSphere.radius + this.data.padding);
  },
  openUrl(url) {
    if (this.data.openInNewWindow) {
      // Open new window and remove this object
      var popup = window.open(url);
      // i think this gets blocked by the browser but try to refocus the main window
      popup.blur();
      window.focus(); 
      this.el.parentNode.removeChild(this.el);
    } else {
      // Redirect immediately
      location.href = url;
    }
  },
  tick() {
    const colliders = this.data.colliders;

    for (let i = 0; i < colliders.length; i++) {
      const collider = colliders[i];
      const object3D = collider.object3D;

      object3D.getWorldPosition(colliderWorldPositionVec);
      const isColliding = this.boundingSphere.containsPoint(colliderWorldPositionVec);
      const collidingLastFrame = this.collidingLastFrame[object3D.id];

      if (isColliding && !collidingLastFrame) {
        // enter
        if (this.data.targetRoom) {
          if (!redirectIfNotAuthorized(this.data.targetRoom)) {
            getRoomURL(this.data.targetRoom).then(url => {
              if (!url) {
                console.error("invalid portal targetRoom:", this.data.targetRoom);
              }
              this.openUrl(url);
            });
          }
        } else if (this.data.targetUrl) {
          this.openUrl(this.data.targetUrl);
        }

        let targetPos;
        if (this.data.targetObj) {
          const el = document.querySelector("." + this.data.targetObj);
          if (!el || !el.object3D) {
            console.error("invalid targetObj", this.data.targetObj);
          } else {
            targetPos = el.object3D.position; // TODO should probably use getWorldPosition
          }
        } else if (this.data.targetPos && (Object.keys(this.data.targetPos).length > 0)) {
          targetPos = this.data.targetPos;
        }
        if (targetPos) {
          // move player to targetPos
          this.characterController.teleportTo(targetPos);
        }
      } else if (!isColliding && collidingLastFrame) {
        // exit
      }

      this.collidingLastFrame[object3D.id] = isColliding;
    }
  }
});
