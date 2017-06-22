const VERTICAL_PADDING = 30;
class TextEditor extends Card {
  constructor(type) {
    super(type);
    this.type = type;
    this.editors = [];
    this.contentBuilder(this.card);
    this.buildMetadata("codeEditor")
    this.ipcListeners();
    console.log(this);
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
      else {
        var face_editor = document.createElement("textarea");
        this.editors.push(face_editor)
      }
      face.appendChild(face_editor);
      faces.push(face);
    }
    faces.forEach((element, idx) => {
      $(element.firstChild).attr({
          class: "editor",
          id: card.id + "codeEditor_" + idx,
          rows: 19,
          cols: 200
        })
        .on("change", () => cur.updateMetadata("codeEditor"));
      content.appendChild(element)
    });
    $(content).slick({
      dots: true,
      focusOnSelect: true
    });
    card.appendChild(content);
  }

  ipcListeners() {
    __IPC.remote.ipcMain.on("card" + this.id + "_toggle_fullscreen", (event, args) => {
      this.editors.forEach((ele, idx) => {
        $(this.editors[idx]).css({
          height: this.card.offsetHeight - VERTICAL_PADDING,
          width: this.card.offsetWidth
        })
      });
    });
  }
}
