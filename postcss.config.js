module.exports = {
    plugins: [
        require("postcss-import")({
            plugins: [
                require("stylelint")({
                    "rules": {
                        "block-no-empty": true,
                        "unit-whitelist": ["%", "s"],
                        "indentation": ["tab"],
                    }
                })
            ]
        }),
        require("postcss-cssnext")({
            features: {
                autoprefixer: {
                    flexbox: false,
                    grid: false
                },
                customProperties: false,
                rem: false
            }
        }),
        require("postcss-font-magician")({
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
        }),
        require("css-mqpacker")
    ]
};