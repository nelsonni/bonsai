function getHighestZIndex() {
  var highest = 0;
  $('.card').each(function() {
    var current = parseInt($(this).css('zIndex'), 10);
    highest = Math.max(highest, current);
  })
  return highest;
}
