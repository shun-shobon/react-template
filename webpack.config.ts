import type { Configuration } from "webpack";
import { resolve } from "path";

const isProduction = process.env["NODE_ENV"] === "production";
const basePath = process.env["BASE_PATH"] ?? "/";

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
  cache: {
    type: "filesystem",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

export default config;
