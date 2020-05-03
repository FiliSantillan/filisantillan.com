export const subscription = () => {
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
                button.textContent = "Unirse";
                button.setAttribute("disabled", "");
                target.appendChild(pElement);
                observer.disconnect();
            } else {
                button.textContent = "Unirse";
            }
        }
    });

    let config = { attributes: true, childList: false, characterData: false };

    observer.observe(target, config);
};
