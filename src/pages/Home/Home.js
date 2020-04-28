import "../../vendor/normalize.css";
import "./Home.css";

import "ghost-finder";

/* Javascript */

new GhostFinder({
    input: "#search-input",
    showResult: "#search-result",
    resultTemplate: "<ul class='search-results-wrapper'>##results</ul>",
    contentApiKey: "e08066d77dbdb6606d68c93656",
});
