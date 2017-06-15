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
      content.appendChild(element)
    });
    $(content).slick({
      dots: true,
      accessiblity: true,
      focusOnSelect: true
    });
    card.appendChild(content);
    // leave out last card so it can be used for metadata
    this.initAce(faces.slice(0, faces.length - 1));
  }

  initAce(faces) {
    let cur = this;
    $(faces).each(function(idx) {
      let editor = ace.edit(this.lastElementChild.id);
      editor.setTheme("ace/theme/twilight");
      require.config({paths:{"ace": "./../libs/ace"}});
      require(["ace/ace", "ace/ext/modelist"], function(ace){
        var modelist = ace.require("ace/ext/modelist");
        console.log(modelist, cur.fileExt);
        var mode = modelist.getModeForPath(cur.fileExt).mode;
        console.log(mode);
        editor.session.setMode(mode);
    });
      editor.on("change", () => cur.updateMetadata("codeEditor"));
      cur.editors.push(editor);
    });
  }
}
