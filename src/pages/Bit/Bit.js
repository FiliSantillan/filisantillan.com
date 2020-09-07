import "../../vendor/normalize.css";
import "./Bit.css";

/* Javascript */

import { infiniteScroll } from "../../theme/infiniteScroll";
import { shortenText } from "../../theme/shortenText";
import { subscription } from "../../theme/subscription";
import { states } from "../../theme/states";

document.addEventListener("DOMContentLoaded", () => {
    const titleElements = document.querySelectorAll(".post-card-bit__title");

    titleElements.forEach(titleElement => {
        shortenText(titleElement, 25);
    });

    states();
    subscription();
});
