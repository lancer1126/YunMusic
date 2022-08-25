const path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: true,
  configureWebpack: (config) => {
    config.devtool = "nosources-source-map";
  },
  devServer: {
    disableHostCheck: true,
    port: process.env.DEV_SERVER_PORT || 8080,
    proxy: {
      "^/api": {
        target: "localhost:3000",
        changeOrigin: false,
        pathRewrite: {
          "^/api": "/",
        },
      },
    },
  },
  pwa: {
    name: "Yun Music",
    iconPaths: {
      favicon32: "img/icons/icon.ico",
    },
  },
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "YunMusic",
      chunks: ["main", "chunk-vendors", "chunk-common", "index"],
    },
  },
  chainWebpack(config) {
    config.module.rules.delete("svg");
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    config.module
      .rule("napi")
      .test(/\.node$/)
      .use("node-loader")
      .loader("node-loader")
      .end();

    config.plugin("chunkPlugin").use(webpack.optimize.LimitChunkCountPlugin, [
      {
        maxChunks: 3,
        minChunkSize: 10_000,
      },
    ]);
    config.plugin("CompressionWebpackPlugin").use(CompressionWebpackPlugin);
  },
};
