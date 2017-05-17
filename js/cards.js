/*
 - Adjust highlight box when a card is removed.
 -------------------------------------------------------------------------------------
 - We need some serious refactoring
 */

function Card(id) {
    this.id = id;
    var div = document.createElement("div");
    $(div).attr({
        class: "card",
        id: id
    });

    var header = document.createElement("div");
    $(header).attr({
        class: "card card-header"
    }).html("id: " + id);

    var close_button = document.createElement("button");
    $(close_button).attr({
        id: "closeBtn" + id,
        class: "close",
        value: "x"
    }).html("x").click(function () {
        closeCard(id);
    });
    header.appendChild(close_button);

    var editor = document.createElement("textarea");
    $(editor).attr({
        class: "editor",
        id: "editor" + id,
        maxLength: "5000",
        cols: "25",
        rows: "19"
    });

    var front = document.createElement("div");
    $(front).addClass("front")
        .attr({
            id: "front" + id,
            position: "fixed"
        }).append(header).append(editor);

    var back = document.createElement("div");
    $(back).addClass("back").html("Stuff");
    $(div).append(front).append(back);

    var flipBtn = document.createElement("button");

    $(flipBtn).attr("id", "flipBtn" + div.id)
        .html("")
        .addClass("flipBtn")
        .click(function () {
        handleCardFlip(div, flipBtn);
    });
    div.appendChild(flipBtn);

    setDivPosition(div);
    $("#" + id).draggable({
        handle: ".card-header",
        containment: "window", // hack way to disable transition effects
        start: function (event, ui) { // bring card to front, and label it at spawn.
            $(div)[0].style.zIndex = getHighestZIndexCard();
            $('.card').toggleClass('notransition');
            $(this).removeClass("atSpawn");
        },
        stop: function (event, ui) {
            $('.card').toggleClass('notransition');
        }
    });
    setCardDroppableEffects(id);

    var fullScreenBtn = document.createElement("button");
    fullScreenBtn.onclick = function () {
        toggleFullscreen(div, fullScreenBtn);
    };
    header.appendChild(fullScreenBtn);
    $(fullScreenBtn)
        .attr("id", "fullscreenBtn" + id)
        .addClass("fullscreenBtn").html("e");
}

function handleCardFlip(div, flipBtn) {
    if (!div.classList.contains("flipMe")) {
        document.body.appendChild(flipBtn); // append to body so it doesn't turn with card.
        // if the screen has been expanded
        if (($("#front" + div.id)[0].style.width).toString() === "100%")
            $(flipBtn).css({ // keep it in bottom left of screen if card expanded
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
    $(tmp) //tmp sits in position of card to hide weird animation effect
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
    $(tmp).remove(); // remove after animations have completed.
    btn.onclick = function () { // switch click to shrink the card back down to normal size and position.
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
    btn.innerHTML = "Close";
    var base = $("#" + id);
    cardWrapAround(base, btn);
    $(btn).click(function () {
        collapseCards(btn, base);
    });
}


function cardWrapAround(box, btn) {
    var stackWindowDiff = window.innerWidth - parseInt(box[0].style.left);
    var stackExpansionWidth = (parseInt(box[0].style.width) - 15) * (box[0].children.length - 1);
    if (parseInt(box[0].style.left) + parseInt(box[0].style.width) + 200 >= window.innerWidth) {
        alert("Can't expand at all");
        return;
    }
    $(box).draggable("disable"); // disable the stack dragging effect to edit cards while spread out.
    $(box[0].children).each(function (idx) {
        if (this.classList.contains("actualCard")) {
            $(this).css({
                top: parseInt(box[0].style.top) + 10,
                left: parseInt(box[0].style.left) + (225 * (idx))
            }).find(".editor").removeClass("stackedEditor"); // to change cursor on hover.
        }
    });
    if (stackExpansionWidth >= stackWindowDiff) {
        var lastFittingCard;
        var nonFittingCards = [];
        $(box[0].children).each(function (idx) {
            if (parseInt(this.style.left) + 225 <= window.innerWidth && this.classList.contains("actualCard"))
                lastFittingCard = this;
            else { // all other cards that are pushed off screen
                nonFittingCards.push(this);
                $(this).addClass("Wrapped");
            }
        });
        $(lastFittingCard).addClass("Wrapped");
        $(nonFittingCards).each(function (idx) {
            $(this).css({ // position the cards to be stacked back of the last fitting card.
                zIndex: lastFittingCard.style.zIndex - (1 * (idx + 1)),
                top: parseInt(lastFittingCard.style.top) - (20 * (idx + 1)),
                left: parseInt(lastFittingCard.style.left) - (5 * (idx + 1))
            })
        });
        $(box)  // adjust box to the width of the last fitting card
            .css({width: parseInt(lastFittingCard.style.left) - parseInt(box[0].style.left) + 225})
            .addClass("expanded");
        $(btn).css({ //adjust expand/close button properly
            left: parseInt(lastFittingCard.style.left) + 210,
            top: parseInt(box[0].style.top) + parseInt(box[0].style.height) - 15
        });
    } else { // if the cards do not run off the side of the screen.
        var newWidth = (parseInt(box[0].style.width)) * (box[0].children.length - 1);
        $(box)
            .css({width: newWidth})
            .addClass("expanded");
        $(btn).css({left: newWidth + (parseInt(box[0].style.left) - 15)});
    }
}


function collapseCards(btn, base) {
    $(base)
        .css({width: 200 + ((base.children.length) * 10)})
        .removeClass("expanded")
        .draggable("enable"); // enable the stack dragging effect again.
    $(btn).css({left: parseInt(base[0].style.left) + (180 + ((base.children.length) * 10))});
    $(base[0].children).each(function (idx) {
        if (this.classList.contains("actualCard")) {
            $(this)
                .removeClass("Wrapped")
                .css({
                zIndex: getHighestZIndexCard(),
                top: parseInt(base[0].firstElementChild.style.top) + (20 * (idx)),
                left: parseInt(base[0].style.left) + (5 * (idx + 1))
                }).find(".editor").addClass("stackedEditor"); // to change cursor on hover
        }
    });
    btn.innerHTML = "Expnd";
    btn.onclick = function () {
        cardExpansion(id, btn);
    };
    hideButtons(base[0]);

}

function arrangeLowerCards(cur, base) {
    var getCurPos = 0;
    for (var i = 0; i < $(base)[0].children.length; i++) // go through the cards til the card selected has been found.
        if ($(base)[0].children[i].id === cur[0].id)
            getCurPos = i;
    var stackLength = $(base)[0].children.length;
    for (stackLength--; stackLength > getCurPos; stackLength--) { // for all cards past selected, move to prev. pos.
        if (!$(base)[0].children[stackLength].classList.contains("expandableBtn"))
            $("#" + $(base)[0].children[stackLength].id).css({ // move divs to prevent gaps in stack
                top: parseInt($(base)[0].children[stackLength].previousElementSibling.style.top),
                left: parseInt($(base)[0].children[stackLength].previousElementSibling.style.left)
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
    var box = base;
    if (base.classList.contains("highlightBox"))
        box = base;
    else
        box = base.parentNode;
    hideButtons(box);
    $(box).draggable({
        cancel: "text",
        handle: ".editor",
        containment: "window",
        drag: function (event, ui) {
            $(document.getElementsByClassName("expandableBtn")).remove();
            $(box.children).each(function (idx) { // move all cards in the stack relative to the stack being dragged
                if (this.classList.contains("actualCard")) {
                    var left = parseInt(box.style.left) + (5 * (idx + 2));
                    var top = parseInt(box.style.top) + (20 * (idx + 1));
                    this.style.top = top.toString() + "px";
                    this.style.left = left.toString() + "px";
                }
            });
        },
        start: function () {
            $(box).css("zIndex", getHighestZIndexCard()); // bring card to front
            $(box.children).each(function () {
                this.style.zIndex = getHighestZIndexCard();
            });
            $('.card').toggleClass('notransition');
        },
        stop: function () {
            $('.card').toggleClass('notransition');
        }
    });
    $(box.children).each(function () {
        var editor = $(this).find(".editor");
        $(editor).addClass("stackedEditor");
    });
}


function setHighlightBox(base, curCard, addToFront) {
    if (!base.classList.contains("highlightBox")) { // if there is not a highlight box on the stack
        var box = document.createElement("div");
        document.body.appendChild(box);
        $(box).attr("id", "highlightBox" + base.id)
            .addClass("highlightBox")//instantiate a highlight box
            .css({
                position: "fixed",
                zIndex: getHighestZIndexCard(),
                top: base.style.top,
                left: base.style.left,
                width: 200 + ((base.children.length) * 10),
                height: 280 + ((base.children.length) * 18)
            }).droppable({
            hoverClass: "ui-state-highlight"
        }).hover(// on highlight box mouseover
            function () { // changes background of hover and creates the expand btn on hover
                if (document.getElementsByClassName("expandableBtn").length !== 0)
                    return;
                $(this).css("background", "rgba(0, 246, 255, 0.20)");
                var expandBtn = document.createElement("button");
                box.append(expandBtn);
                $(expandBtn).attr({
                    class: "expandableBtn",
                    id: "expandableBtn" + box.id
                }).css({
                    position: "fixed",
                    top: parseInt(this.style.height) + parseInt(this.style.top) - 12,
                    left: parseInt(this.style.width) + parseInt(this.style.left) - 35
                });
                if (!box.classList.contains("expanded")) {
                    $(expandBtn).html("Expnd")
                        .click(function () {
                            cardExpansion(box.id, this);
                        });
                } else {
                    $(expandBtn).html("Close")
                        .click(function () {
                            collapseCards(expandBtn, $(box));
                        });
                }
            }, // on mouse out
            function () {
                $(this).prop("style").removeProperty("background");
                $(".expandableBtn").remove();
            }
        );
        $(box).append(base);
        $(base).removeClass("atSpawn")
            .css({
                top: parseInt($(box)[0].style.top) + 5,
                left: parseInt($(box)[0].style.left) + 5
            });
        var firstHeader = base.firstElementChild.firstElementChild;
        setClickEffects(curCard[0], box, base);
        firstHeader.onmousedown = function () {
            cardPreview(base, firstHeader, box, base);
        };
    } else { // If there is already a highlightBox
        var box = document.getElementById(base.id);
        $(box).css({ //grow highlight box.
            height: parseInt($(box)[0].style.height) + 10,
            width: parseInt($(box)[0].style.width) + 5
        });
        setClickEffects(curCard[0], box, base, addToFront);

    }
}

function cardPreview(cur, firstHeader, box, base) {
    var isDragging = false;
    if (!$(cur)[0].parentNode.classList.contains("container"))
        $(cur).draggable("destroy"); // remove the handle on the editor
    $(cur).draggable({
        handle: ".card-header",
        containment: "window",
        start: function () {
            cur.style.zIndex = getHighestZIndexCard();
            $('.card').toggleClass('notransition');
            if (!cur.parentNode.classList.contains("container"))
                breakOutOfBox(cur, box, base, this);
            isDragging = true; // if there is a drag effect, break out of box.
        },
        stop: function (event, ui) {
            $('.card').toggleClass('notransition');
        }
    });
    firstHeader.onmouseup = function () { // handle just click events.
        if (!isDragging) { // if there was no drag..
            var prevZIndex = cur.style.zIndex;
            if (event.target.classList.contains("close")) {
                closeCard(event.target.id);
                return;
            }
            cur.style.zIndex = getHighestZIndexCard();
            $(cur).mouseleave(function () {
                cur.style.zIndex = prevZIndex; // push it back in the stack
                $(cur).unbind("mouseleave")
            });
            isDragging = false;
        }
    };
}


function shrinkBox(box) {
    $(box).css({
        height: parseInt($(box)[0].style.height) - 10,
        width: parseInt($(box)[0].style.width) - 5
    });
}

function closeCard(id) {
    var card = $("#" + id)[0].parentNode.parentNode.parentNode;
    try { // when it's just a single card that hasn't been added to a stack
        if (card === document) throw "Bad base";
    } catch (err) {
        if (err === "Bad base") card = $("#" + id)[0];
    }
    $(card).remove();
}

function addButtonsBack(curCard) { //show all buttons out of stack
    $($(curCard).find("button")).each(function () {
        $(this).show();
    });
}

function adjustHighlightBoxExpanded(box) {
    if (!box.classList.contains("expanded"))
        return;
    var newWidth = parseInt(box.style.width) - 220;
    $(box).animate({width: newWidth});
    $(box.lastElementChild).animate({
        left: parseInt(box.style.left) + (newWidth - 20),
        top: parseInt(box.style.top) + parseInt(box.style.height) - 20
    });

}


function breakOutOfBox(cur, box, base, cardToBeMoved) {
    shrinkBox(box);
    if (!cur.classList.contains("Wrapped"))
        adjustHighlightBoxExpanded(box);
    cur.style.zIndex = getHighestZIndexCard();
    addButtonsBack(cur);
    if (isBottom($(cur), base) === false) // if the card is not the bottom card rearrange them
        arrangeLowerCards($(cur), $(cur.parentNode));
    document.body.appendChild(cur);
    var baseHead = box.firstElementChild;
    if ($(box).children("div").length === 1) { // if there is just one card left.
        if (baseHead.classList.contains("ui-draggable"))
            $(baseHead).draggable("destroy");
        $(base).draggable({
            handle: ".card-header",
            containment: "window",
            start: function (event, ui) {
                $('.card').toggleClass('notransition');
            },
            stop: function (event, ui) {
                $('.card').toggleClass('notransition');
            }
        });
        var onlyCard = $(box)[0].firstElementChild;
        addButtonsBack(onlyCard);
        document.body.appendChild(onlyCard);
        $(onlyCard).find(".editor").removeClass("stackedEditor");
        $(box).remove();
    }
    $(cur).find(".editor").removeClass("stackedEditor");
}

function setClickEffects(cur, box, base, addToFront) {
    var lastCard = $("#" + box.id + " div.actualCard").last();
    $(cur).removeClass("atSpawn");
    if (!cur.classList.contains("highlightBox"))
        $(box).append(cur);
    if (addToFront === true)
        $(box.firstElementChild).before(cur); // append to the top of the stack.
    if (cur.classList.contains("actualCard")) {
        if (addToFront === true) {
            $(cur).css({
                zIndex: cur.nextElementSibling.style.zIndex - 1,
                top: parseInt(box.style.top),
                left: parseInt(box.style.left)
            });
            $(box.children).each(function (idx) {
                $(this).css({ // adjust everything relative to the new card being pushed.
                    top: parseInt(box.style.top) + (20 * (idx)),
                    left: parseInt(box.style.left) + (5 * (idx))
                });
            });
        } else
            $(cur).css({ // add it the bottom of the stack.
                zIndex: getHighestZIndexCard(),
                top: parseInt(lastCard[0].style.top) + 20,
                left: parseInt(lastCard[0].style.left) + 5
            });
        var firstHeader = cur.firstElementChild.firstElementChild;
        // when someone clicks on the header of a card
        firstHeader.onmousedown = function () {
            isDragging = cardPreview(cur, firstHeader, box, base);
        };
    }
}

function mergeStacks(curStack, targetCard) {
    var base = targetCard[0].parentNode;
    $(curStack[0].children).each(function () {
        if (this !== curStack[0] && this.classList.contains("actualCard")) {
            $(base).append(this);
            $(this).css({ // go through all cards and add them to the front of the target stack.
                zIndex: getHighestZIndexCard(),
                top: parseInt(this.previousElementSibling.style.top) + 20,
                left: parseInt(this.previousElementSibling.style.left) + 5
            });
            $(base).css({ //grow the highlight box
                height: parseInt(base.style.height) + 10,
                width: parseInt(base.style.width) + 5
            });
        }
    });
    $(curStack).remove();
    return base;
}

function setCardDroppableEffects(id) {
    $("#" + id).droppable({
        drop: function (event, ui) {
            if (this.classList.contains("atSpawn") && this != $(".atSpawn").last()[0])
                return; // go through all cards at the spawn and only append to the top.
            if ($(this)[0].parentNode !== $(ui.draggable)[0].parentNode
                || $(this)[0].parentNode.classList.contains("container")) {
                var bottomStack = getBottomStack($(this));
                if ($(ui.draggable)[0].classList.contains("highlightBox") &&
                    this.parentNode.classList.contains("highlightBox")) { // merge stacks together
                    var newBase = mergeStacks($(ui.draggable), $(this));
                    setHighlightBox(bottomStack, $(newBase), false);
                    moveStackEffects($(newBase), bottomStack);
                    return;
                } // if they are dragging a stack onto a single card
                if ($(ui.draggable)[0].classList.contains("highlightBox")) {
                    setHighlightBox($(ui.draggable)[0], $(bottomStack), true);
                    moveStackEffects($(ui.draggable)[0], bottomStack);
                } else { // just card stacking a single  card
                    setHighlightBox(bottomStack, $(ui.draggable), false);
                    moveStackEffects($(ui.draggable), bottomStack);
                }
            }
        }
    });
}

//Check if card being dragged is at the bottom to prevent rearranging cards on stack
function isBottom(curCard, fromStack) {
    var base = $(fromStack);
    if (base[0].lastChild.classList.contains("expandableBtn") !== curCard[0].id &&
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
    var cards = document.getElementsByClassName("atSpawn");
    $(div).css({
        position: "fixed",
        zIndex: getHighestZIndexCard(),
        top: "35px",
        left: "10px"
    }).addClass(" actualCard atSpawn");
    var last = $(cards).last();
    if (last.length !== 0)
        $(div).css({
            top: ((35 + parseFloat(last[0].style.top)).toString() + "px"),
            left: ((10 + parseFloat((last[0].style.left))).toString() + "px")
        });
    document.body.appendChild(div);
}
