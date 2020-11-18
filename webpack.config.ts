import { EnvironmentPlugin, WebpackOptionsNormalized, WebpackPluginInstance } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import sass from "sass";
import fibers from "fibers";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const baseURL = process.env.BASE_URL ?? "/";

const config: WebpackOptionsNormalized = {
  mode: isProduction ? "production" : "development",
  entry: {
    index: {
      import: [path.join(__dirname, "src", "index.tsx")],
    },
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: baseURL,
    filename: "assets/scripts/[name].[contenthash:8].js",
    chunkFilename: "assets/scripts/chunk.[contenthash:8].js",
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
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(__dirname, "tsconfig.json"),
            },
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
              sourceMap: isDevelopment,
              importLoaders: 2,
              modules: {
                auto: true,
                localIdentName: isProduction ? "[hash:base64:8]" : "[path][name]__[local]",
                exportLocalsConvention: "dashesOnly",
              },
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
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
    new EnvironmentPlugin(
      Object.keys(process.env).filter(
        (name) => name === "NODE_ENV" || name.startsWith("PREACT_APP_"),
      ),
    ),
    new HtmlWebpackPlugin({
      inject: "head",
      minify: isProduction,
      template: path.join(__dirname, "src", "index.html"),
      scriptLoading: "defer",
    }),
    (new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "public"),
        },
      ],
    }) as unknown) as WebpackPluginInstance,
  ],
  stats: true,
  devtool: isDevelopment ? "eval-source-map" : "nosources-source-map",
  cache: {
    type: "filesystem",
  },
  devServer: {
    historyApiFallback: true,
  },
  optimization: {},
  node: false,
  externals: [],
  externalsPresets: {},
  experiments: {},
  infrastructureLogging: {},
  resolveLoader: {},
  snapshot: {},
  watchOptions: {},
};

export default config;
