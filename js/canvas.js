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

function newCodeEditor() {
  let card = new CodeEditor("editor");
  currentCards[card.id] = card;
}

function Testing() {
  document.location.href = "tests/test.html"
}

function playground() {
  document.location.href = "playground/playground.html"
}


function loadFile() {
    var getFileName = getFileExt($('#openFile')[0].files[0].name);
    if(getFileName == '.txt'){
      newTextEditor('editor');
      let temp = Object.values(currentCards);
      let card = temp[temp.length - 1];
      $("#card_" + card.id + 'codeEditor_0').load($('#openFile')[0].files[0].path);
    }
    if(getFileName == '.png' || getFileName == '.jpg'){
      newSketchpad('sketch');
      let temp = Object.values(currentCards);
      let card = temp[temp.length - 1];
      var url = 'url(file:///' + $('#openFile')[0].files[0].path +")";
      // url.replace(/\\/g,"/"); //need to replace forward slash with backslash so files load on Windows
      console.log(url);
      $("#card_" + card.id + 'sketch_0').css({
        backgroundImage: url
      });
    }
    else{
      console.log(getFileName);
      newCodeEditor('codeEditor', getFileName);

    }
    // else{
    //   alert("The selected file cannot be loaded.")
    // }
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
