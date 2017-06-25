let cardCounter = 0;
let stackCounter = 0;
let currentCards = {};

function newTextEditor() {
  let card = new TextEditor("editor");
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

function playground() {
  document.location.href = "playground/playground.html"
}

function getLastCard() {
  let temp = Object.values(currentCards);
  return temp[temp.length - 1];
}

function loadFile() {
  let file = $('#openFile')[0].files[0];
  var getFileName = (getFileExt(file.name)).toLowerCase();
  if (getFileName == '.txt' || getFileName == "") {
    newTextEditor('editor');
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

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
