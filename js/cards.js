function Card(id) {
  this.id = id;
  var div = document.createElement('div');
  div.setAttribute("class", "draggable-element");
  div.setAttribute("id", id);
  div.innerHTML = "id:" + this.id;
  document.body.appendChild(div);
  $(".draggable-element").draggable();
}
