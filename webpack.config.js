/* global module:true, require:true __dirname */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");

module.exports = {
  entry: {
    app: ["./src/code/main.tsx"],
    vendor: Object.keys(pkg.dependencies).concat(["js-base64"])
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },

  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx", ".css"],
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
      {test: /\.css?$/, loader: "style-loader!css-loader!"},
      {test: /\.(png|jpg)$/, loader: "file-loader?name=images/[name].[ext]"}
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
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  }

};
