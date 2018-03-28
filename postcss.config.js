module.exports = {
    plugins: [
        require("postcss-import"),
        require("postcss-cssnext")({
            features: {
                autoprefixer: {
                    flexbox: false,
                },
                customProperties: false
            }
        }),
        require("postcss-font-magician"),
        require("css-mqpacker")
    ]
};