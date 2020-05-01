import "../../vendor/normalize.css";
import "./Home.css";

import "ghost-finder";

/* Javascript */

const target = document.getElementById("subcription-form");

let observer = new MutationObserver(mutations => {
    let mutation = mutations[0];

    if (mutation.attributeName === "class") {
        const state = mutation.target.classList[1];
        const button = document.getElementById("subscription-button");
        let pElement = document.createElement("p");
        pElement.classList.add("subscription__sucess");
        pElement.textContent =
            "Tu subscripción esta casi completa, por favor revisa tu correo para finalizar.";

        if (state === "loading") {
            button.textContent = "Cargando";
        } else if (state === "success") {
            button.textContent = "Ser parte";
            button.setAttribute("disabled", "");
            target.appendChild(pElement);
            observer.disconnect();
        } else {
            button.textContent = "Ser parte";
        }
    }
});

let config = {
    attributes: true,
    childList: false,
    characterData: false,
};

observer.observe(target, config);

const iconSearch = document.getElementById("icon-search");
const iconClose = document.getElementById("icon-close");
const searchContainer = document.getElementById("search-container");

iconSearch.addEventListener("click", event => {
    event.preventDefault();
    searchContainer.classList.add("isActive");

    iconClose.addEventListener("click", event => {
        event.preventDefault();
        searchContainer.classList.remove("isActive");
    });
});

const iconMenu = document.getElementById("icon-menu");
const subMenu = document.getElementById("navigation-submenu");
const iconArrow = document.getElementById("icon-arrow");

let state = false;

iconMenu.addEventListener("click", event => {
    event.preventDefault();

    if (!state) {
        subMenu.classList.add("isActive");
        iconArrow.classList.remove("icon-arrow-up");
        iconArrow.classList.add("icon-arrow-down");
        state = true;
    } else {
        subMenu.classList.remove("isActive");
        iconArrow.classList.remove("icon-arrow-down");
        iconArrow.classList.add("icon-arrow-up");
        state = false;
    }
});

new GhostFinder({
    input: "#search-input",
    showResult: "#search-result",
    resultTemplate: "<ul class='search-results-wrapper'>##results</ul>",
    contentApiKey: "e08066d77dbdb6606d68c93656",
});
