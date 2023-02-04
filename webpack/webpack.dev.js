const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const copies = [
  'package.json',
  'server'
]

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.resolve(__dirname, "../", "dist/client"),
    filename: "bundle.js",
  },
  devServer: {
    static: "./dist",
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      filename: "../index.html",
    }),
    new CopyWebpackPlugin({
      patterns: copies.map(copyFrom => ({
        from: path.resolve(path.resolve(__dirname, ".."), copyFrom),
        to: `${path.resolve(path.resolve(__dirname, "..", 'dist'))}/${copyFrom.split(path.sep).pop()}`,
      })),
    }),
  ],
};
