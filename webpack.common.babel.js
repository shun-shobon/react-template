import HtmlWebpackPlugin from "html-webpack-plugin";

import * as path from "path";

export default {
  mode: "none",
  target: "web",
  entry: path.resolve("src", "index.tsx"),
  output: {
    path: path.resolve("dist"),
    publicPath: "/",
    filename: "assets/scripts/[name].[contenthash:8].js",
    chunkFilename: "assets/scripts/chunk.[contenthash:8]",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      template: path.resolve("src", "index.html"),
      scriptLoading: "defer",
    }),
  ],
};