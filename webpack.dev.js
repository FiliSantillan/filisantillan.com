const path = require("path"),
  ExtractTextPlugin = require("extract-text-webpack-plugin"),
  UglifyJsPlugin = require("uglifyjs-webpack-plugin"),
  CleanWebpackPlugin = require("clean-webpack-plugin"),
  webpack = require("webpack");
// SizePlugin = require("size-plugin");

const pluginsList = [
    new ExtractTextPlugin("css/[name]-bundle.css")
    // new SizePlugin()
  ],
  cssOptions = {
    importLoaders: 1
  };

module.exports = {
  entry: {
    home: path.resolve(__dirname, "./src/js/home.js"),
    post: path.resolve(__dirname, "./src/js/post.js"),
    author: path.resolve(__dirname, "./src/js/author.js"),
    tag: path.resolve(__dirname, "./src/js/tag.js")
  },
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "js/[name]-bundle.js",
    publicPath: "./assets/"
  },
  devServer: {
    contentBase: path.join(__dirname, "assets"),
    port: 9000,
    proxy: {
      context: () => true,
      target: "http://localhost:2368"
    }
  },
  module: {
    rules: [
      {
        test: /default-\.hbs$/,
        loader: 'string-replace-loader',
        options: {
          search: '$variable',
          replace: 'test',
        }
      },
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
  plugins: pluginsList,
  optimization: {
    splitChunks: {
      name: "common",
      chunks: "initial"
    }
  }
};
