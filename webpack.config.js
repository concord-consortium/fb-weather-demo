/* global module:true, require:true __dirname */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/js/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "stage-2", "react"]
        }
      }
    ]
  },
  plugins:[
    new CopyWebpackPlugin([
      { from: "src/html/"},
      { from: "src/img/", to: "img"},
      { from: "src/fonts/", to: "fonts"},
    ])],
  stats: {
    colors: true
  },
  devtool: "source-map"
};
