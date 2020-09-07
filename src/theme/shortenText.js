export const shortenText = (textElement, limit) => {
    const onlyText = textElement.textContent.trim();

    if (onlyText.length > limit) {
        textElement.textContent = `${onlyText.substring(0, limit)}...`;
    }
};
