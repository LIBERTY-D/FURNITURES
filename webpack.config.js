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
        test: /\.(png|jpg|gif|jpeg)$/i,
        use: "url-loader",
      },

      {
        test: /\.(js)$/,
        use: "babel-loader",
      },
      {
        test: /\.pug$/,
        use: ["apply", "pug"],
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, "./PUBLIC/dist"),
    filename: "bundle.js",
  },

  mode: process.NODE_ENV === "production" ? "production" : "development",
};
