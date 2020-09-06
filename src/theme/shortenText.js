export const shortenText = (textElement, limit) => {
    const onlyText = textElement.textContent;

    if (onlyText.length > limit) {
        textElement.textContent = onlyText.substring(0, limit);
    }
};
