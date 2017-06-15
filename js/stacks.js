const cardPadding = 25;
const cardWidth = 250;

class Stack {
  // constructor uses ECMA-262 rest parameters and spread syntax
  constructor(...cards) {
    this.id = this.nextId();
    this.cards = [];
    this.state = "collapsed";
    var stack = document.createElement('div');
    $(stack).attr({
        id: "stack_" + this.id,
        class: "stack"
      })
      .css({
        top: $(cards[0]).offset().top - 25,
        left: $(cards[0]).offset().left - 25
      });
    this.stack = stack;

    var close_button = document.createElement('button');
    $(close_button).attr({
      id: "close_button_stack_" + this.id,
      class: "stack_close"
    });
    $(close_button).click(() => this.destructor());
    this.stack.appendChild(close_button);

    document.body.appendChild(stack);
    this.setDraggable();
    this.setDroppable();

    cards.forEach(card => this.addCard(card));
    this.cascadeCards();
    this.resizeStack();

    var annotation = document.createElement('textarea');
    $(annotation).attr({
        id: "annotation_stack_" + this.id,
        class: "annotation"
      })
      .on('change keyup paste', () => this.checkScroll());
    this.annotation = annotation;
    let expansion_button = document.createElement("button");
    this.stack.append(expansion_button)
    $(expansion_button).attr({
      id: "expand_button" + this.id,
      class: "expand_button"
    }).css({
      left: parseInt(this.stack.style.width) - 30,
      top: parseInt(this.stack.style.height) - 20
    }).click(() => this.toggleExpansion());
    this.stack.appendChild(annotation);
  }



  destructor() {
    this.cards.forEach(card => this.removeCard($(card.card)));
    $(this.stack).remove();
  }

  toggleExpansion() {
    let padding = 25;
    let stackPos = $(this.stack).offset(); // to keep under 80 LOC
    let windowDiff = window.innerWidth - stackPos.left;
    let expandWidth = ($(this.stack).width() + padding) * (this.cards.length);
    if (this.state == "collapsed") {
      if (stackPos.left + $(this.stack).width() + cardWidth >= window.innerWidth) {
        alert("Can't expand at all");
        return;
      }
      $(this.stack).width(expandWidth);
      this.cards.forEach((ele, idx) => {
        $(ele.card).css({
          top: stackPos.top + padding,
          left: stackPos.left + ((cardWidth * idx) + cardPadding)
        });
      });

      //this.state = "expanded"

    } else {

    }
  }

  // add individual card to the top of the stack
  addCard(card) {
    let cur = this.getCardObject(card);
    var ids = jQuery.map(this.cards, function(stackCard) {
      return parseInt(stackCard.card.id.split("_")[1]);
    });
    var new_id = parseInt($(card).attr('id').split("_")[1]);
    if (jQuery.inArray(new_id, ids) !== -1) return; // card already in stack
    this.cards.push(cur);
    this.stack.appendChild(cur.card);
    if (cur.type == "sketch")
      this.disableSketchCards(cur);
    card.droppable('disable');
    $(card).find('.card-header').find('button').each((index, button) => {
      $(button).attr('disabled', true);
    });
  }

  disableSketchCards(cur) {
    for (let i in cur.sketches)
      cur.sketches[i].editing(false);
  }

  enableSketchCards(cur) {
    for (let i in cur.sketches)
      cur.sketches[i].editing(true);
  }

  getCardObject(card) {
    let id = (card[0].id).split("_");
    let last = parseInt(id[id.length - 1]);
    let obj = currentCards[last]
    return obj;
  }

  // remove individual card from the stack
  removeCard(card) {
    let id = (card[0].id).split("_");
    let cleanID = parseInt(id[id.length - 1]);
    this.cards.forEach((card, idx) => {
      if (card.id == cleanID && card.type == "sketch")
        this.enableSketchCards(card)
    });
    // grep returning only cards that do not contain the target id
    this.cards = $.grep(this.cards, function(n) {
      return $(n.card).attr("id") !== card.attr('id');
    });
    $(card).css({
      top: $(card).offset().top,
      left: $(card).offset().left
    }).droppable('enable');
    document.body.appendChild($(card)[0]);
    $(card).find('.card-header').find('button').each((index, button) => {
      $(button).attr('disabled', false);
    });
  }

  nextId() {
    var ids = $.map($('.stack'), function(stack) {
      return parseInt($(stack).attr('id').split("_")[1]);
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
      stop: () => this.cards.forEach((e, i) => e.toggleSwipe(true))
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
      }
    });
  }

  // position all stacked cards according to their index within the stack
  cascadeCards() {
    this.cards.forEach((cards, index) => {
      $(cards.card).css({
        top: $(this.stack).offset().top + ((index + 1) * 25) + 'px',
        left: $(this.stack).offset().left + ((index + 1) * 25) + 'px',
        'z-index': (index + 1)
      });
    });
  }

  // resize the size of the containing stack div to contain all stacked cards
  resizeStack() {
    var top_card = $(this.cards[this.cards.length - 1].card);
    var bottom_card = $(this.cards[0].card);
    var boundary_top = bottom_card.offset().top;
    var boundary_right = top_card.offset().left + top_card.width() + 50;
    var boundary_bottom = top_card.offset().top + top_card.height() + 70;
    var boundary_left = bottom_card.offset().left;

    $(this.stack).css({
      width: boundary_right - boundary_left,
      height: boundary_bottom - boundary_top
    });
    $("#expand_button" + this.id).css({
      left: parseInt(this.stack.style.width) - 30,
      top: parseInt(this.stack.style.height) - 20
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
  checkScroll() {
    var annot = this.annotation;
    if ($(annot).prop('scrollHeight') > annot.offsetHeight) {
      while ($(this.annotation).prop('scrollHeight') > annot.offsetHeight) {
        annot.value = annot.value.substr(0, annot.value.length - 1);
      }
    }
  }
}
