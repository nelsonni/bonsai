class Card {
  constructor(type, fileData) {
    this.id = this.nextId();
    this.parentStackID;
    this.inStack = false;
    this.channels = [];
    this.carousel;
    fileData = this.objectCleaner(fileData)

    // For book keeping saving files
    this.name = "";
    this.fileExt = fileData.ext;
    this.location = fileData.path

    this.creation_timestamp = new Date().toString();
    this.interaction_timestamp = this.creation_timestamp;

    // npm module: username, url: https://www.npmjs.com/package/username
    const username = require('username');
    this.creator = username.sync();

    this.cardBuilder(type, fileData)
    this.setDraggable();
    this.setDroppable();
    this.ipcListeners();
    this.arrowListeners();
    ipcRenderer.on("saveComplete", () => $('body').removeClass('waiting'));
  }

  saveCard() {
    let curIdx = $(this.carousel).slick("slickCurrentSlide")
    if (this.name.split(" ")[0] == "Card:")
      dialog.showSaveDialog((filePath) => {
        this.location = filePath
        this.name = filePath.split("/")[filePath.split("/").length - 1]
        this.sendSave(curIdx)
        $(this.card).find(".nameBox").html(this.name)
      })
    else
      this.sendSave(curIdx)
  } // sendSave is written by children

  objectCleaner(fileData) {
    for (var key in fileData) {
      if (fileData[key] == undefined)
        fileData[key] = ""
    }
    return fileData
  }

  cardBuilder(type, fileData) {
    var card = document.createElement('div');
    $(card).attr({
      id: 'card_' + this.id,
      type: type,
      class: 'card',
    });
    this.card = card;
    let cur = this;

    var header = document.createElement('div');
    $(header).attr({
      id: 'header_' + this.id,
      class: 'card-header',
    });

    let nameBox = document.createElement("span")
    $(nameBox).addClass("nameBox")
    if (fileData.name != undefined) {
      $(nameBox).html(fileData.name);
      this.name = fileData.name
    } else {
      $(nameBox).html("Card: " + this.id);
      this.name = "Card: " + this.id;
    }

    $(header).append(nameBox)

    var closeButton = document.createElement('button');
    $(closeButton).attr({
      id: 'close_button_' + this.id,
      class: 'close',
    });
    $(closeButton).click(function() {
      let card = this.closest('.card');
      let id = (card.id).split('_');
      let cleanID = parseInt(id[id.length - 1]);
      delete canvas.currentCards[cleanID];
      cur.destructor();
      this.closest('.card').remove();
    });
    let save = document.createElement("button")
    $(save).html("save!")
    $(save).click(() => this.saveCard())
    header.appendChild(closeButton);
    header.appendChild(save);



    var fullscreenButton = document.createElement('button');
    $(fullscreenButton).attr({
      id: 'fullscreen_button_' + this.id,
      class: 'expand',
    });
    $(fullscreenButton).click(() => this.toggleFullScreen());
    header.appendChild(fullscreenButton);
    card.appendChild(header);
    document.body.appendChild(card);
  }

  destructor() {
    this.channels.forEach(ele => __IPC.ipcRenderer.removeAllListeners(ele));
  }

  ipcListeners() {} // to be rewritten by child classes
  sendSave() {}

  getCardObject(card) {
    let id = (card[0].id).split('_');
    let last = parseInt(id[id.length - 1]);
    let obj = cavnas.currentCards[last];
    return obj;
  }

  toggleSwipe(value) {
    $(this.card.lastElementChild).slick('slickSetOption', 'swipe', value, false);
  }

  nextId() {
    var ids = $.map($('.card'), (card) => {
      return parseInt($(card).attr('id').split('_')[1]);
    });
    if (ids.length < 1) return 1; // no cards on the canvas yet

    var next = 1;
    while (ids.indexOf(next += 1) > -1);
    return next;
  }

  updateMetadata(cardType) {
    let id = '#card_' + this.id + cardType + '_2';
    $(id).html('interaction: ' + new Date().toString() + '<br><br>' + this.creator);
    $(id).append('<br><br>created: ' + this.creation_timestamp);
  }

  buildMetadata(cardType) {
    let id = '#card_' + this.id + cardType + '_2'; // TODO: needs to adjust to last card
    $(id).attr({
      class: 'card-metadata',
    });
    $(id).html('interaction: ' + this.interaction_timestamp +
      '<br/><br/>creator: ' + this.creator +
      '<br/><br/>created: ' + this.creation_timestamp);
    $(this.card.lastElementChild).slick('slickGoTo', 0, true);
  }

  setDraggable() {
    $(this.card).draggable({
      handle: '.card-header',
      containment: 'window',
      stack: '.card, .stack',
      start: (event, ui) => {
        $(this.card).removeClass('highlight');
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
        'ui-droppable-hover': 'highlight',
      },
      drop: function(event, ui) {
        let curParent = $(ui.draggable).parent()
        if ($(curParent).hasClass("stack") || $(ui.draggable).hasClass('stack')) {
          let curID = curParent[0].id || ui.draggable[0].id
          canvas.currentStacks[curID].addCard($($(this)));
          canvas.currentStacks[curID].addToBack();
          canvas.currentStacks[curID].cascadeCards();
          canvas.currentStacks[curID].resizeStack();
          return
        } // handle stacked cards 

        // handle card-to-card drop event
        if ($(ui.draggable).hasClass('card')) {
          new Stack($(this), $(ui.draggable));
        }
      },
    });
  }

  arrowListeners() {
    $(this.card).mouseenter(() => {
      if (this.inStack == false) {
        $(this.card.lastElementChild).find('.slick-arrow').show();
        $(this.card.lastElementChild).find('.slick-dots').show();
      }
    });
    $(this.card).mouseout(() => setTimeout(() => {
      if (!$(this.card.lastElementChild).is(':hover') &&
        !$(document.activeElement).hasClass('ace_text-input') ||
        this.inStack == true) { //if not hovering on arrow
        $(this.card.lastElementChild).find('.slick-arrow').hide();
        $(this.card.lastElementChild).find('.slick-dots').hide();
      }
    }, 600));
  }

  toggleFullScreen() {
    if (!$(this.card).hasClass('fullscreen')) { // transition to fullscreen
      $(this.card).attr('prevStyle', $(this.card)[0].style.cssText);
      $(this.card).addClass('fullscreen').removeAttr('style');
      let height = $(this)[0].card.clientHeight;
      let width = $(this)[0].card.clientWidth;
      __IPC.ipcRenderer.send('card' + this.id + '_toggle_fullscreen', [height, width]);
      this.channels.push('card' + this.id + '_toggle_fullscreen');
    } else { // transition back from fullscreen
      $(this.card).removeClass('fullscreen');
      $(this.card)[0].style.cssText = $(this.card).attr('prevStyle');
      $(this.card).removeAttr('prevStyle');
      $(this.card.children).each((index, child) => $(child).removeAttr('style'));
      $(this.card).find('*').each((index, child) => $(child).removeClass('fullscreen'));
      __IPC.ipcRenderer.send('card' + this.id + '_toggle_fullscreen', [250, 200]);
    }
  }
}