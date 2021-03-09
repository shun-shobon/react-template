import type { Configuration } from "webpack";
import type WebpackDevServer from "webpack-dev-server";
import { EnvironmentPlugin } from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import sass from "sass";
import fibers from "fibers";
import { resolve } from "path";

declare module "webpack" {
  interface Configuration {
    devServer?: WebpackDevServer.Configuration;
  }
}

const isProduction = process.env["NODE_ENV"] === "production";
const basePath = process.env["REACT_APP_BASE_PATH"] ?? "/";

const config: Configuration = {
  target: "web",
  mode: isProduction ? "production" : "development",
  entry: {
    index: resolve("src", "index.tsx"),
  },
  output: {
    path: resolve("dist"),
    publicPath: basePath,
    filename: "assets/scripts/[name].[contenthash:8].js",
    chunkFilename: "assets/scripts/chunk.[contenthash:8].js",
  },
  devtool: isProduction ? "nosources-source-map" : "eval-source-map",
  devServer: {
    historyApiFallback: true,
  },
  cache: {
    type: "filesystem",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          {
            loader: "ts-loader",
            options: {
              configFile: resolve("src", "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.(?:c|sa|sc)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: "css-loader",
            options: {
              sourceMap: !isProduction,
              importLoaders: 2,
              modules: {
                auto: true,
                localIdentName: isProduction
                  ? "[hash:base64:8]"
                  : "[path][name]__[local]",
                exportLocalsConvention: "dashes",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: !isProduction,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: !isProduction,
              implementation: sass,
              sassOptions: {
                fiber: fibers,
              },
            },
          },
        ],
      },
      {
        test: /\.(?:png|jpe?g|svg|gif|webp)$/,
        type: "asset",
        generator: {
          filename: "assets/images/[name].[contenthash:8].[ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new EnvironmentPlugin(
      Object.keys(process.env).filter(
        (name) => name === "NODE_ENV" || name.startsWith("REACT_APP_"),
      ),
    ),
    new HtmlWebpackPlugin({
      inject: "head",
      minify: isProduction,
      template: resolve("src", "index.html"),
      scriptLoading: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/styles/[name].[contenthash:8].css",
      chunkFilename: "assets/styles/chunk.[contenthash:8].css",
      ignoreOrder: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve("public"),
        },
      ],
    }) as any,
  ],
};

export default config;
