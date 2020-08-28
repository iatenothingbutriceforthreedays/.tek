import { findAncestorWithComponent } from "../utils/scene-graph";

AFRAME.registerComponent("doofstick-comp", {
    schema: {
      playerSessionId: {type: 'string', default: null}
    },
  
    init: function() {
        // var playerSessionId = findAncestorWithComponent(this.el, "player-info").components["player-info"].playerSessionId;
          

        // window.addEventListener('action_doof_changed',(e) => {
        //     const {name} = e.detail
        //     window.APP.store.update({ profile: { doofStick: "akjshdfkjhasjhjkashfljhakljshfkjhasdkjhfkjshadkfjhkajshdfkhaskjdhfjahsdfakjshdfkjhasjhjkashfljhakljshfkjhasdkjhfkjshadkfjhkajshdfkhaskjdhfja" } })
        // }, false);


        // console.log(window.APP.store)
        // console.log(sha256(window.APP.store.state.credentials.email));
        // console.log(window.APP.store.state.credentials.token);
        // console.log(decode(window.APP.store.state.credentials.token));
        // console.log(this.el)

        // setInterval( () => {
        //     window.APP.store.update({ profile: { doofStick: "akjshdfkjhasjhjkashfljhakljshfkjhasdkjhfkjshadkfjhkajshdfkhaskjdhfjahsdfakjshdfkjhasjhjkashfljhakljshfkjhasdkjhfkjshadkfjhkajshdfkhaskjdhfja" } })
        // }, 10000);

        // console.log(findAncestorWithComponent(this.el, "player-info").components["player-info"].doofStick)
        // console.log(findAncestorWithComponent(this.el, "player-info").components["player-info"].displayName)
    },
  
    tick: function () {
    }
  
  });
  
  