const $btnNavigationOpen = document.getElementById("btn-navigation-open"),
      $navigation = document.getElementById("navigation"),
      $btnNavigationClose = document.getElementById("btn-navigation-close");

function navigationToggle() {
    $navigation.classList.toggle("navigation--active");
}

$btnNavigationOpen.addEventListener("click", navigationToggle);
$btnNavigationClose.addEventListener("click", navigationToggle);