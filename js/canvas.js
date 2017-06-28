let currentCards = {};

function newTextEditor() {
  let card = new TextEditor('textEditor');
  currentCards[card.id] = card;
}

function newSketchpad() {
  let card = new Sketchpad('sketch');
  currentCards[card.id] = card;
}

function newCodeEditor(fileExt) {
  let card = new CodeEditor('codeEditor', fileExt);
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

function loadFile() {
  let file = $('#fileInput')[0].files[0];
  var getFileName = (getFileExt(file.name)).toLowerCase();
  if (getFileName == '.txt' || getFileName == '') {
    newTextEditor('textEditor');
    let card = getLastCard();
    $('#card_' + card.id + 'codeEditor_0').load(file.path);
    return;
  } else if (getFileName == '.png' || getFileName == '.jpg' ||
    getFileName == '.gif' || getFileName == '.webp') {
    newSketchpad('sketch');
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

  let modelist = ace.require('ace/ext/modelist'); //check if in valid ext's
  let mode = modelist.getModeForPath(getFileName).mode;
  if (mode == 'ace/mode/text') // if it had to resolve to text then ext not found
    alert('The selected file cannot be loaded.');
  else { // if not it was found, load the file
    newCodeEditor(getFileName);
    let card = getLastCard();
    $.get(file.path, resp => card.editors[0].setValue(resp));
  }
}
