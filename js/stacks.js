class Stack {
    // constructor uses ECMA-262 rest parameters and spread syntax
    constructor(...cards) {
        this.cards = [];
        this.cardObjects = {};

        var stack = document.createElement('div');
        $(stack).attr({
                id: "stack_" + (++stackCounter),
                class: "stack"
            })
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

        var annotation = document.createElement('textarea');
        $(annotation).attr({
                class: "annotation"
            })
            .on('change keyup paste', () => this.checkScroll());
        this.annotation = annotation;
        this.stack.appendChild(annotation);

    }

    destructor() {
        this.cards.forEach(card => this.removeCard(card));
        $(this.stack).remove();
    }


    // add individual card to the top of the stack
    addCard(card) {
        let cur = this.getCardObject(card);
        this.cardObjects[cur.id] = cur;
        this.cards.push(card);
        this.stack.appendChild($(card)[0]);
        if (cur.type == "sketch")
            this.disableSketchCards(cur);
        card.droppable('disable');
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
        let cardObject = this.cardObjects[cleanID];
        delete this.cardObjects[cleanID]
        console.log(cardObject, this.cardObjects);
        this.enableSketchCards(cardObject)
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
                    if ($(card).hasClass('card')) {
                        $(card).css({
                            top: $(this.stack).offset().top + ((index + 1) * 25),
                            left: $(this.stack).offset().left + ((index + 1) * 25)
                        });
                    }
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
        var boundary_bottom = top_card.offset().top + top_card.height() + 70;
        var boundary_left = bottom_card.offset().left;

        $(this.stack).css({
            width: boundary_right - boundary_left,
            height: boundary_bottom - boundary_top
        });
    }

    //keep characters contained within textarea container
    checkScroll() {
        if ($(this.annotation).prop('scrollHeight') > this.annotation.offsetHeight) {
            while ($(this.annotation).prop('scrollHeight') > this.annotation.offsetHeight) {
                this.annotation.value = this.annotation.value.substr(0, this.annotation.value.length - 1);
            }
        }
    }
}
