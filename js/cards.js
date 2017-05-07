function Card(id) {
    this.id = id;
    var div = document.createElement("div");
    div.setAttribute("class", "card");
    div.setAttribute("id", this.id);

    /*
     - When clicking on a card in a stack bring to front then on mouse away, push it back
     - Change mouse cursor to draggable when on top of stack remove text
     - Allow cards to be edited while fanned out.
     - Be able to delete cards
     - Implement flipping card
     - Implement card zoom
     -------------------------------------------------------------------------------------
     - We need some serious refactoring
     */


    var header = document.createElement('div');
    header.setAttribute("class", "card card-header");
    header.innerHTML = "id:" + this.id;

    var close_button = document.createElement('button');
    close_button.setAttribute("id", "closeBtn" + id);
    close_button.setAttribute("class", "close");
    close_button.setAttribute("value", "x");
    close_button.innerHTML = "x";

    var editor = document.createElement('textarea');
    editor.setAttribute("class", "editor");
    editor.name = "code_editor";
    editor.maxLength = "5000";
    editor.cols = "25";
    editor.rows = "19";

    var back = document.createElement("div");
    back.innerHTML = "poop";
    $(back).addClass("back");


    var front = document.createElement("div");
    $(front).addClass("front");
    $(front).attr('id', 'front' + id);
    header.appendChild(close_button);
    front.appendChild(header);
    front.setAttribute("position", "fixed");
    front.appendChild(editor);
    div.appendChild(front);
    div.appendChild(back);
    var btn = document.createElement("button");
    btn.innerHTML = "flip";
    btn.setAttribute("id", "flipBtn" + div.id);
    btn.onclick = function () {
        var test = document.getElementById(id);
        test.classList.toggle('flipMe');
    };
    //  div.appendChild(btn);
    $(btn).css({
        position: "fixed",
        top: 200,
        left: 200
    });
    setDivPosition(div);
    $(".editor").draggable();
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
    var modal = document.createElement("button");
    modal.onclick = function (e) {
        toggleFullscreen(div, modal);
    };
    modal.innerHTML = "expnd";
    header.appendChild(modal);
    $(modal).css({
        height: 30,
        width: 30
    });


}

function toggleFullscreen(div, btn) {
    console.log(div);
    var curTop = $(div)[0].style.top;
    var curLeft = $(div)[0].style.left;
    $(div).removeClass("card");

    $(div).css({
        top: curTop,
        left: curLeft
    });
    $(div.children).each(function () {
        $(this).animate({top: "0px", left: "0px", width: "100%", height: "100%"}, 0.5);

    });
    $(div).animate({top: "0px", left: "0px", width: "100%", height: "100%"}, 0.5);

    btn.onclick = function () {
        //setTimeout(function(){div.setAttribute("transform-style","preserve-3d")},500);
        // strange bug where child div's positions are zero.. Problem?
        $(div.children).each(function () {
            $(this).animate({width: "200px", height: "280px"}, 0.5);
            $(this).animate({top: 0, left: 0}, 0.5);
        });
        $(div).animate({width: "200px", height: "280px"}, 0.5);
        $(div).animate({top: curTop, left: curLeft}, 0.5);
        $(div).addClass("card");

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


function moveStackEffects(latestAdd, base) {
    //console.log(base);
    var id = base;
    if (base.classList.contains("highlightBox")) // hack to prevent
        id = base;
    else
        id = base.parentNode;
    //console.log($(id.children));
    $(id.children).each(function () {
        if (this.classList.contains("Test")) {
            $(this).draggable("destroy");
            $(this).draggable({
                handle: ".card",
                containment: "window",
                drag: function (event, ui) {
                    /*var turd = this;
                     var temp = $(this)[0].parentNode; //parent
                     var test = $(this)[0].nextElementSibling; // back
                     console.log(test,temp);
                     $([test, temp]).each(function() {
                     var cur = this;
                     $(cur).css({
                     top: turd.style.top,
                     left: turd.style.left
                     }); //upon dragging remove expandable Btn
                     })*/
                    $(document.getElementsByClassName("expandableBtn")).remove();
                    $(id.children).each(function () {
                        //console.log($(this));
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
        console.log(base);
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
            setClickEffects(curCard[0], box, base);
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

function setClickEffects(cur, box, base) {
    console.log($(cur));
    if (cur.classList.contains("Test")) {
        $(cur).css({
            top: parseInt(cur.previousElementSibling.style.top) + 20,
            left: parseInt(cur.previousElementSibling.style.left) + 5
        });
        $(box).append(cur);
        // when someone clicks on the header of a card
        var firstHeader = cur.firstElementChild.firstElementChild;
        console.log($(firstHeader));
        if (firstHeader.classList.contains("close")) //hack for 2 card stacks
            firstHeader = firstHeader.parentNode;
        firstHeader.onmousedown = function () {
            cur.style.zIndex = getHighestZIndexCard();

            if (event.target.classList.contains("close")) {
                closeCard(event.target.id);
                return;
            }
            shrinkBox(box);
            firstHeader.parentNode.parentNode.style.zIndex = getHighestZIndexCard();
            $(firstHeader.parentNode.parentNode).draggable("destroy");
            $(firstHeader.parentNode.parentNode).draggable({
                handle: ".card-header",
                containment: "window",
                start: function (event, ui) {
                    $('.card').toggleClass('notransition');
                },
                stop: function (event, ui) {
                    $('.card').toggleClass('notransition');
                }
            });
            $(base).addClass("Base");
            document.body.appendChild(firstHeader.parentNode.parentNode);
            console.log($(box));
            if ($(box).children("div").length === 1) {
                $(box.firstElementChild).draggable("destroy");
                $(box.firstElementChild).draggable({
                    handle: ".card-header",
                    containment: "window",
                    start: function (event, ui) {
                        $('.card').toggleClass('notransition');
                    },
                    stop: function (event, ui) {
                        $('.card').toggleClass('notransition');
                    }
                });
                document.body.appendChild($(box)[0].firstElementChild);
                $(box).remove();
            }
            ;
        };
        console.log(cur);
        cur.firstElementChild.firstElementChild.onmousedown = function (event) {
            if (event.target.classList.contains("close")) {
                closeCard(event.target.id);
                return;
            }
            shrinkBox(box);
            console.log(cur);
            cur.style.zIndex = getHighestZIndexCard();
            console.log(cur);
            //$(cur).draggable("destroy");
            $(cur).draggable({
                handle: ".card-header",
                containment: "window",
                start: function (event, ui) {
                    $('.card').toggleClass('notransition');
                },
                stop: function (event, ui) {
                    $('.card').toggleClass('notransition');
                }
            });
            $(cur).addClass("Base");
            if (isBottom($(cur), base) === false) // if the card is not the bottom card rearrange them
                arrangeLowerCards($(cur), $(cur.parentNode));
            document.body.appendChild(cur);
            if ($(box).children("div").length === 1) {
                $(box.firstElementChild).draggable("destroy");
                $(box.firstElementChild).draggable({
                    handle: ".card-header",
                    containment: "window",
                    start: function (event, ui) {
                        $('.card').toggleClass('notransition');
                    },
                    stop: function (event, ui) {
                        $('.card').toggleClass('notransition');
                    }
                });
                document.body.appendChild($(box)[0].firstElementChild);
                $(box).remove();
            }
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
    var base = $("#" + fromStack.id);
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
        }
        return;
    } else {
        //    alert("Edit and move already spawned card first.");
        //return;
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