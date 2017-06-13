class Sketchpad extends Card {
  constructor(type) {
    super(type)
    this.type = type;
    this.sketches = [];
    this.pens = [];

    this.contentBuilder(this.card);
    this.setDrawEffects();
    this.eventListeners();
    this.buildMetadata("sketch")
  }

  addButtons() {
    let red = document.createElement("button");
    let blue = document.createElement("button");
    let green = document.createElement("button");
    let black = document.createElement("button");
    let erase = document.createElement("button");
    let colors = ["red", "blue", "green", "black"];
    let cur = this;
    $([red, blue, green, black]).each(function(idx) {
      $(this).addClass("colorBtn").attr({
        id: "pen_" + colors[idx] + cur.id,
        value: colors[idx]
      }).css({
        backgroundColor: colors[idx]
      });
      $(cur.card).find(".editor").append(this);
      cur.pens.push($(this)[0]);
    });

    $(erase).attr({
      id: "pen_erase" + cur.id
    }).addClass("eraser");

    $(cur.card).find(".editor").append(erase);

    $(erase).on("click", function() {
      for (let i in cur.sketches) {
        if (cur.sketches[i].getState().editing === true)
          cur.sketches[i].editing("erase");
        else
          cur.sketches[i].editing(true);
      };
    });
  }

  setDrawEffects() {
    let canvases = [];
    for (let i = 0; i < 3; i++)
      canvases.push("card_" + this.id + "sketch_" + i);
    let curCard = this;
    $(canvases).each(function(idx) {
      let sketchPad = Raphael.sketchpad(canvases[idx], {
        height: "100%",
        width: "100%",
        editing: true
      });
      curCard.sketches.push(sketchPad);
      sketchPad.change(() => curCard.updateMetadata("sketch"))
    });
    this.addButtons();
  }

  eventListeners() {
    let cur = this;
    $(cur.pens).each(function(idx) {
      let penColor = $(this)[0].value;
      $("#" + $(this)[0].id).on("click", function(event) {
        $(cur.sketches).each(function() { // go through each sketch pad on current card
          $(this)[0].pen().color(penColor); // switch the pen to that color.
        });
      });
    });
  }

  contentBuilder(card) {
    var content = document.createElement('div');
    $(content).attr({
      class: "editor",
      id: card.id + "_editor_" + this.id
    });
    let faces = [];
    for (let i = 0; i < 3; i++) {
      let face = document.createElement('div');
      let face_editor = document.createElement("div");
      face.appendChild(face_editor);
      faces.push(face);
    }

    faces.forEach(function(element, idx) {
      $(element.firstChild).attr({
        class: "sketchEditor",
        id: card.id + "sketch_" + idx
      });
      content.appendChild(element)
    });

    $(content).slick({
      dots: true,
      swipe: false,
      accessiblity: true
    });
    card.appendChild(content);
  }
}
