var $buttonShowMenu = document.getElementById('js-iconMenu'),
	$menu = document.getElementById('js-menu'),
	$html = document.querySelector('html')

var $buttonShowSubList = document.getElementById('js-item');
var $subList = document.getElementById('js-subList')

var slide = new Hammer($html);

var showMenu = function(){
	$menu.classList.add('menuBar-active');
};

var hideMenu = function(){
	$menu.classList.remove('menuBar-active');
};

var showSubList = function(){
	$subList.classList.add('subList-active');
}

slide.on('panleft', hideMenu);
slide.on('panright', showMenu);
$buttonShowMenu.addEventListener('click',showMenu);

$buttonShowSubList.addEventListener('click',showSubList);