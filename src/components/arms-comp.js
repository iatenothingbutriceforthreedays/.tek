AFRAME.registerComponent("arms-comp", {
  schema: {
    rotate_up: {type: 'boolean', default: false},
    rotate_down: {type: 'boolean', default: false}
  },

  init: function() {
    console.log('qwop')
    window.addEventListener('keydown', (event) => {
      if (event.keyCode == 78) {
        if (this.el.getAttribute('visible') == false) {
          this.el.setAttribute('visible', true)
        } else {
          this.el.setAttribute('visible', false)
        }
      } else if (event.keyCode == 86) {
        this.data.rotate_up = true
      } else if (event.keyCode == 66) {
        this.data.rotate_down = true
      } 
    }, true)

    window.addEventListener('keyup', (event) => {
      if (event.keyCode == 86) {
        this.data.rotate_up = false
      }
      
      if (event.keyCode == 66) {
        this.data.rotate_down = false
      } 
    }, true)
    
  },

  tick: function () {
    if (this.data.rotate_up == true) {
      this.el.object3D.rotation.z += 0.05
    } else if (this.data.rotate_down  == true) {
      this.el.object3D.rotation.z -= 0.05
    }
  }

});

