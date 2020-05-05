const $buttonOpen = document.getElementById("btn-open"),
  $buttonClose = document.getElementById("btn-close"),
  $wrapper = document.getElementById("menu-wrapper"),
  $menu = document.getElementById("menu");

function navigationToggle() {
  $wrapper.classList.toggle("active");
  $menu.classList.toggle("active");
}

$buttonOpen.addEventListener("click", navigationToggle);
$buttonClose.addEventListener("click", navigationToggle);
