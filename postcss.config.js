module.exports = {
    plugins: [
        require("postcss-import"),
        require("postcss-cssnext")({
            features: {
                autoprefixer: {
                    flexbox: false,
                    grid: false
                },
                customProperties: false
            }
        }),
        require("postcss-font-magician"),
        require("css-mqpacker")({
            variants: {
                Montserrat: {
                    300: [],
                    700: []
                },
                Nunito: {
                    300: [],
                    400: [],
                    700: []
                }
            }
        })
    ]
};