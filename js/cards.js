function Card(id) {
    this.id = id;
    var div = document.createElement('div');
    div.setAttribute("class", "card");
    div.setAttribute("id", this.id);

    /*
    TODO:
          - Stack & snap windows in an area
    */
    var header = document.createElement('div');
    header.setAttribute("class", "card card-header");
    header.innerHTML = "id:" + this.id;
    header.onmousedown = function() {
        var highestZIndex = getHighestZIndexCard();
        console.log(highestZIndex);
        header.style.zIndex = ++highestZIndex;
        div.style.zIndex = ++highestZIndex;
    }

    var close_button = document.createElement('button');
    close_button.setAttribute("class", "close");
    close_button.setAttribute("value", "x");
    close_button.innerHTML = "x";
    close_button.onclick = function() {
        $("#" + id).remove(); // remove first element with 'id' tag
    };

    var editor = document.createElement('textarea');
    editor.setAttribute("class", "editor");
    editor.name = "code_editor";
    editor.maxLength = "5000";
    editor.cols = "25";
    editor.rows = "30";

    header.appendChild(close_button);
    div.appendChild(header);
    div.appendChild(editor);
    setPosition(div);
    document.body.appendChild(div);
    $(".card").draggable({
        handle: ".card-header"
    });
}

// Gets the highest z Index so that the clicked card will appear at the front.
function getHighestZIndexCard() {
    var cards = document.getElementsByClassName("card");
    console.log(cards);
    var highestSoFar = 0;
    for (var i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > highestSoFar) {
            highestSoFar = parseInt(cards[i].style.zIndex);
        }
    }
    console.log("This is the highest z index", highestSoFar);
    return highestSoFar;
}

//To make sure that when a card is created it stacks on top of the other cards
function setPosition(div) {
    var cards = document.getElementsByClassName("card");
    div.style.position = "absolute";
    if (cards.length != 0) {
        var zVal = getHighestZIndexCard();
        div.style.zIndex = ++zVal;
        div.style.left = (cards[cards.length - 2].offsetLeft + 6) + "px";
        div.style.top = (cards[cards.length - 2].offsetTop + 35) + "px";
    }
}
