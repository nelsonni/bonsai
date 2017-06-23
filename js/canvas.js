let currentCards = {};

function newTextEditor() {
  let card = new TextEditor("editor");
  currentCards[card.id] = card;
}

function newSketchpad() {
  let card = new Sketchpad("sketch");
  currentCards[card.id] = card;
}

function newCodeEditor() {
  let card = new CodeEditor("editor");
  currentCards[card.id] = card;
}

function Testing() {
  document.location.href = "tests/test.html"
}
function Playground() {
  document.location.href = "playground/playground.html"
}

function loadFile() {
  let test = newCodeEditor();
  $("#" + test.card.id +"codeEditor_0").load("./main.js");
}
