import "../../vendor/normalize.css";
import "./Blog.css";

import { infiniteScroll } from "../../theme/infiniteScroll";
import { subscription } from "../../theme/subscription";
import { states } from "../../theme/states";

document.addEventListener("DOMContentLoaded", () => {
    states();
    subscription();
});
