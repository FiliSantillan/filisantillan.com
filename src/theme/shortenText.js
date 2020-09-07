export const shortenText = (textElement, limit) => {
    const onlyText = textElement.textContent.trim();

    console.log(onlyText);
    console.log(onlyText.length);
    console.log(onlyText.substring(0, 10));

    if (onlyText.length > limit) {
        textElement.textContent = `${onlyText.substring(0, limit)}...`;
    }
};
