class Card {
  constructor(type) {
    this.id = this.nextId();
    this.parentStackID;
    this.creation_timestamp = new Date().toString();
    this.interaction_timestamp = this.creation_timestamp;
    // npm module: username, url: https://www.npmjs.com/package/username
    const username = require('username');
    this.creator = username.sync();

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
      let card = this.closest('.card');
      let id = (card.id).split("_");
      let cleanID = parseInt(id[id.length - 1]);
      delete currentCards[cleanID]; // TODO: Card shouldn't be aware of things outside of Card!
      this.closest('.card').remove();
    });
    header.appendChild(close_button);

    var fullscreen_button = document.createElement('button');
    $(fullscreen_button).attr({
      id: "fullscreen_button_" + this.id,
      class: "expand"
    });
    $(fullscreen_button).click(() => this.toggleFullScreen());
    header.appendChild(fullscreen_button);

    card.appendChild(header);
    document.body.appendChild(card);
    this.setDraggable();
    this.setDroppable();
  }

  ipcListeners(){
  }
  /*
  toggleSwipe(value) { //Do we need this double definition of toggleswipe?
    alert("ERROR: Child class extending Card class is missing a reimplement of toggleSwipe() function.");
  }
  */
  getCardObject(card) {
    let id = (card[0].id).split("_");
    let last = parseInt(id[id.length - 1]);
    let obj = currentCards[last]
    return obj;
  }
  toggleSwipe(value) {
    $(this.card.lastElementChild).slick("slickSetOption", "swipe", value, false);
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

  updateMetadata(cardType) {
    let id = "#card_" + this.id + cardType + "_2";
    $(id).html("interaction: " + new Date().toString() + "<br><br>" + this.creator);
    $(id).append("<br><br>created: " + this.creation_timestamp);
  }

  buildMetadata(cardType) {
    let id = "#card_" + this.id + cardType + "_2"; // TODO: needs to adjust to last card
    $(id).attr({class: "card-metadata"});
    $(id).html("interaction: " + this.interaction_timestamp
      + "<br/><br/>creator: " + this.creator
      + "<br/><br/>created: " + this.creation_timestamp);
    $(this.card.lastElementChild).slick("slickGoTo", 0, true);
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window',
      stack: '.card, .stack',
      start: function(event, ui) {
        $(this.card).removeClass('atSpawn');
      },
      drag: (event, ui) => {
        this.interaction_timestamp = new Date().toString();
      }
    });
  }

  setDroppable() {
    let cur = this;
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

  toggleFullScreen() {
    if (!$(this.card).hasClass('fullscreen')) { // transtion to fullscreen
      $(this.card).attr('prevStyle', $(this.card)[0].style.cssText);
      $(this.card).addClass('fullscreen').removeAttr('style');
      $(this.card).find('*').each((index, child) => $(child).addClass('fullscreen'));
      let height = $(this)[0].card.clientHeight;
      let width = $(this)[0].card.clientWidth;
      if (this.type == "codeEditor") // TODO: Card should not be aware of card types that extend from it
        this.toggleAceFullscreen(height, width);
    } else { // transition back from fullscreen
      $(this.card).removeClass("fullscreen");
      $(this.card)[0].style.cssText = $(this.card).attr('prevStyle');
      $(this.card).removeAttr('prevStyle');
      $(this.card.children).each((index, child) => $(child).removeAttr('style'));
      $(this.card).find('*').each((index, child) => $(child).removeClass('fullscreen'));
      if (this.type == "codeEditor") // TODO: Card should not be aware of card types that extend from it
        this.toggleAceFullscreen("250px", "197px");
    }
  }
}
