const webpack = require("webpack");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const smp = new SpeedMeasurePlugin();

module.exports = {
  webpack: (config, env) => {
    // do stuff with the webpack config...
    config.resolve.fallback = {
      assert: require.resolve("assert"),
      buffer: require.resolve("buffer"),
      child_process: false,
      constants: require.resolve("constants-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      url: require.resolve("url"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
    };
    // config.devtool = false;
    config.resolve.extensions = [...config.resolve.extensions, ".js"];
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
    ];
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ];
    config.optimization.minimizer = [
      new TerserPlugin({
        exclude: /node_modules/,
        parallel: true,
        extractComments: true,
      }),
    ];

    return config;
  },
};
