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

// note the div is preserved
img.parentNode === div; // true

img.src;        // https://twemoji.maxcdn.com/36x36/2764.png
img.alt;        // \u2764\uFE0F
img.className;  // emoji
img.draggable;  // false