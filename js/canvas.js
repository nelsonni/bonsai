const BTM_ROW_BUFFER = 90;
class Canvas {
  // myonoffswitch values are reversed! On = off, off = on
  constructor() {
    this.currentCards = {}; //keep track of cards on canvas
    this.currentStacks = {};
    this.draw = false;
    let canvasPad = document.createElement('div');
    $(canvasPad).attr({
      id: 'canvasPad',
      class: 'canvas-sketch'
    });
    document.body.appendChild(canvasPad);
    this.canvas = Raphael.sketchpad('canvasPad', {
      height: window.innerHeight - BTM_ROW_BUFFER,
      width: window.innerWidth,
      editing: false
    });
    this.canvasButtonListeners();
    $(".container").selectable({
      filter: ".card",
      classes: {
        "ui-selecting": "highlight",
        "ui-selected": "highlight"
      },
      delay: 150
    })
  }

  canvasButtonListeners() {
    $("#clearButton").click(() => this.canvas.clear())
    $(".container").click(() => $(".card").removeClass("highlight"))
    $("#myonoffswitch").click(() => {
      this.draw == true ? this.draw = false : this.draw = true
      this.sketchOrLasso()
    });
  }

  sketchOrLasso() {
    if (this.draw == true) {
      this.canvas.editing(true)
      $(".container").selectable("disable")
    } else {
      this.canvas.editing(false)
      $(".container").selectable("enable")
    }
  }

  newTextEditor(name) {
    let card = new TextEditor("textEditor", name);
    this.currentCards[card.id] = card;
    return card;
  }

  newSketchpad(name) {
    let card = new Sketchpad("sketch", name);
    this.currentCards[card.id] = card;
    return card;
  }

  newCodeEditor(fileData) {
    let card = new CodeEditor('codeEditor', fileData);
    this.currentCards[card.id] = card;
    return card;
  }

  Testing() {
    document.location.href = 'tests/test.html';
  }

  Version() {
    var appVersion = require('electron').remote.app.getVersion();
    var appName = require('electron').remote.app.getName();
    alert(appName + ' IDE\nVersion: ' + appVersion);
  }

  Playground() {
    document.location.href = 'playground/playground.html';
  }

  backPage() {
    document.location.href = '../index.html';
  }

  getLastCard() {
    let temp = Object.values(this.currentCards);
    return temp[temp.length - 1];
  }

  loadFolder(dir) {
    let files = this.getFiles(dir);
    files.forEach(ele => this.loadFile(ele));
  }

  launchDialog() {
    dialog.showOpenDialog({
      properties: ['openDirectory', 'openFile'],
    }, (fileNames) => {
      if (fileNames == undefined)
        return
      let clean = fileNames[0].split('.');
      if (clean.length == 1) // if there was a '.' then there is a file in it.
        this.loadFolder(fileNames[0]);
      else {
        let fName = fileNames[0].split('/');
        this.loadFile({
          path: fileNames,
          name: fName[fName.length - 1],
        });
      }
    });
  }

  getFiles(dir, fileList) {
    fileList = fileList || [];
    if (!fs.statSync(dir).isDirectory()) {
      let name = dir.split('/');
      return [{
        path: dir,
        name: name[name.length - 1],
      }, ];
    } // if the file has no suffix e.g "LISCENCE"

    var files = fs.readdirSync(dir);
    for (var i in files) {
      if (!files.hasOwnProperty(i)) continue;
      var path = dir + '/' + files[i];
      if (fs.statSync(path).isDirectory()) {
        getFiles(path, fileList);
      } else {
        let name = path.split('/');
        fileList.push({
          path: path,
          name: name[name.length - 1],
        });
      }
    }
    return fileList;
  }


  loadFile(file) {
    var getFileName = (getFileExt(file.name)).toLowerCase();
    if (getFileName == '.txt' || getFileName == '') {
      this.newTextEditor(file);
      let card = this.getLastCard();
      $('#card_' + card.id + 'codeEditor_0').load(file.path);
      return;
    } else if (getFileName == '.png' || getFileName == '.jpg' ||
      getFileName == '.gif' || getFileName == '.webp') {
      this.newSketchpad(file);
      let card = this.getLastCard();
      var url = 'url(file:///' + file.path + ')';
      url = url.replace(/\\/g, '/'); // clean URL for windows '\' separator
      $('#card_' + card.id + 'sketch_0').css({
        backgroundImage: url,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      });
      return;
    }
    let modelist = ace.require('ace/ext/modelist'); //check if in valid ext's
    let mode = modelist.getModeForPath(getFileName).mode;
    if (mode == 'ace/mode/text') // if it had to resolve to text then ext not found
      alert('The selected file cannot be loaded.');
    else { // if not it was found, load the file as txt
      this.newCodeEditor({
        ext: getFileName,
        name: file.name,
        path: file.path[0]
      });
      let card = this.getLastCard();
      $.get(file.path, resp => card.editors[0].setValue(resp));
    }
  }
}