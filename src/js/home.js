import "../styles/vendor/normalize.css";

import "../styles/utilities/u-icons.css";

import "../styles/main-home.css";

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
