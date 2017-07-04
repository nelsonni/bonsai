let currentCards = {}; //keep track of cards on canvas

function newTextEditor() {
  let card = new TextEditor("textEditor");
  currentCards[card.id] = card;
}

function newSketchpad() {
  let card = new Sketchpad("sketch");
  currentCards[card.id] = card;
}

function newCodeEditor(fileExt) {
  let card = new CodeEditor("codeEditor", fileExt);
  currentCards[card.id] = card;
}

function Testing() {
  document.location.href = "tests/test.html"
}

function Version() {
  var appVersion = require('electron').remote.app.getVersion();
  var appName = require('electron').remote.app.getName();
  alert(appName + " IDE\nVersion: " + appVersion);
}

function Playground() {
  document.location.href = "playground/playground.html"
}

function backPage() {
  document.location.href = "../index.html";
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
    properties: ["openDirectory", "openFile"]
  }, (fileNames) => {
    let clean = fileNames[0].split(".")
    if (clean.length == 1) // if there was a '.' then there is a file in it.
      loadFolder(fileNames[0])
    else {
      let fName = fileNames[0].split("/")
      loadFile({
        path: fileNames,
        name: fName[fName.length - 1]
      })
    }
  });
}

function getFiles(dir, fileList) {
  fileList = fileList || [];

  var files = fs.readdirSync(dir);
  for (var i in files) {
    if (!files.hasOwnProperty(i)) continue;
    var path = dir + '/' + files[i];
    if (fs.statSync(path).isDirectory()) {
      getFiles(path, fileList);
    } else {
      let name = path.split("/")
      fileList.push({
        path: path,
        name: name[name.length - 1]
      });
    }
  }
  return fileList;
}

function loadFile(file) {
  var getFileName = (getFileExt(file.name)).toLowerCase();
  if (getFileName == '.txt' || getFileName == "") {
    newTextEditor('textEditor');
    let card = getLastCard();
    $("#card_" + card.id + 'codeEditor_0').load(file.path);
    return;
  } else if (getFileName == '.png' || getFileName == '.jpg' ||
    getFileName == '.gif' || getFileName == '.webp') {
    newSketchpad('sketch');
    let card = getLastCard();
    var url = 'url(file:///' + file.path + ")";
    url = url.replace(/\\/g, "/"); // clean URL for windows '\' separator
    $("#card_" + card.id + 'sketch_0').css("backgroundImage", url);
    return;
  }
  let modelist = ace.require("ace/ext/modelist"); //check if in valid ext's
  let mode = modelist.getModeForPath(getFileName).mode;
  if (mode == "ace/mode/text") // if it had to resolve to text then ext not found
    alert("The selected file cannot be loaded.")
  else { // if not it was found, load the file
    newCodeEditor(getFileName);
    let card = getLastCard();
    $.get(file.path, resp => card.editors[0].setValue(resp));
  }
}

$(window).mouseup(function(e){
    var text = '';
    text = getSelectedText();
    // code = getSelectedCode();
    if(text != ''){
      console.log(text);
      showContextMenu(text);
      document.getElementById('dynamic').onclick = function(){
        dynamicCardCreationText(text);
      }
    }
  // if (code != ''){
  //   showContextMenu(code);
  //   document.getElementById('dynamic').onclick = function(){
  //   dynamicCardCreationCode(code);
  //   }
  // }
});

function showContextMenu(text){
  $(window).contextmenu(function(e){
    var button = document.querySelector('.dropdown.hidden');
    x = e.clientX;
    y = e.clientY;
    if (document.getElementById('hidden')){
      button.removeAttribute('id');
    }
    button.style.top = x + 'px';
    button.style.left = y + 'px';
    window.addEventListener("click", function(){
      button.setAttribute('id', 'hidden');
    });
  });
}

function getSelectedText() {
  var text = "";
  if(window.getSelection){
   return window.getSelection().toString();
  }
  else if(document.selection){
   return document.selection.createRange().text;
  }
  return '';
}

// function getSelectedCode() {
//   let card = getLastCard();
//   editor.getSelectedText();
//   return '';
//
// }

function dynamicCardCreationText(text){
    console.log("in dynamicCardCreationText");
    newTextEditor('editor');
    let card = getLastCard();
      $("#card_" + card.id + 'codeEditor_0').val($('.editor').val() + text);
}

function dynamicCardCreationCode(code){
  console.log("in dynamicCardCreationEditor");
  console.log("code:", code);
  var code2 = String(code);
  newCodeEditor('editor');
    let card = getLastCard();
    // $.get(code, (r) => card.editors[0].setValue(r));
    card.editors[0].setValue(code2);
}

var canvasPad = document.createElement('div');
$(canvasPad).attr({id: 'canvasPad', class: 'canvas-sketch'});
  document.body.appendChild(canvasPad);
let canvasSketchpad = Raphael.sketchpad("canvasPad", {
  height: '100%',
  width: '100%',
  editing: false
});

function canvasSnapshot(){
  newSketchpad("sketch");
  let card = getLastCard();
  // $("#card_" + card.id + 'sketch_0');
    card.sketches.push(canvasSketchpad);
}

function toggleDynamicButtons(){
  var x = document.getElementById('onoffButtons');
  var editing;
  if(x.style.display === 'block'){
    x.style.display = 'none';
    canvasSketchpad = Raphael.sketchpad("canvasPad", {
      height: '100%',
      width: '100%',
      editing: false
    });
    return canvasSketchpad;
  }
  else{
    x.style.display = 'block';
    canvasSketchpad = Raphael.sketchpad("canvasPad", {
      height: '100%',
      width: '100%',
      editing: true
    });
    return canvasSketchpad;
  }
};

function clearCanvas(){
  document.body.removeChild(canvasPad);
  canvasPad = document.createElement('div');
  $(canvasPad).attr({id: 'canvasPad', class: 'canvas-sketch'});
  document.body.appendChild(canvasPad);
  let canvasSketchpad = Raphael.sketchpad("canvasPad", {
    height: '100%',
    width: '100%',
    editing: true
  });
}
