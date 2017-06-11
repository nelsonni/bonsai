class Card {
  constructor(type) {
    this.id = this.nextId();

    var card = document.createElement('div');
    $(card).attr({
      id: "card_" + this.id,
      type: type,
      class: "card"
    });
    this.card = card;
    var header = document.createElement('div');
    $(header).attr({
      id: "header_" + this.id,
      class: "card-header"
    });
    $(header).html("card: " + this.id);

    var close_button = document.createElement('button');
    $(close_button).attr({
      id: "close_button_" + this.id,
      class: "close"
    });
    $(close_button).click(function() {
      this.closest('.card').remove();
    });

    var close_button = document.createElement('button');
    $(close_button).attr({
      id: "close_button_" + this.id,
      class: "close"
    });
    $(close_button).click(function() {
      let card = this.closest(".card");
      let id = (card.id).split("_");
      let cleanID = parseInt(id[id.length - 1]);
      delete currentCards[cleanID]
      this.closest('.card').remove();
    });
    header.appendChild(close_button);

    card.appendChild(header);
    document.body.appendChild(card);
    this.buildFaces(card, type);
    this.setDraggable();
    this.setDroppable();
  }
  getCardObject(card) {
    let id = (card[0].id).split("_");
    let last = parseInt(id[id.length - 1]);
    let obj = currentCards[last]
    return obj;
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window',
      stack: '.card, .stack',
      start: function(event, ui) {
        $(this.card).removeClass('atSpawn');
      }
    });
  }

  nextId() {
    var ids = $.map($('.card'), function(card) {
      return parseInt($(card).attr('id').split("_")[1]);
    });
    if (ids.length < 1) return 1; // no cards on the canvas yet

    var next = 1;
    while (ids.indexOf(next += 1) > -1);
    return next;
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window',
      stack: '.card, .stack',
      start: function(event, ui) {
        $(this.card).removeClass('atSpawn');
      }
    });
  }

  setDroppable() {
    $(this.card).droppable({
      accept: '.card, .stack',
      classes: {
        'ui-droppable-hover': 'highlight'
      },
      drop: function(event, ui) {
        // handle card-to-card drop event
        if ($(ui.draggable).hasClass('card')) {
          new Stack($(this), $(ui.draggable));
        }
        // handle stack-to-card drop event
        if ($(ui.draggable).hasClass('stack')) {
          var stack = new Stack($(this));
          ui.draggable.children('.card')
            .each((index, card) => stack.addCard($(card)));
          stack.cascadeCards();
          stack.resizeStack();
          $(ui.draggable).remove();
        }
      }
    });
  }


  buildFaces(card, type) {
    var eleTypeToCreate = "";
    if (type === "editor")
      eleTypeToCreate = "textarea";
    else if (type === "sketch")
      eleTypeToCreate = "div";

    var content = document.createElement('div');
    $(content).attr({
      class: "editor",
      id: card.id + "_editor_" + this.id
    });
    var face1 = document.createElement('div');
    var face1_editor = document.createElement(eleTypeToCreate);
    face1.appendChild(face1_editor);
    var face2 = document.createElement('div');
    var face2_editor = document.createElement(eleTypeToCreate);
    face2.appendChild(face2_editor);
    var face3 = document.createElement('div');
    var face3_editor = document.createElement(eleTypeToCreate);
    face3.appendChild(face3_editor);

    if (type === "editor")
      $([face1_editor, face2_editor, face3_editor]).each(function(idx) {
        $(this).attr({
          id: card.id + "textEditor_" + idx,
          class: "editor"
        });
      });
    else if (type === "sketch")
      $([face1_editor, face2_editor, face3_editor]).each(function(idx) {
        $(this).attr({
          class: "sketchEditor",
          id: card.id + "sketch_" + idx
        });
      });

    content.appendChild(face1);
    content.appendChild(face2);
    content.appendChild(face3);
    let swipable = true;
    if (type === "sketch")
      swipable = false;
    $(content).slick({
      dots: true,
      swipe: swipable,
      accessiblity: true,
      focusOnSelect: true
    });
    card.appendChild(content);
  }

  toggleFullScreen() {
    if (!$(this.card).hasClass('fullscreen')) { // transtion to fullscreen
      $(this.card).attr('prevStyle', $(this.card)[0].style.cssText);
      $(this.card).addClass('fullscreen').removeAttr('style');
      $(this.card).find('*').each((index, child) => $(child).addClass('fullscreen'));
      // $([face1_editor, face2_editor, face3_editor]).each(function (idx) {
      //   $(this).attr({cols: "25", rows: "19"});
      // });
    } else { // transition back from fullscreen
      $(this.card).removeClass("fullscreen");
      $(this.card)[0].style.cssText = $(this.card).attr('prevStyle');
      $(this.card).removeAttr('prevStyle');
      $(this.card.children).each((index, child) => $(child).removeAttr('style'));
      $(this.card).find('*').each((index, child) => $(child).removeClass('fullscreen'));
      // $([face1_editor, face2_editor, face3_editor]).each(function (idx) {
      //   $(this).attr({cols: "25", rows: "19", maxLength: "5000"});
      // });
    }
  }
}
