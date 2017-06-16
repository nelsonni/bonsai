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
  if (getFileName == '.txt') {
    newTextEditor('editor');
    let card = getLastCard();
    $("#card_" + card.id + 'codeEditor_0').load(file.path);
    return;
  }
  if (getFileName == '.png' || getFileName == '.jpg') {
    newSketchpad('sketch');
    let card = getLastCard();
    var url = 'url(file:///' + file.path + ")";
    // url.replace(/\\/g,"/"); //need to replace forward slash with backslash so files load on Windows
    console.log(url);
    $("#card_" + card.id + 'sketch_0').css("backgroundImage", url);
  } else {
    newCodeEditor(getFileName);
    let card = getLastCard();
    $.get(file.path, (r) => card.editors[0].setValue(r));
  }
}

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
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
