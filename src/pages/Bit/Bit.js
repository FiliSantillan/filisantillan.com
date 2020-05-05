import "../../vendor/normalize.css";
import "./Bit.css";

/* Javascript */

import { infiniteScroll } from "../../theme/infiniteScroll";
import { subscription } from "../../theme/subscription";
import { states } from "../../theme/states";

document.addEventListener("DOMContentLoaded", () => {
    states();
    subscription();
});
