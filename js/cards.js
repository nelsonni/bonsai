class Card {
  constructor(id, type) {
    this.id = id;

    var card = document.createElement('div');
    $(card).attr({
      id: id,
      type: type,
      class: "card",
      fullscreen: false
    });
    this.card = card;

    var header = document.createElement('div');
    $(header).attr({
      id: "header_" + id,
      class: "card-header"
    }).html("card: " + id);

    var close_button = document.createElement("button");
    $(close_button).attr({
      id: "close_button_" + id,
      class: "close"
    }).click(function() { // arrow function cannot be used here; bind required
      this.closest('.card').remove(); // 'this' refers to Card class instance
    });
    header.appendChild(close_button);

    var fullscreen_button = document.createElement("button");
    $(fullscreen_button).attr({
      id: "fullscreen_button_" + id,
      class: "expand"
    }).click(() => this.toggleFullScreen());
    header.appendChild(fullscreen_button);

    var flip_button = document.createElement("button");
    $(flip_button).attr({
      id: "flip_button_" + id,
      class: "flip"
    }).click(() => this.toggleCardFlip());
    card.appendChild(flip_button);

    card.appendChild(header);
    document.body.appendChild(card);
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
          $(this).animate({top: 0, left: 0, width: "100%",
            height: "100%"}, 0.10);
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

  toggleCardFlip() {
    console.log("toggleCardFlip");
  }
}
