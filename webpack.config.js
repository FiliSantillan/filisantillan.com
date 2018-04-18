const path = require("path"),
ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        home: path.resolve(__dirname, "./src/js/home.js")
    },
    output: {
        path: path.resolve(__dirname, "assets"),
        filename: "js/[name]-bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            },
                        },
                        "postcss-loader"
                    ]
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
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000
                    }
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/[name]-bundle.css"),
    ]
};