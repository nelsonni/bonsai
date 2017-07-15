let currentCards = {}; //keep track of cards on canvas
let currentStacks = {};

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
function newCodeEditor(fileData) {
  let card = new CodeEditor('codeEditor', fileData);
  currentCards[card.id] = card;
}

function Testing() {
  document.location.href = 'tests/test.html';
}

function Version() {
  var appVersion = require('electron').remote.app.getVersion();
  var appName = require('electron').remote.app.getName();
  alert(appName + ' IDE\nVersion: ' + appVersion);
}

function Playground() {
  document.location.href = 'playground/playground.html';
}

function backPage() {
  document.location.href = '../index.html';
}

function getLastCard() {
  let temp = Object.values(currentCards);
  return temp[temp.length - 1];
}

function loadFolder(dir) {
  let files = getFiles(dir);
  files.forEach(ele => loadFile(ele));
}

// todo check by fs.isdirectory
function launchDialog() {
  dialog.showOpenDialog({
    properties: ['openDirectory', 'openFile'],
  }, (fileNames) => {
    if (fileNames == undefined)
      return
    let clean = fileNames[0].split('.');
    if (clean.length == 1) // if there was a '.' then there is a file in it.
      loadFolder(fileNames[0]);
    else {
      let fName = fileNames[0].split('/');
      loadFile({
        path: fileNames,
        name: fName[fName.length - 1],
      });
    }
  });
}

function getFiles(dir, fileList) {
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
      newSketchpad("sketch");
      let card = getLastCard();
      paper.clear();
    });
function loadFile(file) {
  var getFileName = (getFileExt(file.name)).toLowerCase();
  if (getFileName == '.txt' || getFileName == '') {
    newTextEditor(file);
    let card = getLastCard();
    $('#card_' + card.id + 'codeEditor_0').load(file.path);
    return;
  } else if (getFileName == '.png' || getFileName == '.jpg' ||
    getFileName == '.gif' || getFileName == '.webp') {
    newSketchpad(file);
    let card = getLastCard();
    var url = 'url(file:///' + file.path + ')';
    url = url.replace(/\\/g, '/'); // clean URL for windows '\' separator
    $('#card_' + card.id + 'sketch_0').css({
      backgroundImage: url,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    });
    return;
  }

  clearCanvas(){
    var button = document.getElementById("clearButton");
    button.addEventListener('click', () => {
      this.canvas.clear();
    });

  let modelist = ace.require('ace/ext/modelist'); //check if in valid ext's
  let mode = modelist.getModeForPath(getFileName).mode;
  if (mode == 'ace/mode/text') // if it had to resolve to text then ext not found
    alert('The selected file cannot be loaded.');
  else { // if not it was found, load the file as txt
    newCodeEditor({
      ext: getFileName,
      name: file.name,
      path: file.path[0]
    });
    let card = getLastCard();
    $.get(file.path, resp => card.editors[0].setValue(resp));
  }
}