function Card(id) {
  this.id = id;
  var div = document.createElement('div');
  div.setAttribute("class", "card");
  div.setAttribute("id", this.id);

/*
TODO:
      - Stack & snap windows in an area
*/
  var header = document.createElement('div');
  header.setAttribute("class", "card card-header");
  header.innerHTML = "id:" + this.id;

  var close_button = document.createElement('button');
  close_button.setAttribute("class", "close");
  close_button.setAttribute("value", "x");
  close_button.innerHTML = "x";
  close_button.onclick = function() {
    $("#" + id).remove(); // remove first element with 'id' tag
  };

  var editor = document.createElement('textarea');
  editor.setAttribute("class", "editor");
  editor.name = "code_editor";
  editor.maxLength = "5000";
  editor.cols = "25";
  editor.rows = "30";

  header.appendChild(close_button);
  div.appendChild(header);
  div.appendChild(editor);
  document.body.appendChild(div);
  $(".card").draggable({
    handle: ".card-header"
  });
}
