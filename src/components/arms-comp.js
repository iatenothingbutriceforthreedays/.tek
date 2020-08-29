import { paths } from "../systems/userinput/paths";

AFRAME.registerComponent("arms-comp", {
  schema: {
    rotate_up: {type: 'boolean', default: false},
    rotate_down: {type: 'boolean', default: false},
    rotate_left: {type: 'boolean', default: false},
    rotate_right: {type: 'boolean', default: false}
  },

  init: function() {
    // console.log(userinput.get(paths.actions.toggleARUP))
  //   console.log('qwop')
  //   console.log(this.el)
  //   window.addEventListener('keydown', (event) => {
  //     if (event.keyCode == 78) {
  //       this.el.setAttribute('rotation', '0 0 0')
  //     } else if (event.keyCode == 72) {
  //       this.data.rotate_up = true
  //     } else if (event.keyCode == 74) {
  //       this.data.rotate_down = true
  //     } else if (event.keyCode == 75) {
  //       this.data.rotate_left = true
  //     } else if (event.keyCode == 76) {
  //       this.data.rotate_right = true
  //     } 
  //   }, true)

  //   window.addEventListener('keyup', (event) => {
  //     if (event.keyCode == 72) {
  //       this.data.rotate_up = false
  //     }
      
  //     if (event.keyCode == 74) {
  //       this.data.rotate_down = false
  //     } 

  //     if (event.keyCode == 75) {
  //       this.data.rotate_left = false
  //     } 

  //     if (event.keyCode == 76) {
  //       this.data.rotate_right = false
  //     } 
  //   }, true)
    
  },

  tick: function () {
    const userinput = AFRAME.scenes[0].systems.userinput;
    // console.log(userinput.get(paths.actions.toggleARUP))


    if (userinput.get(paths.actions.toggleARUP)) {
      this.el.object3D.rotation.z += 0.05
    } else if (userinput.get(paths.actions.toggleARDOWN)) {
      this.el.object3D.rotation.z -= 0.05
    } else if (userinput.get(paths.actions.toggleARLEFT)) {
      this.el.object3D.rotation.x += 0.05
    } else if (userinput.get(paths.actions.toggleARRIGHT)) {
      this.el.object3D.rotation.x -= 0.05
    }
  }

});

