import * as webpack from "webpack";
import * as path from "path";

const isProduction = process.env.NODE_ENV === "production";

const baseUrl = process.env.BASE_URL ?? "/";

const config: webpack.Configuration = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: path.join(__dirname, "src", "index.js"),
  },
  output: {
    publicPath: baseUrl,
    path: path.join(__dirname, "dist"),
    filename: "scripts/[name].[contenthash:8].js",
  },
};

export default config;
