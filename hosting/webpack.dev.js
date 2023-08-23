const { merge } = require('webpack-merge');
const webpack = require("webpack");
const dotenv = require("dotenv");
const common = require('./webpack.common.js');

const env = dotenv.config().parsed;

module.exports = merge(common,  {
    mode: 'development',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(env)
      })
    ],
    devServer: {
        /*
        static: {
            directory: path.join(__dirname, 'public'),
        },
        */
        open: true,
        hot: true,
        liveReload: true,
        historyApiFallback: true, // これ重要
        host: 'localhost',
        port: 8080,
        proxy: {
            '/api/**': {
                target: 'http://localhost:3000',
                secure: false,
                logLevel: 'debug',
            }
        }
    },

})
