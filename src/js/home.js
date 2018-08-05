import "../styles/vendor/normalize.css";

import "../styles/utilities/u-icons.css";

import "../styles/main-home.css";

/* Javascript */

import { drawImage } from "./app/drawImage";
import lazyImages from "./app/lazy-images";

import imageMacbook from "../images/macbook.png";
import imageMacbook2x from "../images/macbook@2x.png";
import imageMacbook3x from "../images/macbook@3x.png";

const imageModule = {
  figureClass: "cover__image-wrapper",
  imgClass: "cover__image",
  alt: "Macbook Code",
  src: imageMacbook,
  srcset2x: imageMacbook2x,
  srcset3x: imageMacbook3x
};

drawImage("cover-home", imageModule);

import "./app/navigation";