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
      // console.log("constructor version: " + this.canvas);
      this.canvasSnapshot();
      this.clearCanvas();
    } else {
      console.log("reusing old Canvas");
      // Raphael.sketchpad does not allow dynamic changes to editing property
    }
    return instance;
  }

  canvasSnapshot(){
    // console.log("canvasSnapshot version: " + this.canvas);
    var button = document.getElementById("canvasSnapshot");
    button.addEventListener('click', () => {
      console.log("listener version: " + this.canvas);
      var paper = this.canvas;
      var svg = paper.toSVG();
      newSketchpad("sketch");
      let card = getLastCard();
      canvg(document.getElementById('IDofCardCanvas'), svg);
      paper.clear();
      // $("#card_" + card.id + 'sketch_0').
    });
  }

  clearCanvas(){
    var button = document.getElementById("clearButton");
    button.addEventListener('click', () => {
      this.canvas.clear();
    });
  }
}
