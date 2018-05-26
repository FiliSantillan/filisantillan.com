const path = require("path"),
ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        home: path.resolve(__dirname, "./src/js/home.js"),
        post: path.resolve(__dirname, "./src/js/post.js"),
        author:path.resolve(__dirname, "./src/js/author.js"),
        tag: path.resolve(__dirname, "./src/js/tag.js")
    },
    output: {
        path: path.resolve(__dirname, "assets"),
        filename: "js/[name]-bundle.js",
        publicPath: "./assets/"
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
                                importLoaders: 1,
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
                        limit: 100000,
                        fallback: 'file-loader',
                        name: "images/[name].[ext]"
                    }
                }
            },
            {
                test: /\.(woff|eot|ttf|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 100000,
                        fallback: 'file-loader',
                        name: "fonts/[name].[ext]"
                    }
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("css/[name]-bundle.css"),
    ]
};