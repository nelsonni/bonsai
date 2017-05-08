/*
 - Change mouse cursor to draggable when on top of stack remove text
 - Be able to delete cards
 - base cards not being on top when clicked
 - pulled out cards need to be editable

 -------------------------------------------------------------------------------------
 - We need some serious refactoring
 */

function Card(id) {
    this.id = id;
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("id", this.id);

    var header = document.createElement('div');
    header.setAttribute("class", "card card-header");
    header.innerHTML = "id:" + this.id;

    var close_button = document.createElement('button');
    close_button.setAttribute("id", "closeBtn" + id);
    close_button.setAttribute("class", "close");
    close_button.setAttribute("value", "x");
    close_button.innerHTML = "x";
    header.appendChild(close_button);

    var editor = document.createElement('textarea');
    editor.setAttribute("class", "editor");
    editor.setAttribute("id", "editor" + id);
    editor.name = "code_editor";
    editor.maxLength = "5000";
    editor.cols = "25";
    editor.rows = "19";

    var front = document.createElement("div");
    $(front).addClass("front");
    $(front).attr('id', 'front' + id);
    front.appendChild(header);
    front.setAttribute("position", "fixed");
    front.appendChild(editor);
    div.appendChild(front);

    var back = document.createElement("div");
    back.innerHTML = "poop";
    $(back).addClass("back");
    div.appendChild(back);


    var flipBtn = document.createElement("button");
    flipBtn.innerHTML = "flip";
    flipBtn.setAttribute("id", "flipBtn" + div.id);
    $(flipBtn).addClass("flipBtn");
    $(flipBtn).css({
        position: "fixed",
        top: 270,
        left: 190,
    });
    flipBtn.onclick = function () {
        handleCardFlip(div, flipBtn);
    };
    div.appendChild(flipBtn);

    setDivPosition(div);
    $(div).draggable();
    $("#" + id).draggable({
        handle: ".card-header",
        containment: "window", // hack way to disable transition effects
        start: function (event, ui) {
            $('.card').toggleClass('notransition');
        },
        stop: function (event, ui) {
            $('.card').toggleClass('notransition');
        }
    });
    setCardDroppableEffects(id);
    var fullScreenBtn = document.createElement("button");
    fullScreenBtn.onclick = function (e) {
        toggleFullscreen(div, fullScreenBtn);
    };
    header.appendChild(fullScreenBtn);
    $(fullScreenBtn)
        .attr("id", "fullscreenBtn" + id)
        .addClass("fullscreenBtn");
    fullScreenBtn.innerHTML = "e";


}

function handleCardFlip(div, flipBtn) {
    if (!div.classList.contains("flipMe")) {
        document.body.appendChild(flipBtn);
        // if the screen has been expanded
        if (($("#front" + div.id)[0].style.width).toString() === "100%")
            $(flipBtn).css({
                top: "97.5%",
                left: "97%",
                zIndex: getHighestZIndexCard()
            });
        else // if is just the card.
            $(flipBtn).css({
                top: (parseInt(div.style.top) + 270).toString() + "px",
                left: (parseInt(div.style.left) + 190).toString() + "px",
                zIndex: getHighestZIndexCard()
            });
    } else {
        setTimeout(function () { //wait for animation to complete before appending back
            div.appendChild(flipBtn);
            $(flipBtn).css({
                position: "fixed",
                top: "97.5%",
                left: "97%"
            });
        }, 500);
    }
    $(div).toggleClass("flipMe");
}

function toggleFullscreen(div, btn) {
    var curTop = $(div)[0].style.top;
    var curLeft = $(div)[0].style.left;
    var tmp = document.createElement("div"); // hack to hide gap during transition
    var header = document.createElement("div");
    $(header).addClass("card card-header");
    document.body.appendChild(tmp);
    $(tmp)
        .append(header)
        .css({
            top: curTop,
            left: curLeft,
            height: "280px",
            width: "200px",
            position: "fixed",
            backgroundColor: "grey"
        });
    $(div)
        .hide()
        .animate({top: 0, left: 0, width: "100%", height: "100%"}, 0.10)
        .show();
    $("#flipBtn" + div.id).animate({top: "97.5%", left: "97%"}, 0.1);
    $(div.children).each(function () {
        if (!this.classList.contains("flipBtn"))
            $(this).animate({top: 0, left: 0, width: "100%", height: "100%"}, 0.1);
    });
    $(tmp).remove();
    btn.onclick = function () {
        // strange bug where child div's positions to expanded card are zero.. Problem?
        $(div).animate({width: "200px", height: "280px", top: curTop, left: curLeft}, 100);
        $("#flipBtn" + div.id).animate({top: "270px", left: "190px"}, 400);
        $(div.children).each(function () {
            if (!this.classList.contains("flipBtn"))
                $(this).animate({width: "200px", height: "280px"}, 100);
        });
        btn.onclick = function () {
            toggleFullscreen(div, btn);
        };
    };
}


function cardExpansion(id, btn) {
    var test = $("#" + id);
    btn.innerHTML = "Close";
    var base = getBottomStack(test, test);
    base = $("#" + base.id);
    $(base[0].children).each(function (idx) {
        if (this.classList.contains("Test")) {
            $(this.firstChild).click(function () { // some work can be done regarding editing cards while expanded
                document.body.append(this.parentNode);
            });
            $(this).css({
                top: base[0].style.top,
                left: parseInt(base[0].style.left) + (225 * (idx))
            });
        }
    });
    btn.onclick = function () {
        collapseCards(id, base);
        $("#collapseBtn" + id).remove();
        btn.innerHTML = "Expnd";
        btn.onclick = function () {
            cardExpansion(id, btn);
        }
    };
}


function collapseCards(id, base) {
    $(base[0].children).each(function (idx) {
        if (this.classList.contains("Test")) {
            if (idx > 1) {
                $(this).css({
                    top: parseInt(base[0].style.top) + (20 * (idx)),
                    left: parseInt(base[0].style.left) + (5 * (idx))
                });
            } else
                $(this).css({
                    top: parseInt(base[0].style.top) + (20 * (idx)),
                    left: parseInt(base[0].style.left) + (5 * (idx))
                });
        }
    });

}

function arrangeLowerCards(cur, base) {
    var getCurPos = 0;
    for (var i = 0; i < $(base)[0].children.length; i++) //start at 2 to get past header and text box
        if ($(base)[0].children[i].id === cur[0].id)
            getCurPos = i;
    for (getCurPos++; getCurPos < $(base)[0].children.length; getCurPos++) {
        $("#" + $(base)[0].children[getCurPos].id).css({ // move divs to prevent gaps in stack
            top: parseInt($(base)[0].children[getCurPos].style.top) - 20,
            left: parseInt($(base)[0].children[getCurPos].style.left) - 5
        });
    }
}

function getBottomStack(element, ui) {
    while (!(element[0].parentNode.classList.contains("container")))
        element[0] = element[0].parentNode;
    return element[0];
}

function hideButtons(parent) {
    $(parent.children).each(function () {
        var cur = this;
        $($(cur).find("button")).each(function () {
            $(this).hide();
        });
    });
}


function moveStackEffects(latestAdd, base) {
    var id = base;
    if (base.classList.contains("highlightBox"))
        id = base;
    else
        id = base.parentNode;
    hideButtons(id);
    $(id.children).each(function () {
        if (this.classList.contains("Test")) {
            console.log(this);
            //$(this).draggable("destroy");
            $(this.firstElementChild).draggable({
                cancel: "text",
                handle: ".editor",
                containment: "window",
                drag: function (event, ui) {
                    var temp = $(this)[0].parentNode; //parent
                    var test = $(this)[0].nextElementSibling; // back
                    console.log(test, temp);
                    var par = $(this)[0];
                    $([temp, test]).each(function () {
                        var cur = this;
                        $(cur).css({
                            top: par.style.top,
                            left: par.style.left
                        });
                    });
                    $(document.getElementsByClassName("expandableBtn")).remove();
                    $(id.children).each(function () {
                        if (this.classList.contains("Test") &&
                            $(this)[0].nextElementSibling !== null) {
                            console.log($(this));
                            var top = parseFloat($(this)[0].nextElementSibling.style.top) - 20;
                            var left = parseFloat($(this)[0].nextElementSibling.style.left) - 5;
                            this.style.top = top.toString() + "px";
                            this.style.left = left.toString() + "px";
                        }
                    });
                    $(id).css({ //moves highlight box
                        top: parseFloat(id.firstElementChild.style.top) - 5,
                        left: parseFloat(id.firstElementChild.style.left) - 5
                    });
                },
                start: function (event, ui) {
                    $('.card').toggleClass('notransition');
                },
                stop: function () {
                    $('.card').toggleClass('notransition');
                }
            });
        }
    });
}


function setHighlightBox(base, curCard) {
    console.log(base, curCard);
    if (!base.classList.contains("highlightBox")) { // if there is not a highlight box on the stack
        var box = document.createElement("div"); //instantiate a highlight box
        box.setAttribute("id", "highlightBox" + base.id);
        $(box).addClass("highlightBox");
        document.body.appendChild(box);
        $(box).css({
            position: "fixed",
            top: base.style.top,
            left: base.style.left,
            width: 200 + ((base.children.length) * 10),
            height: 280 + ((base.children.length) * 18)
        }).droppable({
            hoverClass: "ui-state-highlight"
        }).hover(// on highlight box mouseover
            function () { // changes background of hover and creates the expand btn on hover
                $(this).css("background", "rgba(0, 246, 255, 0.20)");
                var expandBtn = document.createElement("button");
                expandBtn.setAttribute("class", "expandableBtn");
                expandBtn.setAttribute("id", "expandableBtn");
                expandBtn.innerHTML = "Expnd";
                box.append(expandBtn);
                $("#expandableBtn").css({
                    position: "fixed",
                    top: parseInt(this.style.height) + parseInt(this.style.top) - 12,
                    left: parseInt(this.style.width) + parseInt(this.style.left) - 35
                });
                expandBtn.onclick = function () {
                    cardExpansion(box.id, this);
                }
            }, // on mouse out
            function () {
                $(this).prop("style").removeProperty("background");
                $("#expandableBtn").remove();
            }
        );
        $(box).append(base);
        $(base).css({
            top: parseInt($(box)[0].style.top) + 5,
            left: parseInt($(box)[0].style.left) + 5
        });
        console.log(curCard);
        if (curCard[0].children.length > 3) // if there is just 1 card
            $(curCard[0].children).each(function (idx) {
                setClickEffects(this, box, base);
            });
        else {
            $(box).append(curCard[0]);
            var isDragging = false;
            var firstHeader = base.firstElementChild.firstElementChild;
            setClickEffects(curCard[0], box, base);
            firstHeader.onmousedown = function () {
                cardPreview(base, firstHeader, box, base);
            };
        }



    } else { // If there is already a box there
        var box = document.getElementById(base.id);
        document.body.appendChild(curCard[0]);
        $(box).css({ //move the highlight box
            height: parseInt($(box)[0].style.height) + 15,
            width: parseInt($(box)[0].style.width) + 10
        });
        if ($(box)[0].lastChild.classList.contains("expandableBtn"))
            $(curCard[0]).insertBefore($(box)[0].lastChild);
        else
            box.append(curCard[0]);
        setClickEffects(curCard[0], box, base);

    }
}

function cardPreview(cur, firstHeader, box, base) {
    var isDragging = false;
    if (!$(cur)[0].parentNode.classList.contains("container") && !$(cur)[0].classList.contains("ui-draggable"))
        $(cur.firstElementChild).draggable("destroy");
    $(cur).draggable({
        handle: ".card-header",
        containment: "window",
        start: function (event, ui) {
            $('.card').toggleClass('notransition');
            if (!cur.parentNode.classList.contains("container"))
                breakOutOfBox(cur, box, base);
            isDragging = true;
        },
        stop: function (event, ui) {
            $('.card').toggleClass('notransition');
        }
    });
    firstHeader.onmouseup = function () { // handle just click events.
        var prevZIndex = cur.style.zIndex;
        if (!isDragging) {
            console.log("Just a click", cur);
            cur.style.zIndex = getHighestZIndexCard();
            $(cur).mouseleave(function () {
                cur.style.zIndex = prevZIndex;
            });
            isDragging = false;
        }
    };
}



function shrinkBox(box) {
    $(box).css({
        height: parseInt($(box)[0].style.height) - 15,
        width: parseInt($(box)[0].style.width) - 10
    });
}

function closeCard(id) {
    var card = $("#" + id)[0].parentNode.parentNode.parentNode;
    console.log(card);
    //When it is just the single card pulled out of stack
    if (!card.parentNode.classList.contains("highlightBox"))
        $(card).remove();
    else {
        alert("Can't delete card while in stack.");
    }

}

function addButtonsBack(curCard) {
    $($(curCard).find("button")).each(function () {
        $(this).show();
    });
}


function breakOutOfBox(cur, box, base) {
    console.log(cur);
    if (event.target.classList.contains("close")) {
        closeCard(event.target.id);
        return;
    }
    shrinkBox(box);
    cur.style.zIndex = getHighestZIndexCard();
    //$(cur).draggable("destroy");
    addButtonsBack(cur);
    $(cur).addClass("Base");
    if (isBottom($(cur), base) === false) // if the card is not the bottom card rearrange them
        arrangeLowerCards($(cur), $(cur.parentNode));
    document.body.appendChild(cur);
    if ($(box).children("div").length === 1) {
        console.log($(cur));

        $(base.firstElementChild).draggable("destroy");
        $(base).draggable({
            handle: ".card-header",
            containment: "window",
            start: function (event, ui) {
                $('.card').toggleClass('notransition');
                console.log("here");
                base.style.zIndex = getHighestZIndexCard();
            },
            stop: function (event, ui) {
                $('.card').toggleClass('notransition');
            }
        });
        addButtonsBack($(box)[0].firstElementChild);
        document.body.appendChild($(box)[0].firstElementChild);
        $(box).remove();
    }
}

function setClickEffects(cur, box, base) {
    if (cur.classList.contains("Test")) {
        $(cur).css({
            top: parseInt(cur.previousElementSibling.style.top) + 20,
            left: parseInt(cur.previousElementSibling.style.left) + 5
        });
        $(box).append(cur);
        // when someone clicks on the header of a card
        var firstHeader = cur.firstElementChild.firstElementChild;
        if (firstHeader.classList.contains("close")) //hack for 2 card stacks
            firstHeader = firstHeader.parentNode;
        firstHeader.onmousedown = function () {
            isDragging = cardPreview(cur, firstHeader, box, base)
        };
    }
}

function mergeStacks(curCard) {
    var base = curCard[0].parentNode.firstElementChild;
    $(curCard[0].parentNode.children).each(function () {
        if (this !== base && this.classList.contains("Test"))
            $(base).append(this);
    });
    document.body.appendChild(base);
    $(base.previousElementSibling).remove();
    return base;
}

function setCardDroppableEffects(id) {
    $("#" + id).droppable({
        drop: function (event, ui) {
            if ($(this)[0].parentNode !== $(ui.draggable)[0].parentNode || $(this)[0].parentNode.classList.contains("container")) {
                var bottomStack = getBottomStack($(this));
                if ($(ui.draggable)[0].parentNode.classList.contains("highlightBox")) {
                    var base = mergeStacks($(ui.draggable));
                    setHighlightBox(bottomStack, $(base));
                    moveStackEffects($(base), bottomStack); // give cards the moving stackable effects
                    return;
                }
                setHighlightBox(bottomStack, $(ui.draggable));
                moveStackEffects($(ui.draggable)[0], bottomStack); // give cards the moving stackable effects
            }
        }
    });
}


//Check if card being dragged is at the bottom to prevent rearranging cards on stack
function isBottom(curCard, fromStack) {
    var base = $(fromStack);
    if (base[0].lastChild.previousSibling.id === curCard[0].id ||
        base[0].lastChild.id === curCard[0].id) // or clause for expandable btn
        return true;
    else
        return false;
}


// Gets the highest z Index so that the clicked card will appear at the front.
function getHighestZIndexCard() {
    var cards = document.getElementsByClassName("card");
    var highestSoFar = 0;
    for (var i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > highestSoFar)
            highestSoFar = parseInt(cards[i].style.zIndex);
    }
    return highestSoFar + 1;
}

//To make sure that when a card is created it stacks on top of the other cards
function setDivPosition(div) {
    var cards = document.getElementsByClassName("card");
    var eleAtStart = {};
    var multiplier = 0;
    div.style.position = "fixed";
    div.style.zIndex = getHighestZIndexCard(); // the newest window will be on top of the stack
    div.style.top = "35px";
    div.style.left = "10px";
    div.className += " Test";
    if (cards.length === 0) { // if there are no cards on page
        document.body.appendChild(div);
        $("#" + div.id).mousedown(function (event) {
            if (event.target.parentNode.classList.contains("Base")) {
                $(div).children('.card').each(function () {
                    if (!this.classList.contains("card-header"))
                        document.body.appendChild(this); // used to bring cards to front
                });
            }
        });
        console.log($(div));
        div.firstElementChild.firstElementChild.onmousedown = function () {
            div.style.zIndex = getHighestZIndexCard();
        };
        return;
    } else {
        //    alert("Edit and move already spawned card first.");
        //return;
    }

    // Jesus christ this is ugly, refactor this at some point
    for (var i = 0; i < cards.length; i += 2) { // +=2 to only get the cards not the headers
        if (cards[i].style.left == "10px" && cards[i].style.top == "35px") {
            eleAtStart = cards[i]; // get whoever is at the start at spawn point
            document.body.append(div);
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