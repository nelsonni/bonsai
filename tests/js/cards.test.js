(function() {
  const {
    test
  } = QUnit;
  var done;
  QUnit.module("Single Card");

  test("Single card spawn and drag", function(assert) {
    done = assert.async(2);
    //$("li").hide();
    $("#createCard").simulate("click");
    var curCard = returnCard();
    var cardHeader = $(curCard[0].firstElementChild);
    assert.equal(document.getElementsByClassName("card").length, 1, "Card found on canvas");
    var e = $.Event("keydown", {
      keyCode: 69
    });
    $(curCard).find("#" + curCard[0].id + "textEditor_0").trigger("click");
    $(curCard).find("#" + curCard[0].id + "textEditor_0").trigger(e);
    assert.equal($(curCard).find("#" + curCard[0].id + "textEditor_0")[0].value, "e", "Text value found in text box");
    $(curCard).find(".editor").simulate("drag", {
      dx: 100,
      dy: 100
    });
    assert.equal($(curCard)[0].style.top, "", "Card didn't move on attempted editor drag");
    assert.ok(cardHeader[0].classList.contains("ui-draggable-handle"), "Draggable element found on card header");
    $(cardHeader).simulate("drag", {
      dx: 100,
      dy: 100,
      moves: 150
    });
    assert.equal(curCard[0].style.left, "118px", "Card successfully dragged horizontally");



    $(curCard.find(".card-header")).simulate("drag", {
      dx: 5000
    });
    assert.notEqual(curCard[0].style.left, "5135px", "Card successfully stayed on canvas window going right");
    $(curCard.find(".card-header")).simulate("drag", {
      dx: -10000
    });
    assert.notEqual(curCard[0].style.left, "-10135px", "Card successfully stayed on canvas window going left");
    $(curCard.find(".card-header")).simulate("drag", {
      dy: 5000
    });
    assert.notEqual(curCard[0].style.top, "5135px", "Card successfully stayed on canvas window going up");
    $(curCard.find(".card-header")).simulate("drag", {
      dy: -10000
    });
    assert.notEqual(curCard[0].style.top, "-5135px", "Card successfully stayed on canvas window going down");
    setTimeout(function() {

      //assert.notEqual(ogBack, $(curCard).find(".back")[0].innerHTML, "Updated time value after altering text box");
      $(curCard).find(".close").simulate("click");
      assert.equal(document.getElementsByClassName("card").length, 0, "Card successfully deleted from canvas");
      done();
    }, 2000);
    done();
  });

  test("Card Expansion", function(assert) {
    done = assert.async(3);
    $("#createCard").simulate("click");
    var card = returnCard();
    $(card).find(".editor").simulate("key-sequence", {
      sequence: "fart"
    });
    let ogEditorSize = $(card).find(".editor").height();

    assert.equal($(card).find(".editor")[0].value, "fart", "Text field editable in expansion");
    $(card).find(".expand").simulate("click");
    setTimeout(function() {
      assert.equal(card[0].style.width, "100%", "Card has been expanded 100% horizontally");
      assert.equal(card[0].style.height, "100%", "Card has been expanded 100% vertically");
      assert.equal(card[0].style.top, "0px", "Card has been set to top position 0px");
      assert.equal(card[0].style.left, "0px", "Card has been set to left position 0px");
      setTimeout(function() {
        $(card).find(".collapse").simulate("click");
        setTimeout(function() {
          assert.equal(ogEditorSize, $(card).find(".editor").height(), "Card editor resized appropriately on collapse");
          $(card).find(".close").simulate("click");
          assert.equal(document.getElementsByClassName("card").length, 0, "Card successfully deleted from canvas");
          done();
        }, 500);
      }, 510);
      done();
    }, 210);
    done();
  });

  // -------------------------------------------------------------------------------------------------------------------
  QUnit.module("Two Stack Tests");

  test("Merge two stacks together", function(assert) {
    done = assert.async();
    $("#createCard").simulate("click");
    var firstCard = returnCard();
    $("#createCard").simulate("click");
    var secondCard = returnCard();
    $("#createCard").simulate("click");
    var thirdCard = returnCard();
    $("#createCard").simulate("click");
    var fourthCard = returnCard();
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 500
    });
    $(thirdCard.find(".card-header")).simulate("drag", {
      goto: secondCard
    });
    $(fourthCard.find(".card-header")).simulate("drag", {
      dx: 5
    });
    assert.equal(document.getElementsByClassName("stack").length, 2, "2 stacks now on canvas");
    var box1 = $(secondCard[0].parentNode);
    assert.equal(box1[0].id, "stack_1", "First highlight box found on canvas");
    assert.equal(box1[0].firstElementChild, secondCard[0], "Base card is card #2");
    assert.equal(box1[0].firstElementChild.nextElementSibling, thirdCard[0], "Last card is card #3");
    stackOK(box1, assert);
    var box2 = $(firstCard[0].parentNode);
    assert.equal(box2[0].id, "stack_2", "Second highlight box found on canvas");
    assert.equal(box2[0].firstElementChild, firstCard[0], "Base card is card #1");
    assert.equal(box2[0].firstElementChild.nextElementSibling, fourthCard[0], "Last card is card #4");
    stackOK(box2, assert);
    $(thirdCard.find(".editor")).simulate("drag", {
      dx: -500,
      moves: 50
    });
    assert.equal(document.getElementsByClassName("stack").length, 1, "1 stack now on canvas");
    box1 = $(firstCard[0].parentNode);
    stackOK(box1, assert);
    assert.equal(box1[0].children[0], firstCard[0], "First card in merge is card #1");
    assert.equal(box1[0].children[1], fourthCard[0], "Second card in merge is card #4");
    assert.equal(box1[0].children[2], secondCard[0], "Third card in merge is card #2");
    assert.equal(box1[0].children[3], thirdCard[0], "Fourth card in merge is card #3");
    //TEST 4 card deep stacks
    $(".stack, .card").remove();
    done();
  });


  test("Push stack onto a single card", function(assert) {
    done = assert.async();
    $("#createCard").simulate("click");
    var firstCard = returnCard();
    $("#createCard").simulate("click");
    var secondCard = returnCard();
    $("#createCard").simulate("click");
    var thirdCard = returnCard();
    $(firstCard.find(".card-header")).simulate("drag", {
      dx: 500
    });
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 500
    });
    var t = firstCard.find(".editor");
    $(secondCard.find(".editor")).simulate("drag", {
      goto: firstCard,
      moves: 100
    });
    var box = $(firstCard[0].parentNode);
    let prev = box[0].style.top;
    assert.notEqual(box[0].style.top, prev, "highlightBox positioned properly");
    stackOK(box, assert);
    assert.equal(box[0].children[0], firstCard[0], "First card in stack is card #1");
    assert.equal(box[0].children[1], thirdCard[0], "Second card in stack is card #3");
    assert.equal(box[0].children[2], secondCard[0], "Third card in stack is card #2");
    $(secondCard.find(".editor")).simulate("drag", {
      dy: 500,
      moves: 100
    });
    assert.equal(box[0].style.top, "525px", "highlightBox dragged properly while in stack");
    $(".stack, .card").remove();
    done();
  });

  QUnit.module("Stacked Cards");
  QUnit.test("Simple Card stacking and moving", function(assert) {
    done = assert.async();
    var firstCard = createAndReturnCard();
    var secondCard = createAndReturnCard();
    assert.equal(stackCounter, 0, "No highlight box found on canvas");
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 50
    });
    let stack = document.getElementById("stack_1");
    assert.equal(stackCounter, 1, "Highlight box found after stacking cards");
    assert.equal(stack.firstElementChild, firstCard[0], "First child of highlight box is first card spawned");
    assert.equal(stack.firstElementChild.nextElementSibling, secondCard[0], "Last child of highlight box is second card spawned");
    stackOK($(stack), assert);


    $(secondCard.find(".editor")).simulate("drag", {
      dx: 200,
      moves: 500
    });
    assert.equal(stack.style.left, "193px",
      "Highlight box is moved left properly");
    let prevStackTop = stack.style.top;
    assert.notEqual(stack.style.top, prevStackTop,
      "Highlight box is moved top properly");
    stackOK($(stack), assert);

    $(firstCard.find(".card-header")).simulate("drag", {
      dy: -500
    });
    var secondCardTopBeforeMove = secondCard[0].style.top;
    assert.equal(document.getElementsByClassName("highlightBox").length, 0, "highlightBox not found on canvas");
    assert.equal(firstCard[0].style.top, "145px", "First card pulled away from canvas successfully.");
    assert.equal(secondCard[0].style.top, secondCardTopBeforeMove, "Second card still in original position");
    $(firstCard.find(".close")).simulate("click");
    assert.equal($(document.getElementById(firstCard[0].id)).length, 0, "First card successfully deleted");
    $(secondCard.find(".close")).simulate("click");
    assert.equal($(document.getElementById(secondCard[0].id)).length, 0, "Second card successfully deleted");
    done();
  });
  QUnit.test("Stacked Card window containment", function(assert) {
    done = assert.async();
    var firstCard = createAndReturnCard();
    var secondCard = createAndReturnCard();
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 5
    });
    var box = document.getElementsByClassName("stack");
    stackOK(box, assert);
    $(secondCard.find(".editor")).simulate("drag", {
      dx: 5000
    });
    assert.notEqual(box[0].style.left, "5135px", "Card successfully stayed on canvas window going right");
    $(secondCard.find(".editor")).simulate("drag", {
      dx: -10000
    });
    assert.notEqual(box[0].style.left, "-10135px", "Card successfully stayed on canvas window going left");
    $(secondCard.find(".editor")).simulate("drag", {
      dy: 5000
    });
    assert.notEqual(box[0].style.top, "5135px", "Card successfully stayed on canvas window going up");
    $(secondCard.find(".editor")).simulate("drag", {
      dy: -10000
    });
    assert.notEqual(box[0].style.top, "-5135px", "Card successfully stayed on canvas window going down");
    $(".stack, .card").remove();
    done();
  });
  /*
      QUnit.test("Card Expansion Tests (No Wrap)", function (assert) {
          done = assert.async();
          var firstCard = createAndReturnCard();
          var secondCard = createAndReturnCard();
          var thirdCard = createAndReturnCard();
          $(thirdCard.find(".card-header")).simulate("drag", {goto: secondCard});
          $(thirdCard.find(".editor")).simulate("drag", {goto: firstCard});
          var box = document.getElementsByClassName("highlightBox");
          stackOK(box, assert);

          $(box).simulate("mouseover");
          var btn = document.getElementsByClassName("expandableBtn");
          assert.equal($(btn)[0].textContent, "Expnd", "Expnd Button label correct");
          assert.equal(btn.length, 1, "expandable button found on page");

          $(".expandableBtn").simulate("click");

          expansionOK(box, assert);
          assert.equal($(btn)[0].textContent, "Close", "Close button label correct");
          $(".expandableBtn").simulate("mouseover");
          $(".expandableBtn").simulate("click");
          stackOK(box, assert);

          assert.equal(box[0].style.height, (280 + (20 * box[0].children.length)).toString() + "px", "highlight Box height reset properly");
          assert.equal(box[0].style.width, (200 + (8 * box[0].children.length)).toString() + "px", "highlight Box width reset properly");
          $(box).remove();
          done();
      });
      QUnit.test("Card Wrap around tests", function (assert) {
          done = assert.async();
          var firstCard = createAndReturnCard();
          var secondCard = createAndReturnCard();
          var thirdCard = createAndReturnCard();
          $(thirdCard.find(".card-header")).simulate("drag", {goto: secondCard});
          $(thirdCard.find(".editor")).simulate("drag", {goto: firstCard});
          var box = document.getElementsByClassName("highlightBox");
          stackOK(box, assert);
          $(thirdCard.find(".editor")).simulate("drag", {dx: 800, moves: 500});
          $(".expandableBtn").simulate("click");
          assert.equal(box[0].classList.contains("expanded"), false, "Card could not be moved this close to the edge of " +
              "screen");
          $(thirdCard.find(".editor")).simulate("drag", {dx: -300, moves: 300});
          $(secondCard).simulate("mouseover");
          $(".expandableBtn").simulate("click");
          expansionOK(box, assert);
          $(".expandableBtn").simulate("click");
          stackOK(box, assert);
          assert.equal(box[0].style.height, (280 + (20 * box[0].children.length)).toString() + "px",
              "highlightBox set height back properly");
          assert.equal(box[0].style.width, (200 + (8 * box[0].children.length)).toString() + "px",
              "highlightBox set width back properly");
          $(box).remove();
          done();
      });
  */
  QUnit.test("Card repositioning in stack tests", function(assert) {
    $(".card, .stack").remove();
    done = assert.async();
    var firstCard = createAndReturnCard();
    var secondCard = createAndReturnCard();
    var thirdCard = createAndReturnCard();
    var fourthCard = createAndReturnCard();

    $(firstCard.find(".card-header")).simulate("drag", {
      dx: 5
    });
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 5
    });
    var box = document.getElementsByClassName("stack");
    var ogBoxHeight = box[0].style.height;
    var ogBoxWidth = box[0].style.width;
    $(thirdCard.find(".card-header")).simulate("drag", {
      dx: 5
    }); // pull 3rd card to last card
    $(fourthCard.find(".card-header")).simulate("drag", {
      dx: 5
    });
    stackOK(box, assert);
    assert.equal(box[0].style.width, ogBoxWidth, "Box width has stayed the same");
    assert.equal(box[0].style.height, ogBoxHeight, "Box height has stayed the same");
    assert.equal(box[0].children[0], firstCard[0], "First Card is still card #11");
    assert.equal(box[0].children[1], secondCard[0], "Second Card is still card #12");
    assert.equal(box[0].children[2], fourthCard[0], "Third Card is still card #14");
    assert.equal(box[0].children[3], thirdCard[0], "Fourth Card is still card #13");
    $(thirdCard.find(".card-header")).simulate("drag", {
      goto: fourthCard
    }); // pull last card back to last
    stackOK(box, assert);
    assert.equal(box[0].style.width, ogBoxWidth, "Box width has stayed the same");
    assert.equal(box[0].style.height, ogBoxHeight, "Box height has stayed the same");
    assert.equal(box[0].children[0], firstCard[0], "First Card is still card #11");
    assert.equal(box[0].children[1], secondCard[0], "Second Card is still card #12");
    assert.equal(box[0].children[2], fourthCard[0], "Third Card is still card #14");
    assert.equal(box[0].children[3], thirdCard[0], "Fourth Card is still card #13");
    $(secondCard.find(".card-header")).simulate("drag", {
      goto: thirdCard
    }); // pull 2nd card back to last
    stackOK(box, assert);
    assert.equal(box[0].style.width, ogBoxWidth, "Box width has stayed the same");
    assert.equal(box[0].style.height, ogBoxHeight, "Box height has stayed the same");
    assert.equal(box[0].children[0], firstCard[0], "First Card is still card #11");
    assert.equal(box[0].children[1], fourthCard[0], "Second Card is still card #14");
    assert.equal(box[0].children[2], thirdCard[0], "Third Card is still card #13");
    assert.equal(box[0].children[3], secondCard[0], "Fourth Card is still card #12");
    $(firstCard.find(".card-header")).simulate("drag", {
      goto: secondCard
    }); // pull 1st card back to last
    stackOK(box, assert);
    assert.equal(box[0].style.width, ogBoxWidth, "Box width has stayed the same");
    assert.equal(box[0].style.height, ogBoxHeight, "Box height has stayed the same");
    assert.equal(box[0].children[0], fourthCard[0], "First Card is still card #14");
    assert.equal(box[0].children[1], thirdCard[0], "Second Card is still card #13");
    assert.equal(box[0].children[2], secondCard[0], "Third Card is still card #12");
    assert.equal(box[0].children[3], firstCard[0], "Fourth Card is still card #11");
    $(firstCard.find(".card-header")).simulate("drag", {
      goto: fourthCard
    }); // drag the last card to top of stack
    stackOK(box, assert);
    assert.equal(box[0].style.width, ogBoxWidth, "Box width has stayed the same");
    assert.equal(box[0].style.height, ogBoxHeight, "Box height has stayed the same");
    assert.equal(box[0].children[0], fourthCard[0], "First Card is still card #14");
    assert.equal(box[0].children[1], thirdCard[0], "Second Card is still card #13");
    assert.equal(box[0].children[2], secondCard[0], "Third Card is still card #12");
    assert.equal(box[0].children[3], firstCard[0], "Fourth Card is still card #11");
    $(".stack, .card").remove();

    done();
  });

  QUnit.test("Stack Annotation text", function(assert) {
    $(".card, .stack").remove();
    done = assert.async();
    var firstCard = createAndReturnCard();
    var secondCard = createAndReturnCard();
    var thirdCard = createAndReturnCard();
    var fourthCard = createAndReturnCard();
    $(firstCard.find(".card-header")).simulate("drag", {
      dx: 500,
      moves: 150
    });
    $(secondCard.find(".card-header")).simulate("drag", {
      dx: 500,
      moves: 150

    });
    $(thirdCard.find(".card-header")).simulate("drag", {
      dx: 100,
      moves: 150

    });

    let stacks = $(".stack");
    assert.equal(stacks.length, 2, "2 stacks found on canvas");
    stacks[0].lastElementChild.value = "LSDKFJLKDFSJKL";
    $(stacks[1]).simulate("drag", {
      dx: 400,
      moves: 200
    });
    assert.equal(stacks.length, 1, "2 stacks found on canvas");
    assert.equal(stacks[0].value, "LSDKFJLKDFSJKL", "Bottom stack annotation correctly applied to merge stack");
    $(".card, .stack").remove();
    done()
  });

  QUnit.test("Proper card face switched on dragging to stack", function(assert) {
    $(".card, .stack").remove();
    done = assert.async();
    var firstCard = createAndReturnCard();
    $(firstCard.find(".editor")).simulate("drag", {
      dx: 25
    });
    let lastEditor = $(firstCard.find("#" + firstCard[0].id + "textEditor_2"))
    assert.equal($(lastEditor)[0].parentNode.classList.contains("slick-active"), true, "Last card face showing");


    $(firstCard.find(".card-header")).simulate("drag", {
      dx: 200
    });
    var secondCard = createAndReturnCard();
    $(firstCard.find(".card-header")).simulate("drag", {
      dx: -200
    });
    assert.equal($(".stack").length, 1, "stack found on canvas");
    assert.equal($(lastEditor)[0].parentNode.classList.contains("slick-active"), false, "Last card face not showing after stack");

    $(".card, .stack").remove();
    $("li").show();
    done();
  });



  function createAndReturnCard() {
    $("#createCard").simulate("click");
    //$("li").hide();
    return returnCard();
  }

  function handleWrappedCards(wrapped, assert) {
    assert.ok(true, "----------------------INSIDE OF WRAP OK FUNCTION!!!----------------------------");

    var lastFit;
    $(wrapped).each(function() {
      if (this.classList.contains("actualCard") && this.classList.contains("lastFit"))
        lastFit = this;
    });
    $(wrapped).each(function(idx) {
      if (this.classList.contains("actualCard") && !this.classList.contains("lastFit")) {
        assert.equal(this.style.top, (parseInt(lastFit.style.top) - (20 * (idx))).toString() + "px",
          "Card " + wrapped[idx].id + "Overflow cards stacked back positioned top correctly");
        assert.equal(this.style.left, (parseInt(lastFit.style.left) - (5 * (idx))).toString() + "px",
          "Card " + wrapped[idx].id + "Overflow cards stacked back positioned left correctly");
      }
    });
    assert.ok(true, "----------------------EXITING WRAP OK FUNCTION!!!-----------------------------");
  }


  function expansionOK(box, assert) {
    assert.ok(true, "----------------------INSIDE OF EXPANSION OK FUNCTION!!!----------------------------");
    var wrapped = document.getElementsByClassName("Wrapped");
    if (wrapped.length !== 0) {
      handleWrappedCards(wrapped, assert);
      return;
    }
    var expandedWidth = ((215 + (5 * box[0].children.length)) * (box[0].children.length - 1)).toString() + "px";
    assert.equal(box[0].style.width, expandedWidth, "Highlight box" +
      " adjusted to expansion width");
    assert.equal(box[0].style.height, "315px", "Highlight box" +
      " adjusted to expansion width");
    for (var i = 0; i < box[0].children.length; i++) {
      if (box[0].children[i].classList.contains("actualCard")) {
        var curCard = box[0].children[i];
        assert.equal(curCard.style.top, (parseInt(box[0].style.top) + 10).toString() + "px",
          i.toString() + " Card positioned top correctly on expansion");
        assert.equal(curCard.style.left, (parseInt(box[0].style.left) + (225 * (i) + 5)).toString() + "px",
          i.toString() + " Card positioned left correctly on expansion");
        $(curCard).find(".editor").simulate("key-sequence", {
          sequence: "Brandon Rulez"
        });
        assert.equal($(curCard)[0].firstElementChild.lastElementChild.value, "Brandon Rulez", i.toString() +
          "Card is editable while expanded");
      }
    }
    assert.ok(true, "----------------------EXITING EXPANSION OK FUNCTION!!!-----------------------------");
  }


  function stackOK(box, assert) {
    assert.ok(true, "----------------------INSIDE OF STACK OK FUNCTION!!!----------------------------");
    for (var i = 0; i < box[0].children.length; i++) {
      if (box[0].children[i].classList.contains("card")) {
        var curCard = box[0].children[i];
        assert.equal(parseInt(curCard.style.top).toString() + "px", (parseInt(box[0].style.top) + (25 * (i + 1))).toString() + "px",
          i.toString() + " Card top position OK");
        assert.equal(curCard.style.left, (parseInt(box[0].style.left) + (25 * (i + 1))).toString() + "px",
          i.toString() + " Card left position OK");
        if (i !== 0 && !curCard.classList.contains("expandableBtn"))
          assert.ok(parseInt(curCard.style.zIndex) > parseInt(curCard.previousElementSibling.style.zIndex), i.toString() +
            " zIndex is higher than previous card");
      }
    }
    assert.ok(true, "----------------------EXITING STACK OK FUNCTION!!!-----------------------------");
  }
})();
