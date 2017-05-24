class Card {
  constructor(id, type) {
    this.id = id;

    var card = document.createElement('div');
    $(card).attr({
      id: id,
      type: type,
      class: "card",
      fullscreen: false
    }).css('zIndex', getHighestZIndex() + 1);
    this.card = card;

    var header = document.createElement('div');
    $(header).attr({
      id: "header_" + id,
      class: "card-header"
    }).html("card: " + id);

    var close_button = document.createElement('button');
    $(close_button).attr({
      id: "close_button_" + id,
      class: "close"
    }).click(function() { // arrow function cannot be used here; bind required
      this.closest('.card').remove(); // 'this' refers to Card class instance
    });
    header.appendChild(close_button);

    var fullscreen_button = document.createElement('button');
    $(fullscreen_button).attr({
      id: "fullscreen_button_" + id,
      class: "expand"
    }).click(() => this.toggleFullScreen());
    header.appendChild(fullscreen_button);

    var content = document.createElement('div');
    $(content).attr({
      class: "editor",
      id: "editor_" + id
    });
    var face1 = document.createElement('div');
    var face1_editor = document.createElement('textarea');
    $(face1_editor).attr({
      class: "editor",
      id: "editor_1",
      maxLength: "5000",
      cols: "25",
      rows: "19"
    });
    face1.appendChild(face1_editor);
    var face2 = document.createElement('div');
    var face2_editor = document.createElement('textarea');
    $(face2_editor).attr({
      class: "editor",
      id: "editor_2",
      maxLength: "5000",
      cols: "25",
      rows: "19"
    });
    face2.appendChild(face2_editor);
    var face3 = document.createElement('div');
    var face3_editor = document.createElement('textarea');
    $(face3_editor).attr({
      class: "editor",
      id: "editor_3",
      maxLength: "5000",
      cols: "25",
      rows: "19"
    });
    face3.appendChild(face3_editor);
    content.appendChild(face1);
    content.appendChild(face2);
    content.appendChild(face3);
    $(content).slick({
      dots: true
    });

    card.appendChild(header);
    card.appendChild(content);
    document.body.appendChild(card);
    this.setDraggable();
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window', // disable transition effects
      start: function(event, ui) {
        var zIndex = parseInt($(this).css('zIndex'), 10);
        var highest = getHighestZIndex();
        if (zIndex < highest) $(this).css('zIndex', highest + 1);
        $(this).toggleClass('notransition');
        $(this.card).removeClass('atSpawn');
      },
      stop: function(event, ui) {
        $(this).toggleClass('notransition');
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
