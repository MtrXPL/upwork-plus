const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/inject.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "inject.js",
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "ejs-webpack-loader",
          },
        ],
      },
    ],
  },
};
