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
      let card = this.closest(".card");
      let id = (card.id).split("_");
      let cleanID = parseInt(id[id.length - 1]);
      delete currentCards[cleanID]
      this.closest('.card').remove();
    });
    header.appendChild(close_button);

    card.appendChild(header);
    document.body.appendChild(card);
  }


  getCardObject(card) {
    let id = (card[0].id).split("_");
    let last = parseInt(id[id.length - 1]);
    let obj = currentCards[last]
    return obj;
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

  toggleFullScreen() {
    if (!$(this.card).hasClass('fullscreen')) { // transtion to fullscreen
      $(this.card).attr('prevStyle', $(this.card)[0].style.cssText);
      $(this.card).addClass('fullscreen').removeAttr('style');
      $(this.card).find('*').each((index, child) => $(child).addClass('fullscreen'));
    } else { // transition back from fullscreen
      $(this.card).removeClass("fullscreen");
      $(this.card)[0].style.cssText = $(this.card).attr('prevStyle');
      $(this.card).removeAttr('prevStyle');
      $(this.card.children).each((index, child) => $(child).removeAttr('style'));
      $(this.card).find('*').each((index, child) => $(child).removeClass('fullscreen'));
    }
  }
}
