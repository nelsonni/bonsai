class Card {
  constructor(type) {
    this.id = (++cardCounter);

    var card = document.createElement('div');
    $(card).attr({id: "card_" + this.id, type: type, class: "card",
      fullscreen: false});
    this.card = card;

    var header = document.createElement('div');
    $(header).attr({id: "header_" + this.id, class: "card-header"});
    $(header).html("card: " + this.id);

    var close_button = document.createElement('button');
    $(close_button).attr({id: "close_button_" + this.id, class: "close"});
    $(close_button).click(function () {
      this.closest('.card').remove();
    });
    header.appendChild(close_button);

    var fullscreen_button = document.createElement('button');
    $(fullscreen_button).attr({id: "fullscreen_button_" + this.id,
      class: "expand"
    });
    $(fullscreen_button).click(() => this.toggleFullScreen());
    header.appendChild(fullscreen_button);

    card.appendChild(header);
    document.body.appendChild(card);
    this.buildFaces(card, type);
    this.setDraggable();
    this.setDroppable();
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window',
      stack: '.card', // bring the currently dragged item to the front
      start: function(event, ui) {
        $(this.card).removeClass('atSpawn');
      }
    });
  }

  setDroppable() {
    $(this.card).droppable({
      accept: '.card',
      classes: {
        'ui-droppable-hover': 'highlight'
      },
      drop: function(event, ui) {
        var stack = new Stack($(this), $(ui.draggable));
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
    $(content).attr({class: "editor", id: card.id + "_editor_" + this.id});
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
      $([face1_editor, face2_editor, face3_editor]).each(function (idx) {
        $(this).attr({
          class: "editor", id: card.id + "textEditor_" + idx, maxLength: "5000",
          cols: "25", rows: "19"
        });
      });
    else if (type === "sketch")
      $([face1_editor, face2_editor, face3_editor]).each(function (idx) {
        $(this).attr({class: "sketchEditor", id: card.id + "sketch_" + idx});
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
    // handle unexpanded card transitioning to fullscreen
    if ($(this.card).attr('fullscreen') === 'false') {
      $(this.card).attr({
          prevWidth: $(this.card).width(),
          prevHeight: $(this.card).height(),
          prevTop: $(this.card).offset().top,
          prevLeft: $(this.card).offset().left,
          prevZIndex: $(this.card).css('zIndex'),
          fullscreen: true})
        .hide()
        .css({zIndex: 1000})
        .animate({top: 0, left: 0, width: "100%", height: "100%"}, 0.10)
        .show();
      $("#flip_button_" + this.id).hide();

      $(this.card.children).each(function () {
        if ($(this).hasClass('card-header')) {
          $(this).animate({top: 0, left: 0, width: '100%'}, 0.10);
        } else {
          $(this).animate({top: 0, left: 0, width: "100%", height: "100%"},
            0.10);
        }
      });
      $("#fullscreen_button_" + this.id).toggleClass('expand collapse');
    // handle fullscreen card transitioning to unexpanded
    } else {
      $(this.card)
        .animate({
          width: $(this.card).attr('prevWidth'),
          height: $(this.card).attr('prevHeight'),
          top: $(this.card).attr('prevTop'),
          left: $(this.card).attr('prevLeft')}, 100)
        .css({zIndex: $(this.card).attr('prevZIndex')});
      $(this.card.children).each(function () {
        if (!this.classList.contains("flip"))
          $(this).animate({
            width: $(this.card).attr('prevWidth'),
            height: $(this.card).attr('prevHeight')}, 100);
      });
      $("#fullscreen_button_" + this.id).toggleClass('expand collapse');
      $("#flip_button_" + this.id).show();
      $(this.card).removeAttr('prevWidth prevHeight prevTop prevLeft prevZIndex');
      $(this.card).attr('fullscreen', false);
    }
  }
}
