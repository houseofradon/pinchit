/* eslint-disable */
'use strict';

var webpack = require('webpack');
var path = require('path');

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
    app: './docs/app.js',
  },

  watch: true,
  devtool: 'inline-source-map',

  output: {
    path: path.join(__dirname, 'docs/js/'),
    filename: 'bundle.min.js',
    publicPath: '/js/'
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    extensions: [".js", ".json"]
  }
};
