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
        header.style.zIndex = ++highestZIndex;
        div.style.zIndex = ++highestZIndex;
    }

    var close_button = document.createElement('button');
    close_button.setAttribute("class", "close");
    close_button.setAttribute("value", "x");
    close_button.innerHTML = "x";
    close_button.onclick = function() {
        $("#" + id).remove(); // remove element with specified 'id' tag
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



    $(".card").draggable({
        handle: ".card-header"
    });
    var children = 0;
    $(".container").droppable({
        drop: function(event, ui) {
            $(this).append($(ui.draggable));
            $(ui.draggable).css({
                top: event.pageY,
                left: event.pageX
            });
        }
    });

    $(".card").droppable({
        drop: function(event, ui) {
            children = $(this).children().size();
            if (children - 1 != 0)
                children--;
            $(this).append($(ui.draggable)); //appends it to inside the div
            $(ui.draggable).css({ //repositions child div
                top: 40 * (children), // - 1 for textBox inside div
                left: 15 * (children)
            });
        },
        out: function(event, ui) {
            $(".container").append($(ui.draggable)).css({
                top: event.pageY,
                left: event.pageX
            });
        }
    });
}

// Gets the highest z Index so that the clicked card will appear at the front.
function getHighestZIndexCard() {
    var cards = document.getElementsByClassName("card");
    var highestSoFar = 0;
    for (var i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > highestSoFar) {
            highestSoFar = parseInt(cards[i].style.zIndex);
        }
    }
    return highestSoFar;
}

//To make sure that when a card is created it stacks on top of the other cards
function setPosition(div) {
    let cards = document.getElementsByClassName("card");
    let zVal = getHighestZIndexCard();
    var eleAtStart = {};
    let multiplier = 0;
    div.style.position = "absolute";
    div.style.zIndex = ++zVal; // the newest window will be on top of the stack
    if (cards.length == 0) { // if there are no cards on page
        document.body.appendChild(div);
        return;
    }
    for (var i = 0; i < cards.length; i += 2) { // +=2 to only get the cards not the headers
        if (cards[i].style.left == "" && cards[i].style.top == "") {
            eleAtStart = cards[i]; // get whoever is at the start at spawn point
            $("#" + eleAtStart.id).append(div);
            multiplier = eleAtStart.getElementsByTagName("div").length; //for offset 
            $("#" + div.id).css({
                top: 20 * (multiplier - 1),
                left: 5 * (multiplier - 1)
            });
            return;
        }
    }
    document.body.appendChild(div);
}
