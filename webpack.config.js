const path = require("path");
module.exports = {
  entry: "./PUBLIC/JS/index.js",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js)$/,
        use: "babel-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./PUBLIC/dist"),
    filename: "bundle.js",
  },

  mode: process.NODE_ENV === "production" ? "production" : "development",
};
