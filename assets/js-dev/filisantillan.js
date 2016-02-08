// Menu - Busqueda
var $buttonShowMenu = document.getElementById('js-openMenu'),
    $buttonHideMenu = document.getElementById('js-closeMenu'),
    $menu = document.getElementById('js-menu'),
    $buttonShowSearch = document.getElementById('js-openSearch'),
    $buttonHideSearch = document.getElementById('js-closeSearch'),
    $search = document.getElementById('js-search')

var showMenu = function(){
    $menu.classList.add('menu-active', 'bounceInRight');
};

var hideMenu = function(){
    $menu.classList.remove('menu-active');
};

var showSearch = function(){
    $search.classList.add('search-active');
    $search.classList.add('search-active', 'zoomIn');
};

var hideSearch = function(){
    $search.classList.remove('search-active');
};

$buttonShowMenu.addEventListener('click',showMenu);
$buttonHideMenu.addEventListener('click', hideMenu);

$buttonShowSearch.addEventListener('click',showSearch);
$buttonHideSearch.addEventListener('click', hideSearch);

//Progreso de la lectura de un artículo
$(document).ready(function(){
    
    var getMax = function(){
        return $(document).height() - $(window).height();
    }
    
    var getValue = function(){
        return $(window).scrollTop();
    }
    
    if('max' in document.createElement('progress')){
        // Browser supports progress element
        var progressBar = $('progress');
        
        // Set the Max attr for the first time
        progressBar.attr({ max: getMax() });

        $(document).on('scroll', function(){
            // On scroll only Value attr needs to be calculated
            progressBar.attr({ value: getValue() });
        });
      
        $(window).resize(function(){
            // On resize, both Max/Value attr needs to be calculated
            progressBar.attr({ max: getMax(), value: getValue() });
        });   
    }
    else {
        var progressBar = $('.progress-bar'), 
            max = getMax(), 
            value, width;
        
        var getWidth = function(){
            // Calculate width in percentage
            value = getValue();            
            width = (value/max) * 100;
            width = width + '%';
            return width;
        }
        
        var setWidth = function(){
            progressBar.css({ width: getWidth() });
        }
        
        $(document).on('scroll', setWidth);
        $(window).on('resize', function(){
            // Need to reset the Max attr
            max = getMax();
            setWidth();
        });
    }
});

// Disqus
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

disqus(window.location.href, window.location.href, $('.post-title').text());