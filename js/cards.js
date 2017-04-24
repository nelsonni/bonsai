function Card(id) {
    this.id = id;
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("id", this.id);

    /*
     TODO:
     - Card Expansion
     */


    var header = document.createElement('div');
    header.setAttribute("class", "card card-header");
    header.innerHTML = "id:" + this.id;
    header.onmousedown = function() {
        var highestZIndex = getHighestZIndexCard();
        header.style.zIndex = highestZIndex + 1;
        div.style.zIndex = highestZIndex + 1;
    }

    var close_button = document.createElement('button');
    close_button.setAttribute("id", "closeBtn" + id);
    close_button.setAttribute("class", "close");
    close_button.setAttribute("value", "x");
    close_button.innerHTML = "x";
    close_button.onclick = function () {
        var parentCard = $("#" + id);
        //When it is just the single card pulled out of stack
        if (parentCard[0].children.length == 2 && parentCard[0].parentNode.classList.contains("container"))
            $("#" + id).remove();
        else {
            alert("Can't delete card while in stack.");
            parentCard[0].style.zIndex = parentCard[0].nextElementSibling.style.zIndex;
        }
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
    $("#" + id).draggable({
        handle: ".card-header"
    });
    setCardDroppableEffects(id);
    setMouseOverEffects(id);
}

function cardExpansion(id) {
    var test = $("#" + id);
    var base = getBottomStack(test, test);
    base = $("#" + base.id);

    $(base[0].children).each(function (idx) {
        if (this.classList.contains("Test")) {
            console.log(base[0].style.left);
            $(this).css({
                top: base[0].style.top,
                left: parseInt(base[0].style.left) + (225 * (idx - 1))
            });
        }
    });
}

// need to position button better
function setMouseOverEffects(id) {
    $("#" + id).on('mouseenter', function () {
        var div = document.createElement("div");
        var expandBtn = document.createElement("button");
        expandBtn.setAttribute("id", "expandBtn" + id);
        expandBtn.setAttribute("class", "expandableBtn");
        expandBtn.setAttribute("position", "fixed");
        var parentCard = document.getElementById(id);
        if (document.getElementsByClassName("expandableBtn").length === 0) {
            if (parentCard.children.length !== 2)
                parentCard.lastElementChild.append(expandBtn);
            else
                parentCard.append(expandBtn);
        }
        expandBtn.onclick = function () {
            cardExpansion(id);
        };
        console.log("You entered me!");
    }).on("mouseleave", function () {
        $("#expandBtn" + id).fadeOut(3000);
        setTimeout(function () {
            $("#expandBtn" + id).remove();
        }, 3000);

    });
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
                left: parseInt(parent[0].childNodes[getCurPos].style.left) - 10
            });
        }
    }
}

function getBottomStack(element, ui) {
    while (!(element[0].parentNode.classList.contains("container")))
        element[0] = element[0].parentNode;
    return element[0];
}


function moveStackEffects(latestAdd, base) {
    var last = base.lastChild;
    var zVal = getHighestZIndexCard();
    console.log(last);
    $("#" + base.id).draggable("destroy");
    $("#" + base.id).draggable({
        cancel: "text",
        drag: function (event, ui) {
            var thing = this;
            var test = $(thing).parents("div").first(); // get bottom of stack drug
            console.log(test.context.id); //Moves each child card with the parent card
            $("#" + test.context.id + " div.Test").each(function (index) {
                var top = parseFloat(thing.style.top) + ((index + 1 ) * 40);
                var left = parseFloat(thing.style.left) + ((index + 1) * 15);
                this.style.top = top.toString() + "px";
                this.style.left = left.toString() + "px";
            });
        }
    });

    // Prevents weird affect where last card pushed onto stack does not make stack
    // draggable just the card.
    $(last).draggable("option", "handle", ".card-header");
    latestAdd.style.zIndex = ++zVal;
}


function setCardDroppableEffects(id) {
    $("#" + id).droppable({
        drop: function(event, ui) {
            $(ui.draggable).removeClass("Base");
            $(ui.draggable).addClass("Test");
            var parent = $(ui.draggable).parents("div"); // get parent of dropped card
            var bottomStack = getBottomStack($(this));
            var lastCardIdx = bottomStack.children.length - 2;

            if (!($(this)[0].lastElementChild.classList.contains("editor-drag")))
                $(this)[0].lastElementChild.className += " editor-drag";
            else
                $(ui.draggable)[0].lastElementChild.className += " editor-drag";

            bottomStack.append($(ui.draggable)[0]); // append to bottom of stack
            moveStackEffects($(ui.draggable)[0], bottomStack); // give cards the moving stackable effects

            if (lastCardIdx > 1) {
                $(ui.draggable).css({
                    top: parseInt(bottomStack.children[lastCardIdx].style.top) + 40,
                    left: parseInt(bottomStack.children[lastCardIdx].style.left) + 15
                });
                // append child cards of stack to dragged stack of cards
                $($(ui.draggable)[0].children).each(function () {
                    if (this.classList.contains("Test")) {
                        bottomStack.append(this);
                        this.style.zIndex = getHighestZIndexCard();
                    }
                });
            } else { // if there is only one card
                $(ui.draggable).css({ //repositions child div
                    top: parseInt($(this)[0].style.top) + 40,
                    left: parseInt($(this)[0].style.left) + 15
                });
            }


        },
        out: function(event, ui) {
            var base = null;
            var found = false;
            $("#" + $(ui.draggable)[0].id).mousedown(function(event) {
                if (event.target.parentNode.classList.contains("Base")) {
                    $(ui.draggable).children(".card").each(function () {
                        if (found === false) {
                            if (this.classList.contains("Test")) {
                                document.body.appendChild(this);
                                this.className += " Base";
                                found = true;
                                base = this;
                            }
                        } else {
                            if (this.classList.contains("Test") && base !== this)
                                base.append(this);
                        }
                    });
                }
            });
            var parent = $(ui.draggable).parents("div");
            $($(ui.draggable)[0]).addClass("Base");
            moveStackEffects($(ui.draggable)[0], getBottomStack($(this)));
            bottomStack = getBottomStack($(this));
            // if there is only 2 cards removes stackable drag effects
            if ($(this)[0].children.length === 2) {
                $($(this)[0]).draggable("destroy");
                $($(this)[0]).draggable({
                    handle: ".card-header"
                });
            }
            $($(ui.draggable)[0]).draggable("option", "handle", ".card-header");
            console.log(getBottomStack($(this)));
            console.log($(ui.draggable));
            var atBtm = isBottom($(ui.draggable), bottomStack);
            if (atBtm === false)
                arrangeLowerCards(parent, ui);
            document.body.appendChild($(ui.draggable)[0]);

        }
    });
}

function isBottom(curCard, fromStack) {
    var test = $("#" + fromStack.id);
    if (test[0].lastChild.id === curCard[0].id)
        return true;
    else
        return false;
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
    return highestSoFar + 1;
}

//To make sure that when a card is created it stacks on top of the other cards
function setDivPosition(div) {
    let cards = document.getElementsByClassName("card");
    let zVal = getHighestZIndexCard();
    var eleAtStart = {};
    let multiplier = 0;
    div.style.position = "fixed";
    div.style.zIndex = ++zVal; // the newest window will be on top of the stack
    div.style.top = "35px";
    div.style.left = "10px";
    div.className += " Test";
    if (cards.length == 0) { // if there are no cards on page
        //div.className += " Base";
        document.body.appendChild(div);
        $("#" + div.id).mousedown(function(event) {
            if (event.target.parentNode.classList.contains("Base")) {
                $(div).children('.card').each(function() {
                    if (!this.classList.contains("card-header"))
                        document.body.appendChild(this); // used to bring cards to front
                });
            }
        });
        return;
    }
    // Jesus christ this is ugly, refactor this at some point
    for (var i = 0; i < cards.length; i += 2) { // +=2 to only get the cards not the headers
        if (cards[i].style.left == "10px" && cards[i].style.top == "35px") {
            eleAtStart = cards[i]; // get whoever is at the start at spawn point
            $("#" + eleAtStart.id).append(div);
            multiplier = eleAtStart.getElementsByTagName("div").length; //for offset
            $("#" + div.id).css({
                top: 35 + (20 * (multiplier - 1)),
                left: 10 + (5 * (multiplier - 1))
            });
            return; // prevent from being attached to doc.body
        }
    }
    div.className += " Base";
    document.body.appendChild(div);
}
