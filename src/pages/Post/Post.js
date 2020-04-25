import "../../vendor/normalize.css";
import "../../vendor/prism.css";
import "./Post.css";

import "../../vendor/prism";

/* Javascript */

document.addEventListener("DOMContentLoaded", () => {
    const codeElementList = document.querySelectorAll("pre[class*='language']");

    for (let codeElement of codeElementList) {
        const languageText = codeElement.className
            .replace("language-", "")
            .trim();

        const brotherElement = codeElement.previousSibling,
            divContainer = document.createElement("div"),
            divLanguage = document.createElement("div"),
            strongLanguage = document.createElement("strong");

        strongLanguage.textContent = languageText;

        divContainer.classList.add("code-container");
        divLanguage.classList.add("code-container__language");
        strongLanguage.classList.add("lcode-container__text");

        divLanguage.appendChild(strongLanguage);
        divContainer.appendChild(divLanguage);
        divContainer.appendChild(codeElement);
        brotherElement.insertAdjacentElement("afterend", divContainer);
    }
});
