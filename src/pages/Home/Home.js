import "../../vendor/normalize.css";
import "./Home.css";

import { subscription } from "../../theme/subscription";
import { shortenText } from "../../theme/shortenText";
import { states } from "../../theme/states";

document.addEventListener("DOMContentLoaded", () => {
    const titleElements = document.querySelectorAll(".post-card-bit__title");

    titleElements.forEach(titleElement => {
        shortenText(titleElement, 25);
    });

    states();
    subscription();
});
