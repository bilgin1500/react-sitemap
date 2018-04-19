const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const mode = process.env.WEBPACK_MODE || 'development';
const isProd = true; //mode == 'production' ? true : false;
const sourceFolder = 'src';
const outputFolder = 'build';
const name = 'react-sitemap';
const libName = 'ReactSitemap';
const min = isProd ? '.min' : '';

module.exports = {
  mode: mode,
  devtool: 'sourcemap',
  entry: path.resolve(__dirname, sourceFolder + '/index.js'),
  output: {
    path: path.resolve(__dirname, outputFolder),
    filename: name + min + '.js',
    sourceMapFilename: name + min + '.js.map',
    library: libName,
    libraryTarget: 'umd'
  },
  externals: {
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types'
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    }
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
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProd,
                sourceMap: isProd
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    //new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin(name + min + '.css'),
    new UglifyJsPlugin({
      sourceMap: isProd,
      uglifyOptions: {
        output: {
          comments: isProd,
          beautify: isProd
        }
      }
    })
  ]
};
