
var path = require('path')
var BASE = path.join(__dirname, 'node_modules')

module.exports = {
  entry: './app/front/run.js',
  output: {
    path: __dirname + '/app/build',
    filename: 'bundle.js',
  },
  
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'react': path.join(__dirname, '../node_modules/react'),
      // 'formative': path.join(__dirname, '../form'),
      'flammable': path.join(__dirname, '../../flammable'),
    },
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader:  BASE + '/babel-loader?optional=bluebirdCoroutines&stage=0',
      exclude: [
        'node_modules',
      ],
      /*
      include: [
        path.join(__dirname, 'app/front'),
        path.join(__dirname, '../plugins'),
        path.join(__dirname, '../themes'),
        // path.join(__dirname, 'lib'),
        // path.join(__dirname, 'extra'),
        // path.join(__dirname, '../form'),
        path.join(__dirname, '../../flammable'),
      ]
      */
    }, {
      test: /\.json$/,
      loader: 'json',
    }]
  },
}

