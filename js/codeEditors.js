require("./libs/ace/ext-modelist.js") // Don't delete me! Needed by ace.req
class CodeEditor extends Card {
  constructor(type, fileExt) {
    super(type);
    this.fileExt = fileExt;
    this.type = type;
    this.editors = [];
    this.contentBuilder(this.card);
    this.buildMetadata("codeEditor");
  }

  // since the fullscreen class doesn't work on the ace_editor manually resize
  toggleAceFullscreen(h, w) {
    $(this.card).find(".ace_editor").each((idx, ele) => {
      $(ele).css({
        height: h,
        width: w
      }); // resizes the code editor so everything scales properly.
      $(ele).click();
      this.editors.forEach((e, i) => e.resize())
    });
  }

  ipcListeners() {
    __IPC.remote.ipcMain.on("card" + this.id + "_toggle_fullscreen", (event, args) => {
      this.toggleAceFullscreen(args[0], args[1]);
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
      if (i == 2)
        var face_editor = document.createElement("div");
      else
        var face_editor = document.createElement("textarea");
      face.appendChild(face_editor);
      faces.push(face);
    }

    faces.forEach(function (element, idx) {
      $(element.firstChild).attr({
        class: "editor",
        id: card.id + "codeEditor_" + idx
      });
      content.appendChild(element)
    });
    $(content).slick({
      dots: true,
      accessiblity: true,
      focusOnSelect: true,
      infinite: false,
      edgeFriction: true
    });
    card.appendChild(content);
    // leave out last card so it can be used for metadata
    this.initAce(faces.slice(0, faces.length - 1));
  }

  initAce(faces) {
    let cur = this;
    $(faces).each(function (idx) {
      let editor = ace.edit(this.lastElementChild.id);
      editor.setTheme("ace/theme/twilight");
      var modelist = ace.require("ace/ext/modelist");
      if (cur.fileExt != undefined) {
        var mode = modelist.getModeForPath(cur.fileExt).mode;
        editor.session.setMode(mode);
      }
      editor.on("change", () => cur.updateMetadata("codeEditor"));
      cur.editors.push(editor);
    });
  }
}
