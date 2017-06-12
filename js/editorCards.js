class editorCard extends Card {
  constructor(type) {
    super(type);
    this.type = type;
    this.contentBuilder(this.card);
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
      let face_editor = document.createElement("textarea");
      face.appendChild(face_editor);
      faces.push(face);
    }
    faces.forEach(function(element, idx) {
      $(element.firstChild).attr({
        class: "editor",
        id: card.id + "textEditor_" + idx
      });
      content.appendChild(element)
    });
    $(content).slick({
      dots: true,
      accessiblity: true,
      focusOnSelect: true
    });
    card.appendChild(content);
    $(faces).each(function(idx) {
      if (this.lastElementChild.id !== "") {
        let editor = ace.edit(this.lastElementChild.id);
        editor.setTheme("ace/theme/twilight");
        editor.session.setMode("ace/mode/javascript");
      }
    });
  }
}
