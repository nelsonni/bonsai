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
    let test = newCodeEditor();
    $("#" + test.card.id +"codeEditor_0").load("./main.js");
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// spans new textarea for canvas annotation
function canvasAnnotation(){
  var canvas = document.querySelector('.container');
  var newDiv = document.createElement("div");
  var newTextArea = document.createElement("textarea");
  newDiv.setAttribute("id", "newDiv");
  newTextArea.style.width = "150px";
  newTextArea.style.height = "25px";
  newDiv.draggable = "true";
  newDiv.setAttribute("ondragstart", "drag(event)");
  window.ondrop = "drop(event)";
  window.ondragover = "allowDrop(event)";
  canvas.appendChild(newDiv);
  newDiv.appendChild(newTextArea);
}

//enables dragging and dropping of canvas annotations
function allowDrop(ev){
  ev.preventDefault();
}

function drag(ev){
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){
  ev.preventDefault();
  var data = ev.dataTransfer.getData("data");
  ev.target.appendChild(document.getElementById(data));
}

//shows/hides canvas sketches and annotations buttons (not functional yet)
// function showonoffButtons(){
//   var show = document.getElementById("onoffButtons");
//   show.className = (show.className === "hidden") ? "": "hidden";
// }
// document.getElementById("onoffswitch").addEventListener("click", showonoffButtons(), false);

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

// function getLastCard() {
//    let temp = Object.values(currentCards);
//    return temp[temp.length - 1];
//  }
//
// function getSelectionText() {
//    var text = "";
//    var activeEl = document.activeElement;
//    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
//    if (activeElTagName == "textarea"){
//      text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
//    }
//      return text;
//  }

// function dynamicCardCreationText(text){
//   // document.getElementById("myDropdown2").classList.toggle("show");
//   $('.editor').onclick(function() {
//       var text = getSelectedText();
//       console.log(text);
//   });
//   newTextEditor('editor');
//   //  var text;
//   let card = getLastCard();
//   $("#card_" + card.id + 'codeEditor_0').val($('.editor').val()+text);
// }

// function dynamicCardCreationText(){
//   var code;
//   newCodeEditor(getFileName);
//     let card = getLastCard();
//     $.get(code, (r) => card.editors[0].setValue(r));
// }

// function dynamicCardCreationSketch(){
//   var screenCapturedImage =
//   newSketchpad('sketch');
//   let card = getLastCard();
//   var url = 'url(file:///' + file.path + ")";
//  -    // url.replace(/\\/g,"/"); //need to replace forward slash with backslash so files load on Windows
//  +    url = url.replace(/\\/g,"/");
//       console.log(url);
//       $("#card_" + card.id + 'sketch_0').css("backgroundImage", url);
// }

// window.onclick = function(event){
//   if (event.target.matches('.editor')){
//     if (event.target.matches('.editor')){
//       // getSelectionText();
//       console.log("hi");
//     }
//   }
// }
