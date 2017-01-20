$('#open-menu').click(function() {
  $('#menu').addClass('menu-active');
});

$('#close-menu').click(function() {
  $('#menu').removeClass('menu-active');
});

var div = document.createElement('div');
document.body.appendChild(div);
twemoji.parse(document.body);
var img = div.querySelector('img');
