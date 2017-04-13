function Card(id) {
    this.id = id;
    var div = document.createElement('div');
    var header = document.createElement('div');
    var button = document.createElement('button');
    var textArea = document.createElement('textarea');
    button = setButton(button, id);
    header = setHeader(header, id, button);
    div = setDiv(div, id, header, textArea);
    document.body.appendChild(div);
    $(".textArea").draggable({
        handle: ".header"
    });
}

/*
TODO:
      - Stack & snap windows in an area
*/

// Ugly I know :(
function setDiv(div, id, header, textArea) {
    div.setAttribute("class", "textArea");
    div.appendChild(header);
    div.setAttribute("id", id);
    textArea.setAttribute("id", "codeArea");
    div.appendChild(textArea);
    return div;
}

function setHeader(header, id, button) {
    header.setAttribute("class", "header");
    header.innerHTML = "id:" + id;
    header.appendChild(button);
    return header;
}

function setButton(button, id) {
    button.onclick = function() {
        $("#" + id).remove(); //remove window with current ID
    };
    button.setAttribute('class', 'cancelButton');
    button.setAttribute('value', 'x');
    button.innerHTML = "x";
    return button;
}
