let currentCards = {};

function newTextEditor() {
  let card = new TextEditor("textEditor");
  currentCards[card.id] = card;
}

function newSketchpad() {
  let card = new Sketchpad("sketch");
  currentCards[card.id] = card;
}

function newCodeEditor() {
  let card = new CodeEditor("codeEditor");
  currentCards[card.id] = card;
}

function Testing() {
  document.location.href = "tests/test.html"
}

function playground() {
  document.location.href = "playground/playground.html"
}

function backPage(){
  document.location.href = "../index.html";
}

function loadFile() {
  let test = newCodeEditor();
  $("#" + test.card.id + "codeEditor_0").load("./main.js");
}
