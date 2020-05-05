import "../../vendor/normalize.css";
import "./Tag.css";

/* Javascript */

import { infiniteScroll } from "../../theme/infiniteScroll";
import { subscription } from "../../theme/subscription";
import { states } from "../../theme/states";

document.addEventListener("DOMContentLoaded", () => {
    states();
    subscription();
});
