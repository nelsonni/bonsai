const VERTICAL_PADDING = 30;
class TextEditor extends Card {
  constructor(type, name) {
    super(type, name);
    this.type = type;
    this.editors = [];
    this.contentBuilder(this.card);
    this.buildMetadata('codeEditor');
    this.buildExport();
  }

  buildExport() {
    let exportBtn = document.createElement("button")
    $(exportBtn).attr("id", "CardExpansion" + this.id)
      .addClass("exportBtn")
      .html("Export")
      .hide()
    $(this.card).append(exportBtn)
  }

  sendSave(idx) {
    ipcRenderer.send('saveSignal', {
      data: this.editors[idx].value,
      fileName: this.name,
      location: this.location
    });
    $('body').addClass('waiting');
  }

  contentBuilder(card) {
    var content = document.createElement('div');
    $(content).attr({
      class: 'editor',
      id: card.id + '_editor_' + this.id,
    });
    let faces = [];
    let cur = this;
    for (let i = 0; i < 3; i++) {
      let face = document.createElement('div');
      if (i == 2)
        var faceEditor = document.createElement('div');
      else {
        var faceEditor = document.createElement('textarea');
        this.editors.push(faceEditor);
      }

      face.appendChild(faceEditor);
      faces.push(face);
    }

    faces.forEach((element, idx) => {
      $(element.firstChild).attr({
          class: 'editor',
          id: card.id + 'codeEditor_' + idx,
          rows: 19,
          cols: 200,
        })
        .on('change', () => cur.updateMetadata('codeEditor'))
        .select(() => this.exportCard(window.getSelection().toString()))
      content.appendChild(element);
    });
    $(content).slick({
      dots: true,
      focusOnSelect: true,
      infinite: false,
      edgeFriction: true,
    });
    this.carousel = content;
    $(content).find(".slick-arrow").hide();
    $(content).find(".slick-dots").hide();
    card.appendChild(content);;
  }

  exportCard(cur) {
    $("#CardExpansion" + this.id).show()
      .on('click', () => {
        let newCard = canvas.newTextEditor({
          ext: this.fileExt
        });
        $(newCard.editors[0]).val(cur);
        $(".exportBtn").hide();
      });
  }

  toggleFullscreen() {
    __IPC.remote.ipcMain.on('card' + this.id + '_toggle_fullscreen', (event, args) => {
      this.editors.forEach((ele, idx) => {
        $(this.editors[idx]).css({
          height: this.card.offsetHeight - VERTICAL_PADDING,
          width: this.card.offsetWidth,
        });
      });
    });
  }

  ipcListeners() {
    this.toggleFullscreen();
  }
}