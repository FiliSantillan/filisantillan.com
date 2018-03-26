module.exports = {
    plugins: [
        require("postcss-cssnext")({
            features: {
                autoprefixer: {
                    flexbox: false
                }
            }
        })
    ]
};