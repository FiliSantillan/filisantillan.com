import "../styles/vendor/normalize.css";

import "../styles/utilities/u-icons.css";

import "../styles/main-home.css";

// Hacer función para que tome los datos de data-icon: icon-star y ese sea el que tome.

import searchIcon from "../../src/images/icons/search.svg";
import menuIcon from "../../src/images/icons/menu.svg"
import starIcon from "../../src/images/icons/star-filled.svg";

const searchImg = document.querySelector("#icon-search");
const settingsImg = document.querySelector("#icon-settings");
const menuImg = document.querySelector("#icon-menu");
const starImg = document.querySelector("#icon-star");

searchImg.src = searchIcon;
settingsImg.src = menuIcon;
menuImg.src = menuIcon;
starImg.src = starIcon;

/* Javascript */

// import lazyImages from "./app/lazy-images";

import "./app/navigation";


const $featurePost = document.getElementById("feature-post");

const docElement = document.documentElement;
const spacerSize = getComputedStyle(docElement).getPropertyValue(
  "--spacer-size"
);

const spacerFeaturePost =
  $featurePost.offsetHeight - parseFloat(spacerSize) * 16 * 4;

docElement.style.setProperty("--spacer-feature-post", `${spacerFeaturePost}px`);

function reportWindowSize() {
  const spacerFeaturePost =
    $featurePost.offsetHeight - parseFloat(spacerSize) * 16 * 4;

  docElement.style.setProperty(
    "--spacer-feature-post",
    `${spacerFeaturePost}px`
  );
}

window.onresize = reportWindowSize;
