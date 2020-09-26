import * as webpack from "webpack";
import * as path from "path";
import sass from "sass";
import fibers from "fibers";
import HtmlWebpackPlugin from "html-webpack-plugin";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const baseUrl = process.env.BASE_URL ?? "/";

const config: webpack.Configuration = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: path.join(__dirname, "src", "index.tsx"),
  },
  output: {
    publicPath: baseUrl,
    path: path.join(__dirname, "dist"),
    filename: "scripts/[name].[contenthash:8].js",
  },
  devtool: isDevelopment ? "inline-source-map" : false,
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: /\.(?:c|sa|sc)ss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: /\.module\.\w+$/,
                localIdentName: isProduction ? "[hash:base64]" : "[path][name]__[local]",
              },
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
            options: {
              implementation: sass,
              sassOptions: {
                fiber: fibers,
              },
            },
          },
        ],
      },
      {
        test: /\.(?:png|jpe?g|gif|svg|webp)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              fallback: "file-loader",
              name: "images/[name].[contenthash:8].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(?:woff|woff2|ttf|otf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              fallback: "file-loader",
              name: "fonts/[name].[contenthash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      minify: isProduction,
      template: path.join(__dirname, "public", "index.html"),
      scriptLoading: "defer",
    }),
  ],
};

export default config;
