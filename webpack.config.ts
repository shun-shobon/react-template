import * as webpack from "webpack";
import * as path from "path";
import * as dotenv from "dotenv";
import sass from "sass";
import fibers from "fibers";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CompressionPlugin from "compression-webpack-plugin";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const baseUrl = process.env.BASE_URL ?? "/";

const appEnvArray = Object.entries(process.env).flatMap(([key, value]) => {
  if (key !== "NODE_ENV" && !key.startsWith("REACT_APP_")) return [];
  return [[`process.env.${key}`, JSON.stringify(value)]];
});
const appEnv = Object.fromEntries(appEnvArray) as NodeJS.Dict<string>;

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
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevelopment,
            },
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
    new webpack.DefinePlugin(appEnv),
    new HtmlWebpackPlugin({
      inject: "body",
      minify: isProduction,
      template: path.join(__dirname, "public", "index.html"),
      scriptLoading: "defer",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash:8].css",
      chunkFilename: "styles/[id].[contenthash:8].css",
      esModule: true,
      ignoreOrder: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "public"),
          globOptions: {
            ignore: ["index.html"],
          },
        },
      ],
    }),
    new CompressionPlugin({
      test: /\.(html|css|js|svg)$/,
      filename: "[path][base].gz",
      algorithm: "gzip",
    }),
    new CompressionPlugin({
      test: /\.(html|css|js|svg)$/,
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      compressionOptions: {
        level: 11,
      },
    }),
  ],
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)/,
          name: "react",
          chunks: "initial",
          priority: 100,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
          priority: 10,
        },
      },
    },
  },
};

export default config;
