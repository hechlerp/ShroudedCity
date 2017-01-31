'use strict'
let path = require('path')
let webpack = require('webpack')

module.exports = {
   context: __dirname,
   entry: "./lib/shrouded_city.js",
   output: {
     path: "./lib",
     publicPath: "/lib/",
     filename: "bundle.js",
     devtoolModuleFilenameTemplate: '[resourcePath]',
     devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
   },
  devtool: 'source-maps',
  module: {

    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /pixi\.js/, loader: 'expose?PIXI' },
      {
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ],

    postLoaders: [
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader: 'transform?brfs'
      }
    ]
  },
  node: {
    fs: 'empty',
  }
};
