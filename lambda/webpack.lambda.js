/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
require("dotenv").config({ path: __dirname + "/../.env" });

const envKeys = [];

module.exports = {
  mode: "development",
  target: "node", // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin(
      envKeys.reduce(
        (definitions, key) => ({
          ...definitions,
          [`process.env.${key}`]: JSON.stringify(process.env[key])
        }),
        {}
      )
    )
  ]
};
