const path = require("path"),
ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        home: path.resolve(__dirname, "./src/js/index.js")
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name]-bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: "env"
                    }
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/[name]-bundle.css"),
    ]
};