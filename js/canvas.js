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

function loadFolder() {
  let dir = $("#folderInput")[0].files[0].path
  let files = getFiles(dir);
  files.forEach(ele => loadFile(ele));
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

function stageFile() {
  let file = $('#fileInput')[0].files[0];
  loadFile(file);
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
