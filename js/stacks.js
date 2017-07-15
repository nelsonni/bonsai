const CARD_PADDING = 35;
const CARD_WIDTH = 250;
const TOTAL_SIZE = CARD_WIDTH + CARD_PADDING;
const OFFSET_LEFT = 35;
const OFFSET_TOP = 15;

class Stack {
  // constructor uses ECMA-262 rest parameters and spread syntax
  constructor(...cards) {
    this.id = this.nextId();
    this.cards = [];
    this.channels = [];
    this.state = 'collapsed';
    var stack = document.createElement('div');
    $(stack).attr({
        id: 'stack_' + this.id,
        class: 'stack',
      })
      .css({
        top: $(cards[0]).offset().top - 25,
        left: $(cards[0]).offset().left - 25,
      });
    this.stack = stack;

    var closeButton = document.createElement('button');
    $(closeButton).attr({
      id: 'close_button_stack_' + this.id,
      class: 'stack_close',
    });
    $(closeButton).click(() => this.destructor());
    this.stack.appendChild(closeButton);

    document.body.appendChild(stack);
    this.setDraggable();
    this.setDroppable();

    cards.forEach(card => this.addCard(card));
    this.cascadeCards();
    this.resizeStack();

    var annotation = document.createElement('textarea');
    $(annotation).attr({
        id: 'annotation_stack_' + this.id,
        class: 'annotation',
      })
      .on('change keyup paste', () => this.checkScroll());
    this.annotation = annotation;
    this.stack.appendChild(annotation);

    let expansionButton = document.createElement('button');
    $(expansionButton).attr({
      id: 'expand_button' + this.id,
      class: 'expand_button',
    }).click(() => this.toggleExpansion());
    this.stack.append(expansionButton);
    currentStacks["stack_" + this.id] = this
  }

  destructor() {
    this.cards.forEach(card => this.removeCard($(card.card)));
    this.channels.forEach(channel => __IPC.ipcRenderer.removeAllListeners(channel));
    delete currentStacks[this.id]
    $(this.stack).remove();
  }

  moveCards(stackPos, windowDiff) {
    let cardCount = parseInt((windowDiff - TOTAL_SIZE) / TOTAL_SIZE);
    let last = this.cards.length;
    let lastFit = this.cards[this.cards.length - 1 - cardCount]; //last card in stack
    if (this.cards.length - 1 - cardCount < 0)
      lastFit = this.cards[0], cardCount = 1; // if fittable cards > cur cards
    while (cardCount > 0) {
      $(this.cards[last - 1].card).css({
        top: $(lastFit.card).offset().top,
        left: $(lastFit.card).offset().left + TOTAL_SIZE * (cardCount),
      }); // move last card to last fitting pos. & fill backwards
      cardCount--;
      last--;
    };
  }

  toggleExpansion() { // add animations at a later date?
    let stackPos = $(this.stack).offset(); // to keep under 80 char
    let windowDiff = window.innerWidth - stackPos.left;
    if (this.state == 'collapsed') {
      if (stackPos.left + $(this.stack).width() + TOTAL_SIZE >= window.innerWidth) {
        alert("Can't expand at all");
        return;
      }

      $(this.stack).draggable('disable');
      this.moveCards(stackPos, windowDiff);
      let newWidth = $(this.cards[this.cards.length - 1].card).offset().left;
      $(this.stack).width(newWidth - stackPos.left + CARD_WIDTH + OFFSET_TOP);
      this.state = 'expanded';
    } else {
      $(this.stack).draggable('enable');
      this.state = 'collapsed';
      this.cascadeCards();
      this.resizeStack();
    }
  }

  // add individual card to the top of the stack
  addCard(card) {
    let cur = this.getCardObject(card);
    cur.inStack = true;
    cur.parentStackID = this.id;
    cur.ipcListeners();
    var ids = jQuery.map(this.cards, function(stackCard) {
      return parseInt(stackCard.card.id.split('_')[1]);
    });

    var newId = parseInt($(card).attr('id').split('_')[1]);
    if (jQuery.inArray(newId, ids) !== -1) return; // card already in stack
    this.cards.push(cur);
    this.stack.appendChild(cur.card);
    __IPC.ipcRenderer.send('card' + cur.id + '_toggle_sketches' + this.id, false);
    this.channels.push('card' + cur.id + '_toggle_sketches' + this.id);

    card.droppable('disable');
    $(card).find('.card-header').find('button').each((index, button) => {
      $(button).attr('disabled', true);
    });
  }

  getCardObject(card) {
    let id = (card[0].id).split('_');
    let last = parseInt(id[id.length - 1]);
    let obj = currentCards[last];
    return obj;
  }

  // remove individual card from the stack
  removeCard(card) {
    let cleanID = card[0].id.split('_')[1];
    currentCards[cleanID].inStack = false;
    __IPC.ipcRenderer.send('card' + cleanID + '_toggle_sketches' + this.id, true);

    // grep returning only cards that do not contain the target id
    this.cards = $.grep(this.cards, function(n) {
      return $(n.card).attr('id') !== card.attr('id');
    });

    $(card).css({
      top: $(card).offset().top,
      left: $(card).offset().left,
    }).droppable('enable');
    document.body.appendChild($(card)[0]);
    $(card).find('.card-header').find('button').each((index, button) => {
      $(button).attr('disabled', false);
    });
  }

  nextId() {
    var ids = $.map($('.stack'), function(stack) {
      return parseInt($(stack).attr('id').split('_')[1]);
    });

    if (ids.length < 1) return 1; // no stacks on the canvas yet
    var next = 1;
    while (ids.indexOf(next += 1) > -1);
    return next;
  }

  setDraggable() {
    $(this.stack).draggable({
      containment: 'window',
      stack: '.stack, .card',
      drag: (event, ui) => this.cascadeCards(),
      start: () => this.cards.forEach((e, i) => e.toggleSwipe(false)),
      stop: () => this.cards.forEach((e, i) => e.toggleSwipe(true)),
    }); // change start / stop to IPC stuff
  }

  setDroppable() {
    $(this.stack).droppable({
      accept: '.card, .stack',
      classes: {
        'ui-droppable-hover': 'highlight',
      },
      drop: (event, ui) => {
        // handle card-to-stack drop event
        if ($(ui.draggable).hasClass('card')) {
          console.log(this);
          this.addCard($(ui.draggable));
          this.cascadeCards();
          this.resizeStack();
        }

        // handle stack-to-stack drop event
        if ($(ui.draggable).hasClass('stack')) {
          $(ui.draggable).children('.card').each((index, card) => {
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
      },
    });
  }

  addToBack(cur) {
    let last = this.cards.pop()
    this.cards.unshift(last)
  } // takes last card added and moves it to the back of the stack

  // position all stacked cards according to their index within the stack
  cascadeCards() {
    this.cards.forEach((cards, index) => {
      $(cards.card).css({
        top: $(this.stack).offset().top + ((index + 1) * 25) + 'px',
        left: $(this.stack).offset().left + ((index + 1) * 25) + 'px',
        'z-index': (index + 1),
      });
    });
  }

  // resize the size of the containing stack div to contain all stacked cards
  resizeStack() {
    var $topCard = $(this.cards[this.cards.length - 1].card);
    var $bottomCard = $(this.cards[0].card);
    var $boundaryTop = $bottomCard.offset().top;
    var $boundaryRight = $topCard.offset().left + $topCard.width() + 50;
    var $boundaryBottom = $topCard.offset().top + $topCard.height() + 70;
    var $boundaryLeft = $bottomCard.offset().left;

    $(this.stack).css({
      width: $boundaryRight - $boundaryLeft,
      height: $boundaryBottom - $boundaryTop,
    });
  }

  // keep all characters visible within annotation textarea
  checkScroll() {
    var annot = this.annotation;
    if ($(annot).prop('scrollHeight') > annot.offsetHeight) {
      while ($(this.annotation).prop('scrollHeight') > annot.offsetHeight) {
        annot.value = annot.value.substr(0, annot.value.length - 1);
      }
    }
  }
}