const path = require('path');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    mode: 'development',
    //devTool 'source-map',
    target: 'node',
    entry: 'server.js',
    //context: path.resolve(__dirname,'src'),
   // entry: entry,
    output : {
        publicPath: './',
        path:path.resolve(__dirname,'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(scss|css)/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: [
                            reloadAll:true
                        ]
                    }
                ],
                'css-loader',
                'postcss-loader'
            }
        ]
    },
    plugins: [
        new MinifyPlugin({}, {
            comments:false
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}