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