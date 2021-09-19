import { merge } from "webpack-merge";

import common from "./webpack.common.babel.js";

export default merge(common, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
  },
});
