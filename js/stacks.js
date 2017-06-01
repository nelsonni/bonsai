class Stack {
  // constructor uses ECMA-262 rest parameters and spread syntax
  constructor(...cards) {
    this.cards = [];

    var stack = document.createElement('div');
    $(stack).attr({id: "stack_" + (++stackCounter), class: "stack"})
      .css({
        top: $(cards[0]).offset().top - 25,
        left: $(cards[0]).offset().left - 25
      });
    this.stack = stack;
    document.body.appendChild(stack);
    this.setDraggable();
    this.setDroppable();

    cards.forEach(card => this.addCard(card));
    this.cascadeCards();
    this.resizeStack();
  }

  destructor() {
    this.cards.forEach(card => this.removeCard(card));
    $(this.stack).remove();
  }

  // add individual card to the top of the stack
  addCard(card) {
    this.cards.push(card);
    this.stack.appendChild($(card)[0]);
    card.droppable('disable');
  }

  // remove individual card from the stack
  removeCard(card) {
    // grep returning only cards that do not contain the target id
    this.cards = $.grep(this.cards, function(n) {
      return n.attr('id') !== card.attr('id');
    });
    $(card).css({
      top: $(card).offset().top,
      left: $(card).offset().left
    }).droppable('enable');
    document.body.appendChild($(card)[0]);
  }

  setDraggable() {
    $(this.stack).draggable({
      containment: 'window',
      stack: '.stack, .card',
      drag: (event, ui) => {
        $(this.stack.children).each((index, card) => {
          $(card).css({
            top: $(this.stack).offset().top + ((index + 1) * 25),
            left: $(this.stack).offset().left + ((index + 1) * 25)
          })
        });
      }
    });
  }

  setDroppable() {
    $(this.stack).droppable({
      accept: '.card, .stack',
      classes: {
        'ui-droppable-hover': 'highlight'
      },
      drop: (event, ui) => {
        // handle card-to-stack drop event
        if ($(ui.draggable).hasClass('card')) {
          this.addCard($(ui.draggable));
          this.cascadeCards();
          this.resizeStack();
        }
        // handle stack-to-stack drop event
        if ($(ui.draggable).hasClass('stack')) {
          ui.draggable.children().each((index, card) => {
            this.addCard($(card));
          });
          this.cascadeCards();
          this.resizeStack();
          $(ui.draggable).remove();
        }
      },
      out: (event, ui) => {
        this.removeCard($(ui.draggable));

        if (this.cards.length < 2) {
          this.destructor();
          return;
        };

        this.cascadeCards();
        this.resizeStack();
      }
    });
  }

  // position all stacked cards according to their index within the stack
  cascadeCards() {
    this.cards.forEach((card, index) => {
      $(card).css({
        top: $(this.stack).offset().top + ((index + 1) * 25) + 'px',
        left: $(this.stack).offset().left + ((index + 1) * 25) + 'px',
        'z-index': (index + 1)
      });
    });
  }

  // resize the size of the containing stack div to contain all stacked cards
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
