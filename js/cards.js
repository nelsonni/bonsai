function Card(id) {
    this.id = id;
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("id", this.id);


    /*
     TODO:
     - Prevent closing top card to delete all cards
     - Dragging anywhere but the header drags the entire stack
     */


    var header = document.createElement('div');
    header.setAttribute("class", "card card-header");
    header.innerHTML = "id:" + this.id;
    header.onmousedown = function() {
        var highestZIndex = getHighestZIndexCard();
        header.style.zIndex = highestZIndex + 5;
        div.style.zIndex = highestZIndex + 5;
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
    setDivPosition(div);

    $(".editor").draggable();
    $(".card").draggable({
        handle: ".card-header"
    });

    var children = 0;
    setCardDroppableEffects(id);
}

function arrangeLowerCards(parent, ui) {
    var getCurPos = 0;
    if (parent[0] != undefined) {
        for (var i = 2; i < parent[0].childNodes.length; i++) //start at 2 to get past header and text box
            if (parent[0].childNodes[i].id == $(ui.draggable)[0].id)
                getCurPos = i;
        for (getCurPos++; getCurPos < parent[0].childNodes.length; getCurPos++) {
            $("#" + parent[0].childNodes[getCurPos].id).css({ // move divs to prevent gaps in stack
                top: parseInt(parent[0].childNodes[getCurPos].style.top) - 40,
                left: parseInt(parent[0].childNodes[getCurPos].style.left) - 7
            });
        }
    }
}

function getBottomStack(element, ui) {
    if (element[0] != undefined) {
        if (element[0].classList.contains("Base")) {
            return element[0];
        }
    } else {
        if (element.classList.contains("Base"))
            return element;
    }
    return getBottomStack(element[0].parentNode);
}


function moveStackEffects(latestAdd, base) {
    var last = base.lastChild;
    var zVal = getHighestZIndexCard();
    console.log(last);
    // Prevents weird affect where last card pushed onto stack does not make stack
    // draggable just the card.
    $(last).draggable("option", "handle", ".card-header");
    latestAdd.style.zIndex = ++zVal;
}

function setCardDroppableEffects(id) {
    $("#" + id).droppable({
        tolerance: "pointer",
        drop: function(event, ui) {
            $(ui.draggable).removeClass("Base");
            $(ui.draggable).addClass("Test");
            var parent = $(ui.draggable).parents("div"); // get parent of dropped card
            arrangeLowerCards(parent, ui);
            var bottomStack = getBottomStack($(this));
            console.log(bottomStack);
            var lastCardIdx = bottomStack.children.length - 2;

            if (!($(this)[0].lastElementChild.classList.contains("editor-drag")))
                $(this)[0].lastElementChild.className += " editor-drag";
            else
                $(ui.draggable)[0].lastElementChild.className += " editor-drag";


            bottomStack.append($(ui.draggable)[0]); // append to bottom of stack
            // append child cards of stack to dragged stack of cards
            $($(ui.draggable)[0].children).each(function () {
                if (this.classList.contains("Test"))
                    bottomStack.append(this);
            });

            $(".Base").draggable("destroy");
            $(".Base").draggable({
                cancel: "text",
                drag: function (event, ui) {
                    var thing = this;
                    var test = $(thing).parents("div").first(); // get bottom of stack drug
                    console.log(test.context.id);
                    $("#" + test.context.id + " div.Test").each(function (index) {
                        var top = parseFloat(thing.style.top) + ((index + 1 ) * 40);
                        var left = parseFloat(thing.style.left) + ((index + 1) * 15);
                        this.style.top = top.toString() + "px";
                        this.style.left = left.toString() + "px";
                    });
                }
            });
            moveStackEffects($(ui.draggable)[0], bottomStack);

            if (lastCardIdx > 0)
                $(ui.draggable).css({ // if there is only one card
                    top: parseInt(getBottomStack($(this)).children[lastCardIdx].style.top) + 40,
                    left: parseInt(getBottomStack($(this)).children[lastCardIdx].style.left) + 15
                });
            else {
                $(ui.draggable).css({ //repositions child div
                    top: parseInt($(this)[0].style.top) + 40,
                    left: parseInt($(this)[0].style.left) + 15
                });
            }

        },
        out: function(event, ui) {
            $("#" + $(ui.draggable)[0].id).mousedown(function(event) {
                if (event.target.parentNode.classList.contains("Base")) {
                    $(ui.draggable).children('.card').each(function() {
                        var i = 0;
                        if (!this.classList.contains("card-header"))
                            document.body.appendChild(this);
                        if (i == 0)
                            this.className += " Base";
                        i++;
                    })
                }
            });
            var parent = $(ui.draggable).parents("div");
            arrangeLowerCards(parent, ui);
            $(ui.draggable).addClass("Base");
            document.body.appendChild($(ui.draggable)[0]);
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
function setDivPosition(div) {
    let cards = document.getElementsByClassName("card");
    let zVal = getHighestZIndexCard();
    var eleAtStart = {};
    let multiplier = 0;
    div.style.position = "fixed";
    div.style.zIndex = ++zVal; // the newest window will be on top of the stack
    if (cards.length == 0) { // if there are no cards on page
        //div.className += " Base";
        document.body.appendChild(div);
        $("#" + div.id).mousedown(function(event) {
            if (event.target.parentNode.classList.contains("Base")) {
                $(div).children('.card').each(function() {
                    if (!this.classList.contains("card-header"))
                        document.body.appendChild(this)
                })
            }
        });
        return;
    }
    for (var i = 0; i < cards.length; i += 2) { // +=2 to only get the cards not the headers
        if (cards[i].style.left == "" && cards[i].style.top == "") {
            eleAtStart = cards[i]; // get whoever is at the start at spawn point
            $("#" + eleAtStart.id).append(div);
            multiplier = eleAtStart.getElementsByTagName("div").length; //for offset
            $("#" + div.id).css({
                top: 20 * (multiplier),
                left: 5 * (multiplier)
            });
            return; // prevent from being attached to doc.body
        }
    }
    document.body.appendChild(div);
}
