const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: {
        main: './js/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },

    devServer: {
        open: true,
        static: path.resolve(__dirname, 'public'),
        port: 5050,
    },
    module: {
        rules: [{
                test: /\.(sass|scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(jpg|png|svg|gif|jpeg)$/,
                use: 'file-loader'
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Canvas',
            filename: 'index.html',
            template: 'public/index.html'
        })

    ]
}