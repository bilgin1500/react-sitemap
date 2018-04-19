const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const mode = process.env.WEBPACK_MODE || 'development';
const outputFolder = 'demo-build';

module.exports = {
  mode: mode,
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    filename: 'demo.js',
    path: path.resolve(__dirname, outputFolder)
  },
  resolve: {
    extensions: ['.js', '.json', '.styl']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, outputFolder),
    port: 9001,
    open: true,
    hot: true,
    stats: 'minimal'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Flexible React sitemap component'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
