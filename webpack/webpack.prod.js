/* eslint-disable */
'use strict';

var webpack = require('webpack');
var path = require('path');
var UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
      }],
      exclude: /node_modules/
    },{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },

  entry: {
    pinchit: ['./src/index.js'],
  },

  watch: false,
  devtool: 'cheap-module-source-map',

  output: {
    path: path.join(__dirname, '..', 'dist/'),
    filename: 'pinchit.min.js',
    libraryTarget: 'umd',
    library: 'pinchit',
    umdNamedDefine: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        drop_console: true
      }
    }),
    new UnminifiedWebpackPlugin()
  ],
  resolve: {
    extensions: [".js", ".json"]
  }
};
