
var path = require('path')
var BASE = path.join(__dirname, 'node_modules')

module.exports = {
  devtool: 'eval',
  entry: './app/front/run.js',
  output: {
    path: __dirname + '/app/build',
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react': path.join(__dirname, '../node_modules/react'),
      'json-loader': path.join(__dirname, './node_modules/json-loader'),
      // 'formative': path.join(__dirname, '../form'),
      'flammable': path.join(__dirname, '../../flammable'),
    },
  },

  node: {
    fs: 'empty',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader:  BASE + '/babel-loader?optional=bluebirdCoroutines&stage=0',
      exclude: [
        'node_modules',
      ],
    }, {
      test: /\.json$/,
      loader: path.join(__dirname, 'node_modules/json-loader'),
      include: [
        path.join(__dirname, '../node_modules/mark-that'),
      ],
    }]
  },
}

