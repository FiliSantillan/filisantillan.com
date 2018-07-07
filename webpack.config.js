const path = require("path"),
  ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (env, argv) => {
  const pluginsList = [
            new ExtractTextPlugin("css/[name]-bundle.css")
        ],
        cssOptions = {
            importLoaders: 1
        };

  if (argv.mode === "production") {
    cssOptions.minimize = true;
  }

  return {
    entry: {
      home: path.resolve(__dirname, "./src/js/home.js"),
      post: path.resolve(__dirname, "./src/js/post.js"),
      author: path.resolve(__dirname, "./src/js/author.js"),
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
                options: cssOptions
              },
              "postcss-loader"
            ]
          })
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
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
              fallback: "file-loader",
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
              fallback: "file-loader",
              name: "fonts/[name].[ext]"
            }
          }
        }
      ]
    },
    plugins: pluginsList
  };
};
