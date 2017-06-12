class editorCard extends Card {
  constructor(type) {
    super(type);
    this.type = type;
    this.editors = [];
    this.contentBuilder(this.card);
  }

  toggleSwipe(value) {
    $(this.card.lastElementChild).slick("slickSetOption", "swipe", value, false);
  }

  // since the fullscreen class doesn't work on the ace_editor manually resize
  toggleAceFullscreen(h, w) {
    $(this.card).find(".ace_editor").each((idx, ele) => {
      $(ele).css({
        height: h,
        width: w
      }); // resizes the code editor so everything scales properly.
      this.editors.forEach((e, i) => e.resize())
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
    this.initAce(faces);
  }

  initAce(faces) {
    let cur = this;
    $(faces).each(function(idx) {
      let editor = ace.edit(this.lastElementChild.id);
      editor.setTheme("ace/theme/twilight");
      editor.session.setMode("ace/mode/javascript");
      cur.editors.push(editor);
    });
  }
}
