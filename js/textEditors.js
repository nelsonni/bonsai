class TextEditor extends Card {
  constructor(type) {
    super(type);
    this.type = type;
    this.editors = [];
    this.contentBuilder(this.card);
    this.buildMetadata("codeEditor")
  }

  contentBuilder(card) {
    var content = document.createElement('div');
    $(content).attr({
      class: "editor",
      id: card.id + "_editor_" + this.id
    });
    let faces = [];
    let cur = this;
    for (let i = 0; i < 3; i++) {
      let face = document.createElement('div');
      if (i == 2)
        var face_editor = document.createElement("div");
      else
        var face_editor = document.createElement("textarea");
      face.appendChild(face_editor);
      faces.push(face);
    }
    faces.forEach(function(element, idx) {
      $(element.firstChild).attr({
        class: "editor",
        id: card.id + "codeEditor_" + idx
      });
      $(element.firstChild).on("change", () => cur.updateMetadata("codeEditor"));
      content.appendChild(element)
    });
    $(content).slick({
      dots: true,
      focusOnSelect: true
    });
    card.appendChild(content);
  }
}
