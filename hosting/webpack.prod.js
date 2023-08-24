const { merge } = require('webpack-merge');
const webpack = require("webpack");
const dotenv = require("dotenv");
const common = require('./webpack.common.js');
const path = require("path");

const env = dotenv.config({
  path: path.join(__dirname, "./.env.prod")
}).parsed;

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(env)
        })
    ]
})
