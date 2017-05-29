function getHighestZIndex() {
  var highest = 0;
    console.log("DSJKF");
  $('.card').each(function() {
    var current = parseInt($(this).css('zIndex'), 10);
    highest = Math.max(highest, current);
  })
  return highest;
}
