class Stack {
  // constructor uses ECMA-262 rest parameters and spread syntax
  constructor(...cards) {
    this.cards = cards;

    var stack = document.createElement('div');
    $(stack).attr({id: "stack_" + (++stackCounter), class: "stack"})
      .css({
        top: $(cards[0]).offset().top - 25,
        left: $(cards[0]).offset().left - 25
      });
    this.stack = stack;
    document.body.appendChild(stack);
    this.orderCards();
    this.resizeStack();
    this.setDraggable();
    this.setDroppable();
  }

  setDraggable() {
    $(this.stack).draggable({
      containment: 'window',
      start: $.proxy(function(event, ui) {
        $(this.stack).removeClass('atSpawn');
        console.log("cards: " + this.cards.length);
      }, this)
    });
  }

  setDroppable() {
    $(this.stack).droppable({
      accept: '.card',
      classes: {
        'ui-droppable-hover': 'highlight'
      },
      drop: (event, ui) => {
        var card = $(ui.draggable);
        this.cards.push(card);
        this.orderCards();
        this.resizeStack();
      },
      out: (event, ui) => {
        var card = $(ui.draggable);

        this.cards = $.grep(this.cards, function(n) {
          return n.attr('id') !== card.attr('id');
        });

        $(card).css({position: 'fixed'});
        $(card).droppable('enable');
        // remove the stack if <2 cards remain

        document.body.appendChild($(card)[0]);

        this.orderCards();
        this.resizeStack();
      }
    });
  }

  orderCards() {
    var self = this;
    $(this.cards).each(function (index) {
      self.stack.appendChild($(this)[0]);
      $(this).css({top: (index + 1) * 25, left: (index + 1) * 25,
        position: 'absolute'});
      $(this).droppable('disable');
    });
  }

  resizeStack() {
    var top_card = this.cards[this.cards.length - 1];
    var bottom_card = this.cards[0];
    var boundary_top = bottom_card.offset().top;
    var boundary_right = top_card.offset().left + top_card.width() + 50;
    var boundary_bottom = top_card.offset().top + top_card.height() + 50;
    var boundary_left = bottom_card.offset().left;

    $(this.stack).css({width: boundary_right - boundary_left,
      height: boundary_bottom - boundary_top});
  }
}
