
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

export default function makeWebpack(webpackConfig) {
  var compiler = webpack(webpackConfig);
  var server = new WebpackDevServer(compiler, {
    // webpack-dev-server options
    // contentBase: "/path/to/directory",
    // or: contentBase: "http://localhost/",

    // hot: true,
    quiet: false,
    noInfo: false,
    lazy: true,
    filename: "bundle.js",
    watchDelay: 300,
    publicPath: "/admin/",
    headers: { "X-Custom-Header": "yes" },
    stats: { colors: true },

    historyApiFallback: false,

    /*proxy: {
      "*": "http://localhost:9090"
    }
    */
  });

  return server
}
