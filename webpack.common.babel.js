import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sass from "sass";
import fiber from "fibers";

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
      {
        test: /\.(?:c|sa|sc)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
              },
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              implementation: sass,
              sassOptions: { fiber },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      template: path.resolve("src", "index.html"),
      scriptLoading: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/styles/main.[contenthash:8].css",
      chunkFilename: "assets/styles/chunk.[contenthash:8]",
    }),
  ],
};