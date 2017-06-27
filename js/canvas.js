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

function canvasSketch() {
  var canvasPad = document.createElement('div');
  $(canvasPad).attr({id: 'canvasPad', class: 'canvas-sketch'});
  document.body.appendChild(canvasPad);
  let canvasSketchpad = Raphael.sketchpad("canvasPad", {
    height: '100%',
    width: '100%',
    editing: true
  });
}

// spans new textarea for canvas annotation
function canvasAnnotation(){
  document.body.style.cursor = "text";
  var canvas = document.querySelector('.container');
  var elem = this;
  $(canvas).click(function(e){
    var newTextArea = document.createElement("textarea");
    newTextArea.style.position = "absolute";
    newTextArea.style.left = e.pageX + "px";
    newTextArea.style.top = e.pageY + "px";
    newTextArea.style.background = "transparent";
    newTextArea.style.borderColor = "black";
    newTextArea.style.borderWidth = "2px";
    if(canvas == document.activeElement){
      if(newTextArea == document.activeElement){
        newTextArea.style.borderWidth = "3px";
        canvas.appendChild(newTextArea);
      }
      else{
        newTextArea.style.borderWidth = "1px";
        canvas.appendChild(newTextArea);
      }
    }
  });
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

var editor = document.getElementsByTagName('editor');
$(window).mouseup(function(e){
    var text = '';
    text = getSelectedText();
    if(text != ''){
      console.log(text);
        showContextMenu(text);
        dynamicCardCreationText(text);
    }
});

function showContextMenu(text){
  var menu = [{
    name: 'Create new text editor card',
    title: 'text editor card button',
    fun: dynamicCardCreationText(text)
  },{
    name: 'Create new code editor card',
    title: 'code editor card button',
    fun: dynamicCardCreationCode(text)
  }]
    $('').contextMenu(menu, {
      triggerOn: 'dblclick',
      displayAround: cursor,
      mouseClick: left,
      delay: 500,
      closeOnClick: true,
      autoHide: true,
  });
}

function getLastCard() {
   let temp = Object.values(currentCards);
   return temp[temp.length - 1];
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

function dynamicCardCreationText(text){
    console.log("in dynamicCardCreationText");
    document.onmouseup = getSelectedText;
    if(!document.all)
    document.captureEvents(Event.MOUSEUP);
    newTextEditor('editor');
    let card = getLastCard();
      $("#card_" + card.id + 'codeEditor_0').val($('.editor').val()+text);
}

function dynamicCardCreationCode(code){
  console.log("in dynamicCardCreationEditor");
  newCodeEditor('editor');
    let card = getLastCard();
    $.get(code, (r) => card.editors[0].setValue(r));
}

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
