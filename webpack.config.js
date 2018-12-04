/* global module:true, require:true __dirname */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
// const pkg = require("./package.json");

module.exports = {
  context: __dirname,
  devtool: "source-map",
  entry: "./src/code/main.tsx",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js"
  },
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: "pre",
        use: [
          {
            loader: "tslint-loader",
            options: {
              configFile: "tslint.json",
              failOnHint: true
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true // IMPORTANT! use transpileOnly mode to speed-up compilation
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: "file-loader",
        options: {
          name: "img/[name].[ext]",
        }
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  plugins:[
    new ForkTsCheckerWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: "src/html/"},
      { from: "src/img/", to: "img"},
      { from: "src/fonts/", to: "fonts"},
    ]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          filename: "vendor.js"
        }
      }
    }
  },
};
