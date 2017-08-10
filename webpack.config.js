/* global module:true, require:true __dirname */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    app: ["./src/code/main.tsx"],
    vendor: ["lodash", "react", "react-dom", "mobx", "mobx-react", "material-ui"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader", options: {configFileName: "./tsconfig.json"} },
    ]
  },

  plugins:[
    new CopyWebpackPlugin([
      { from: "src/html/"},
      { from: "src/img/", to: "img"},
      { from: "src/fonts/", to: "fonts"},
    ]),

    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js"
    })
  ],
  stats: {
    colors: true
  }

};
