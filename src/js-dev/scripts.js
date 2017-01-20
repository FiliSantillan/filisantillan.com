$('#open-menu').click(function() {
  $('#menu').addClass('menu-active');
});

$('#close-menu').click(function() {
  $('#menu').removeClass('menu-active');
});

var div = document.createElement('div');
div.textContent = 'I \u2764\uFE0F emoji!';
document.body.appendChild(div);

twemoji.parse(document.body);

var img = div.querySelector('img');

// note the div is preserved
img.parentNode === div; // true

img.src;        // https://twemoji.maxcdn.com/36x36/2764.png
img.alt;        // \u2764\uFE0F
img.className;  // emoji
img.draggable;  // false
disqus = function (newIdentifier, newUrl, newTitle) {
    if ($('#disqus_thread').length) {
        if (typeof DISQUS === 'undefined') {

            var disqus_shortname = 'filisantillan';
            var disqus_identifier = newIdentifier;
            var disqus_url = newUrl;
            var disqus_title = newTitle;

            (function() {
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
        } else {
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = newIdentifier;
                    this.page.url = newUrl;
                    this.page.title = newTitle;
                }
            });
        }
    }
};

disqus(window.location.href, window.location.href, $('#post-text').text());