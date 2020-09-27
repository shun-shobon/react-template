import * as webpack from "webpack";
import * as path from "path";
import sass from "sass";
import fibers from "fibers";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CompressionPlugin from "compression-webpack-plugin";

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
    new HtmlWebpackPlugin({
      inject: "body",
      minify: isProduction,
      template: path.join(__dirname, "public", "index.html"),
      scriptLoading: "defer",
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
    new MiniCssExtractPlugin({
      filename: "styles/[name].[contenthash:8].css",
      chunkFilename: "styles/[id].[contenthash:8].css",
      esModule: true,
      ignoreOrder: true,
    }),
    new CompressionPlugin(),
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
        }
      },
    },
  },
};

export default config;
