// Block-level variable to store class state; allowing for Singleton pattern.
let instance = null;

class Canvas {
  constructor() {
    if (!instance) {
      instance = this;
      console.log("creating new Canvas");

      let canvasPad = document.createElement('div');
      $(canvasPad).attr({id: 'canvasPad', class: 'canvas-sketch'});
      document.body.appendChild(canvasPad);

      this.canvas = Raphael.sketchpad('canvasPad', {
        height: '100%',
        width: '100%',
        editing: true
      });
    } else {
      console.log("reusing old Canvas");
      // Raphael.sketchpad does not allow dynamic changes to editing property
    }
    return instance;
  }

}
