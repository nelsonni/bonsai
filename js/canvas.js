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
