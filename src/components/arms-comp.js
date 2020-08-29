AFRAME.registerComponent("arms-comp", {
  schema: {
    rotate_up: {type: 'boolean', default: false},
    rotate_down: {type: 'boolean', default: false},
    rotate_left: {type: 'boolean', default: false},
    rotate_right: {type: 'boolean', default: false}
  },

  init: function() {
    console.log('qwop')
    console.log(this.el)
    window.addEventListener('keydown', (event) => {
      if (event.keyCode == 78) {
        this.el.setAttribute('rotation', '0 0 0')
        // if (this.el.getAttribute('visible') == false) {
          
        // } else {
        //   this.el.setAttribute('visible', false)
        // }
      } else if (event.keyCode == 72) {
        this.data.rotate_up = true
      } else if (event.keyCode == 74) {
        this.data.rotate_down = true
      } else if (event.keyCode == 75) {
        this.data.rotate_left = true
      } else if (event.keyCode == 76) {
        this.data.rotate_right = true
      } 
    }, true)

    window.addEventListener('keyup', (event) => {
      if (event.keyCode == 72) {
        this.data.rotate_up = false
      }
      
      if (event.keyCode == 74) {
        this.data.rotate_down = false
      } 

      if (event.keyCode == 75) {
        this.data.rotate_left = false
      } 

      if (event.keyCode == 76) {
        this.data.rotate_right = false
      } 
    }, true)
    
  },

  tick: function () {
    if (this.data.rotate_up == true) {
      this.el.object3D.rotation.z += 0.05
    } else if (this.data.rotate_down  == true) {
      this.el.object3D.rotation.z -= 0.05
    } else if (this.data.rotate_left  == true) {
      this.el.object3D.rotation.x += 0.05
    } else if (this.data.rotate_right  == true) {
      this.el.object3D.rotation.x -= 0.05
    }
  }

});

