(function() {
  QUnit.module("Single Card");
  QUnit.test("Single Card tests", function(assert) {
    assert.expect(9);
    $("#createCard").simulate("click");
    var curCard = returnCard(1);
    var cardHeader = $(curCard[0].firstElementChild.firstElementChild);

    assert.equal(document.getElementsByClassName("actualCard").length, 1, "Card found on canvas");
    assert.equal(curCard[0].style.top, "35px", "Card at spawn point");
    assert.ok(cardHeader[0].classList.contains("card-header"), "header found");
    assert.ok(cardHeader[0].classList.contains("card"), "card header found");
    assert.ok(cardHeader[0].classList.contains("ui-draggable-handle"), "draggable element  found");
    $(cardHeader).simulate("drag", {
      dx: 100,
      dy: 100
    });
    assert.equal(curCard[0].style.top, "135px", "card successfully dragged vertically");
    assert.equal(curCard[0].style.left, "110px", "card dragged horizontally");
    $(curCard).find(".editor").simulate("key-sequence", {
      sequence: "asdf"
    });
    console.log($(curCard).find(".editor"));
    assert.equal($(curCard).find(".editor")[0].value, "asdf", "Value found in text box");
    $(curCard).find(".close").simulate("click");
    assert.equal(document.getElementsByClassName("actualCard").length, 0, "Card sucessfully deleted");
    $(curCard).remove();
  });

  QUnit.module("Stacked Cards");
  QUnit.test("Stacked Cards tests", function(assert) {
    $("#createCard").simulate("click");
    $("#createCard").simulate("click");
    var firstCard = returnCard(1);
    var secondCard = returnCard(2);

    var highlightBox = document.getElementsByClassName("highlightBox");
    assert.equal(secondCard[0].style.zIndex, getHighestZIndexCard() - 1, "Newest card has highest zIndex");
    assert.equal(document.getElementsByClassName("highlightBox").length, 0, "No highlight box found");
    blocker = true;
    $(secondCard[0].firstElementChild.firstElementChild).simulate("drag-n-drop", {
      dragTarget: firstCard
    });
    blocker = false;
    assert.equal(highlightBox.length, 1, "Highlight box found after drag");
    assert.equal(highlightBox[0].firstElementChild, firstCard[0], "First child of highlight box is first card spawned");
    assert.equal(highlightBox[0].lastElementChild, secondCard[0], "Last child of highlight box is second card spawned");
    stackOK(highlightBox, assert);

    $("#editor2").simulate("drag-n-drop", {
      dx: 200,
      interpolation: {
        stepCount: 40
      }
    });

    assert.equal(highlightBox[0].style.left, "210px",
      "Highlight box is moved left properly");
    assert.equal(highlightBox[0].style.top, "35px",
      "Highlight box is moved top properly");

    stackOK(highlightBox, assert);

    $(highlightBox).simulate("mouseover");
    var btn = document.getElementsByClassName("expandableBtn");
    assert.equal($(btn)[0].textContent, "Expnd", "Button label correct");
    assert.equal(btn.length, 1, "expandable button found on page");

    $("#createCard").simulate("click");
    var thirdCard = returnCard(3);
    $(thirdCard[0].firstElementChild.firstElementChild).simulate("drag-n-drop", {
      dragTarget: secondCard
    });

    $(".expandableBtn").simulate("click");
    expansionOK(highlightBox, assert); // need synchrounous testing


    assert.equal($(btn)[0].textContent, "Close", "Button label correct");
    $(".expandableBtn").simulate("click");
    stackOK(highlightBox, assert);
    $(thirdCard[0].firstElementChild.firstElementChild).simulate("drag-n-drop", {
      dx: 100
    });
    $(thirdCard[0]).find(".close").simulate("click")

    var prevLeft1 = $(firstCard)[0].style.left;
    var prevLeft2 = $(secondCard)[0].style.left;
    $(secondCard[0].firstElementChild.firstElementChild).simulate("drag-n-drop", {
      dx: 100,
      dy: 100
    });
    assert.equal($(secondCard)[0].style.left, (parseInt(prevLeft2) + 100).toString() + "px",
      "Second card pulled away succesfully");
    assert.equal($(firstCard)[0].style.left, (parseInt(prevLeft1)).toString() + "px",
      "First card pulled away succesfully");
    assert.equal(document.getElementsByClassName("highlightBox").length, 0, "highlightBox removed Successfully");
    assert.equal(document.getElementsByClassName("actualCard").length, 2, "2 cards on the canvas.");
    $("#closeBtn2").simulate("click");
    assert.equal(document.getElementsByClassName("actualCard").length, 1, "1 cards on the canvas.");
    $("#closeBtn1").simulate("click");
    assert.equal(document.getElementsByClassName("actualCard").length, 0, "No cards on the canvas.");
  });

  function handleWrappedCards(wrapped, assert) {
    var lastFit;
    $(wrapped).each(function() {
      if (this.classList.contains("actualCard") && this.classList.contains("lastFit"))
        lastFit = this;
    });
    $(wrapped).each(function(idx) {
      if (this.classList.contains("actualCard") && !this.classList.contains("lastFit")) {
        assert.equal(this.style.top, (parseInt(lastFit.style.top) - (20 * (idx))).toString() + "px", "back stack positioned top correctly");
        assert.equal(this.style.left, (parseInt(lastFit.style.left) - (5 * (idx))).toString() + "px",
          "back stack position left correctly");
      }
    });
  }


  function expansionOK(box, assert) { // need to account for card wrap around still
    var wrapped = document.getElementsByClassName("Wrapped");
    if (wrapped.length != 0) {
      handleWrappedCards(wrapped, assert);
      return;
    }
    for (var i = 0; i < box[0].children.length; i++) {
      if (box[0].children[i].classList.contains("actualCard")) {
        var curCard = box[0].children[i];
        assert.equal(curCard.style.top, (parseInt(box[0].style.top) + 10).toString() + "px", "Card positioned top correctly");
        assert.equal(curCard.style.left, (parseInt(box[0].style.left) + (225 * (i) + 5)).toString() + "px",
          "Card position left correctly");
      }
    }
  }


  function stackOK(box, assert) {
    assert.ok(true, "INSIDE OF STACK OK!!!");
    var lastCard = $("#" + box[0].id + " div.actualCard").last();
    for (var i = 0; i < box[0].children.length; i++) {
      if (box[0].children[i].classList.contains("actualCard")) {
        var curCard = box[0].children[i];
        assert.equal(curCard.style.top, (parseInt(box[0].style.top) + (20 * (i + 1))).toString() + "px",
          i.toString() + "th Card top OK");
        assert.equal(curCard.style.left, (parseInt(box[0].style.left) + (5 * (i + 1))).toString() + "px",
          i.toString() + "th Card left OK");
      }
    }
    assert.ok(true, "EXITING STACK OK!!!");

  }

})();
