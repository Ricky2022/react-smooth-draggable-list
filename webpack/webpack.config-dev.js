const path = require("path")
const webpack = require("webpack")
const wds_port = 2100

const PATHS = {
  src: path.join(__dirname, "..", "src"),
  js: path.join(__dirname, "..", "src", "js"),
  build: path.join(__dirname, "..", "demo", "dist"),
  devServer: path.join(__dirname, "..", "demo")
}

const config = {
  entry: [path.join(PATHS.devServer, "js", "entry.js")],
  externals: {},
  devServer: {
    host: "0.0.0.0",
    port: wds_port,
    hot: true,
    inline: true,
    historyApiFallback: true,
    contentBase: PATHS.build
  },
  output: {
    path: PATHS.build,
    filename: "main.js",
    library: "react-smooth-draggable-list",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ],
  resolve: {
    extensions: [".js", ".json", ".css", ".scss"]
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader"
          }
        ],
        include: [PATHS.js, PATHS.devServer]
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: "url-loader?limit=100000"
          }
        ]
      }
    ]
  }
}

module.exports = config
