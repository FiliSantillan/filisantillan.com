import "../../vendor/normalize.css";
import "../../vendor/prism.css";
import "./singlePage.css";

import "../../vendor/prism";

/* Javascript */

document.addEventListener("DOMContentLoaded", () => {
    // Youtube

    const allVideos = document.querySelectorAll(
        "iframe[src^='https://www.youtube.com/embed/'], iframe[src^='https://player.vimeo.com/video/']"
    );

    for (let video of allVideos) {
        video.parentElement.classList.add("kg-video-card");
    }

    // Names
    const codeElementList = document.querySelectorAll("pre[class*='language']");
    for (let codeElement of codeElementList) {
        const languageText = codeElement.className
            .replace("language-", "")
            .trim();

        const brotherElement = codeElement.previousSibling,
            divContainer = document.createElement("div"),
            divLanguage = document.createElement("div"),
            strongLanguage = document.createElement("strong");

        if (brotherElement.nodeType !== 1) {
            brotherElement = brotherElement.previousSibling;
        }

        strongLanguage.textContent = languageText;

        divContainer.classList.add("code-container");
        divLanguage.classList.add("code-container__language");
        strongLanguage.classList.add("lcode-container__text");

        divLanguage.appendChild(strongLanguage);
        divContainer.appendChild(divLanguage);
        divContainer.appendChild(codeElement);
        brotherElement.insertAdjacentElement("afterend", divContainer);
    }

    const tableOfContents = document.getElementById("table-of-contents");
    const ul = document.createElement("ul");
    const sections = document.getElementsByTagName("h2");

    if (!tableOfContents || !sections) {
        return;
    }

    ul.classList.add("table-of-contents__list", "u-no-list");
    tableOfContents.appendChild(ul);

    for (let title of sections) {
        let titleId = title.id;
        let titleText = title.textContent;
        let a = document.createElement("a");

        ul.innerHTML += `<li class="table-of-contents__item">
                            <a href="#${titleId}" class="table-of-contents__link">${titleText}</a>
                        </li>`;

        title.textContent = "";

        a.href = `#${titleId}`;
        a.textContent = titleText;

        title.appendChild(a);
    }
});

// function findHTMLElement(element) {
//     return new Promise((resolve, rect) => {
//         console.log("ENTRO EN LA PROMESA");
//         if (element.nodeType !== 1) {
//             console.log("ENTRO EN EL PRIMER IF");
//             element = element.previousSibling;

//             if (element.nodeType === 1) {
//                 console.log("ENTRO EN EL SEGUNDO IF");
//                 console.log(element);
//                 resolve(element);
//             } else {
//                 console.log("SE APLICO RECURSIVIDAD");
//                 findHTMLElement(element);
//             }
//         }
//     });
// }

// findHTMLElement(brotherElement).then(value => {
//     console.log(value);
//     console.log("SE APLICO LA PROMESA");
//     strongLanguage.textContent = languageText;

//     divContainer.classList.add("code-container");
//     divLanguage.classList.add("code-container__language");
//     strongLanguage.classList.add("lcode-container__text");

//     divLanguage.appendChild(strongLanguage);
//     divContainer.appendChild(divLanguage);
//     divContainer.appendChild(codeElement);
//     value.insertAdjacentElement("afterend", divContainer);
// });
