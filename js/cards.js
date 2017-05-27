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
    $(close_button).click(function() {this.closest('.card').remove();});
    header.appendChild(close_button);

    var fullscreen_button = document.createElement('button');
    $(fullscreen_button).attr({id: "fullscreen_button_" + this.id,
      class: "expand"});
    $(fullscreen_button).click(() => this.toggleFullScreen());
    header.appendChild(fullscreen_button);

    var content = document.createElement('div');
    $(content).attr({class: "editor", id: "editor_" + this.id});
    var face1 = document.createElement('div');
    var face1_editor = document.createElement('textarea');
    $(face1_editor).attr({class: "editor", id: "editor_1", maxLength: "5000",
      cols: "25", rows: "19"});
    face1.appendChild(face1_editor);
    var face2 = document.createElement('div');
    var face2_editor = document.createElement('textarea');
    $(face2_editor).attr({class: "editor", id: "editor_2", maxLength: "5000",
      cols: "25", rows: "19"});
    face2.appendChild(face2_editor);
    var face3 = document.createElement('div');
    var face3_editor = document.createElement('textarea');
    $(face3_editor).attr({class: "editor", id: "editor_3", maxLength: "5000",
      cols: "25", rows: "19"});
    face3.appendChild(face3_editor);
    content.appendChild(face1);
    content.appendChild(face2);
    content.appendChild(face3);
    $(content).slick({
      dots: true,
      accessiblity: true,
      focusOnSelect: true
    });

    card.appendChild(header);
    card.appendChild(content);
    document.body.appendChild(card);

    this.setDraggable();
    this.setDroppable();
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window', // disable transition effects
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
        console.log("dropped " + $(ui.draggable).attr('id') + " on to " + $(this).attr('id'));
        var stack = new Stack($(this), $(ui.draggable));
      }
    });
  }

  toggleFullScreen() {
    if ($(this.card).attr('fullscreen') === 'false') {
      $(this.card).attr({
          prevWidth: $(this.card).width(),
          prevHeight: $(this.card).height(),
          prevTop: $(this.card).offset().top,
          prevLeft: $(this.card).offset().left,
          prevZIndex: $(this.card).css('zIndex'),
          fullscreen: true})
        .hide()
        .css({zIndex: 100})
        .animate({top: 0, left: 0, width: "100%", height: "100%"}, 0.10)
        .show();
      $("#flip_button_" + this.id).hide();
      $(this.card.children).each(function () {
        if(!this.classList.contains("flip"))
          $(this).animate({top: 0, left: 0, width: "100%", height: "100%"},
            0.10);
      });
      $("#fullscreen_button_" + this.id).toggleClass('expand collapse');
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
