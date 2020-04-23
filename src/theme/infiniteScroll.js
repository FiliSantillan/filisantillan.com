export const infiniteScroll = (function(window, document) {
    let nextElement = document.querySelector("link[rel=next]");
    if (!nextElement) {
        return;
    }

    const wrapperElement = document.querySelector(".site-main-wrapper");
    if (!wrapperElement) {
        return;
    }

    const buffer = 300;

    let ticking = false;
    let loading = false;

    let lastScrollY = window.scrollY;
    let lastWindowHeight = window.innerHeight;
    let lastDocumentHeight = document.documentElement.scrollHeight;

    function onPageLoad() {
        if (this.status === 404) {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            return;
        }

        let postElements = this.response.querySelectorAll(".post-card");

        postElements.forEach(item => {
            wrapperElement.appendChild(document.importNode(item, true));
        });

        let resNextElement = this.response.querySelector("link[rel=next]");

        if (resNextElement) {
            nextElement.href = resNextElement.href;
        } else {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        }

        lastDocumentHeight = document.documentElement.scrollHeight;

        ticking = false;
        loading = false;
    }

    function onUpdate() {
        if (loading) {
            return;
        }

        if (lastScrollY + lastWindowHeight <= lastDocumentHeight - buffer) {
            ticking = false;
            return;
        }

        loading = true;

        let xhr = new window.XMLHttpRequest();
        xhr.responseType = "document";

        xhr.addEventListener("load", onPageLoad);

        xhr.open("GET", nextElement.href);
        xhr.send(null);
    }

    function requestTick() {
        ticking || window.requestAnimationFrame(onUpdate);
        ticking = true;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        requestTick();
    }

    function onResize() {
        lastWindowHeight = window.innerHeight;
        lastDocumentHeight = document.documentElement.scrollHeight;
        requestTick();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    requestTick();
})(window, document);
