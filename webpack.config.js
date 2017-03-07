/* global module:true, require:true __dirname */

var path = require("path");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "js"),
    filename: "main.bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["es2015", "react"]
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: "source-map"
};
