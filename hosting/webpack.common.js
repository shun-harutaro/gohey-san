const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './index.jsx'), //エントリポイント
    output: {
        path: path.resolve(__dirname,  './dist'),
        //path: path.resolve('dist'),
        filename: 'index_bundle.js',
        publicPath: '/', // assetに対するベースURL
    },
    // target: 'web',
   resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-react']
                }
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
            filename: './index.html'
        }),
    ],
};
