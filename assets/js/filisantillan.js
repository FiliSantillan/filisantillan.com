var $buttonShowMenu = document.getElementById('js-openMenu'),
	$buttonHideMenu = document.getElementById('js-closeMenu'),
	$menu = document.getElementById('js-menu'),
	$html = document.querySelector('html'),
	slide = new Hammer($html);

var showMenu = function(){
	$menu.classList.add('menu-active');
};

var hideMenu = function(){
	$menu.classList.remove('menu-active');
};


slide.on('panleft', hideMenu);
slide.on('panright', showMenu);

$buttonShowMenu.addEventListener('click',showMenu);
$buttonHideMenu.addEventListener('click', hideMenu);

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