const path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    webpack = require("webpack");

const plugins = [new ExtractTextPlugin("styles/[name]-bundle.css")],
    cssOptions = {
        importLoaders: 1,
    };

const pathsToClean = ["assets/**/*.css", "assets/**/*.js", "assets/fonts/*"];

module.exports = (env, argv) => {
    if (argv.mode === "production") {
        plugins.push(
            new UglifyJsPlugin({
                test: /\.js($|\?)/i,
                exclude: /(node_modules)/,
            }),
            new CleanWebpackPlugin(pathsToClean, { root: __dirname })
        );

        cssOptions.minimize = true;
    }

    return {
        entry: {
            home: path.resolve(__dirname, "./src/pages/Home/Home.js"),
            blog: path.resolve(__dirname, "./src/pages/Blog/Blog.js"),
            bit: path.resolve(__dirname, "./src/pages/Bit/Bit.js"),
            video: path.resolve(__dirname, "./src/pages/Video/Video.js"),
            post: path.resolve(__dirname, "./src/pages/Post/Post.js"),
            postbit: path.resolve(__dirname, "./src/pages/PostBit/PostBit.js"),
            singlepage: path.resolve(
                __dirname,
                "./src/pages/SinglePage/SinglePage.js"
            ),
            author: path.resolve(__dirname, "./src/pages/Author/Author.js"),
            tag: path.resolve(__dirname, "./src/pages/Tag/Tag.js"),
        },
        output: {
            path: path.resolve(__dirname, "assets"),
            filename: "js/[name]-bundle.js",
            publicPath: "./assets/",
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: "css-loader",
                                options: cssOptions,
                            },
                            "postcss-loader",
                        ],
                    }),
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: { presets: ["@babel/preset-env"] },
                    },
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 100000,
                            fallback: "file-loader",
                            name: "images/[name].[ext]",
                        },
                    },
                },
                {
                    test: /\.(woff|eot|ttf|svg)$/,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 100000,
                            fallback: "file-loader",
                            name: "fonts/[name].[ext]",
                        },
                    },
                },
            ],
        },
        plugins: plugins,
        optimization: { splitChunks: { name: "common", chunks: "initial" } },
    };
};
