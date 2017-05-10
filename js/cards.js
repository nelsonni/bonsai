/*
 - Change mouse cursor to draggable when on top of stack remove text

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
    close_button.onclick = function () {
        closeCard(id)
    };
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
        left: 190
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
    console.log(window.innerWidth);
    var base = $("#" + id);

    cardWrapAround(base, btn);
    btn.onclick = function () {
        collapseCards(btn, base);
    };
}


function cardWrapAround(box, btn) {
    var stackWindowDiff = window.innerWidth - parseInt(box[0].style.left);
    var stackExpansionWidth = (parseInt(box[0].style.width) - 15) * (box[0].children.length - 1);
    console.log(parseInt(box[0].style.left), window.innerWidth);
    if (parseInt(box[0].style.left) + parseInt(box[0].style.width) + 200 >= window.innerWidth) {
        alert("Can't expand at all");
        return;
    }
    $(box[0].children).each(function (idx) { // possible bug since took away the click listener?
        if (this.classList.contains("actualCard")) {
            $(this).draggable("disable");
            $(this).css({
                top: parseInt(box[0].style.top) + 10,
                left: parseInt(box[0].style.left) + (225 * (idx))
            });
        }
    });
    if (stackExpansionWidth >= stackWindowDiff) {
        var lastFittingCard;
        var nonFittingCards = [];
        $(box[0].children).each(function (idx) {
            if (parseInt(this.style.left) + 225 <= window.innerWidth && this.classList.contains("actualCard"))
                lastFittingCard = this;
            else
                nonFittingCards.push(this);
        });
        $(nonFittingCards).each(function (idx) {
            $(this).css({
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
    } else {
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
        .removeClass("expanded");
    $(btn).css({left: 200 + ((base.children.length) * 10)});
    $(base[0].children).each(function (idx) {
        if (this.classList.contains("actualCard")) {
            $(this).draggable("enable");
            $(this).css({
                zIndex: getHighestZIndexCard(),
                top: parseInt(base[0].firstElementChild.style.top) + (20 * (idx)),
                left: parseInt(base[0].style.left) + (5 * (idx + 1))
            });
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
    console.log(cur, base);
    for (var i = 0; i < $(base)[0].children.length; i++) //start at 2 to get past header and text box
        if ($(base)[0].children[i].id === cur[0].id)
            getCurPos = i;
    var stackLength = $(base)[0].children.length;
    for (stackLength--; stackLength > getCurPos; stackLength--) {
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
            $(box.children).each(function (idx) {
                if (this.classList.contains("actualCard")) {
                    var left = parseInt(box.style.left) + (5 * (idx + 2));
                    var top = parseInt(box.style.top) + (20 * (idx + 1));
                    this.style.top = top.toString() + "px";
                    this.style.left = left.toString() + "px";
                }
            });
        },
        start: function () {
            $('.card').toggleClass('notransition');
        },
        stop: function () {
            $('.card').toggleClass('notransition');
        }
    });
}


function setHighlightBox(base, curCard) {
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
                if (document.getElementsByClassName("expandableBtn").length !== 0)
                    return;
                $(this).css("background", "rgba(0, 246, 255, 0.20)");
                var expandBtn = document.createElement("button");
                expandBtn.setAttribute("class", "expandableBtn");
                expandBtn.setAttribute("id", "expandableBtn");
                box.append(expandBtn);
                $("#expandableBtn").css({
                    position: "fixed",
                    top: parseInt(this.style.height) + parseInt(this.style.top) - 12,
                    left: parseInt(this.style.width) + parseInt(this.style.left) - 35
                });
                if (!box.classList.contains("expanded")) {
                    expandBtn.innerHTML = "Expnd";
                    expandBtn.onclick = function () {
                        cardExpansion(box.id, this);
                    }
                } else {
                    expandBtn.innerHTML = "Close";
                    expandBtn.onclick = function () {
                        collapseCards(expandBtn, $(box));
                    };
                }
            }, // on mouse out
            function () {
                $(this).prop("style").removeProperty("background");
                $(".expandableBtn").remove();
            }
        );
        $(box).append(base);
        $(base).css({
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
        $(box).css({
            height: parseInt($(box)[0].style.height) + 10,
            width: parseInt($(box)[0].style.width) + 5
        });
        setClickEffects(curCard[0], box, base);

    }
}

function cardPreview(cur, firstHeader, box, base) {
    var isDragging = false;
    try {
        if (!$(cur)[0].parentNode.classList.contains("container"))
            $(cur).draggable("destroy"); // remove the handle on the editor
    } catch (err) {
        console.log("Tried");
    }
    $(cur).draggable({
        handle: ".card-header",
        containment: "window",
        start: function (event, ui) {
            cur.style.zIndex = getHighestZIndexCard();
            $('.card').toggleClass('notransition');
            if (!cur.parentNode.classList.contains("container"))
                breakOutOfBox(cur, box, base, this);
            isDragging = true;
        },
        stop: function (event, ui) {
            $('.card').toggleClass('notransition');

        }
    });
    firstHeader.onmouseup = function () { // handle just click events.
        if (!isDragging) {
            var prevZIndex = cur.style.zIndex;

            if (event.target.classList.contains("close")) {
                closeCard(event.target.id);
                return;
            }
            cur.style.zIndex = getHighestZIndexCard();
            $(cur).mouseleave(function () {
                cur.style.zIndex = prevZIndex;
                $(cur).unbind("mouseleave");
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


function breakOutOfBox(cur, box, base, cardToBeMoved) {
    shrinkBox(box);
    cur.style.zIndex = getHighestZIndexCard();
    addButtonsBack(cur);
    $(cur).addClass("Base");
    if (isBottom($(cur), base) === false) // if the card is not the bottom card rearrange them
        arrangeLowerCards($(cur), $(cur.parentNode));
    document.body.appendChild(cur);
    var baseHead = box.firstElementChild;
    if ($(box).children("div").length === 1) {
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
        addButtonsBack($(box)[0].firstElementChild);
        document.body.appendChild($(box)[0].firstElementChild);
        $(box).remove();
    }
}

function setClickEffects(cur, box, base) {
    var lastCard = $("#" + box.id + " div.actualCard").last();
    if (!cur.classList.contains("highlightBox"))
        $(box).append(cur);
    if (cur.classList.contains("actualCard")) {
        $(cur).css({
            zIndex: getHighestZIndexCard(),
            top: parseInt(lastCard[0].style.top) + 20,
            left: parseInt(lastCard[0].style.left) + 5
        });
        var firstHeader = cur.firstElementChild.firstElementChild;
        if (firstHeader.classList.contains("close")) //hack for 2 card stacks
            firstHeader = firstHeader.parentNode;
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
            $(this).css({
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
            if ($(ui.draggable)[0].classList.contains("front")) // prevents odd propagation effect from starting drops
                return;
            if ($(this)[0].parentNode !== $(ui.draggable)[0].parentNode
                || $(this)[0].parentNode.classList.contains("container")) {
                var bottomStack = getBottomStack($(this));
                if ($(ui.draggable)[0].classList.contains("highlightBox")) {
                    var newBase = mergeStacks($(ui.draggable), $(this));
                    setHighlightBox(bottomStack, $(newBase));
                    moveStackEffects($(newBase), bottomStack); // give cards the moving stackable effects
                    return;
                }
                setHighlightBox(bottomStack, $(ui.draggable));
                moveStackEffects($(ui.draggable), bottomStack); // give cards the moving stackable effects
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
    var cards = document.getElementsByClassName("actualCard");
    div.style.position = "fixed";
    div.style.zIndex = getHighestZIndexCard(); // the newest window will be on top of the stack
    div.style.top = "35px";
    div.style.left = "10px";
    div.className += " actualCard";

    /* div.firstElementChild.firstElementChild.onmousedown = function () {
        div.style.zIndex = getHighestZIndexCard();
    };
     */
    // var first;
    var mult = 0; // searches for cards that have a direct position related to spawn point and calculates offset
    for (var i = 0; i < cards.length; i++)  // add a class here called 'atSpawn' to track who is stacked
        if (cards[i].style.top == ((35 + (30 * (i))).toString() + "px"))
            mult += 1;

    $(div).css({
        top: ((35 + (30 * (mult))).toString() + "px"),
        left: ((10 + (5 * mult)).toString() + "px")
    });
    //if (cards.length === 0)
    document.body.appendChild(div);
    //else
    //     $(first).append(div);

}