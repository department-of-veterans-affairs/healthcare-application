const loopback = require('loopback');
const voaRest = require('../hca-api-stub/voa-rest');
const express = require('express');
const morgan = require('morgan');

const port = 3000;

function makeServer() {
  if (process.env.BABEL_ENV === 'hot') {
    // Set up webpack dev server.
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const webpackConfig = require('../webpack.config');
    webpackConfig.entry.app.unshift(
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/dev-server');
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    const webpackCompiler = webpack(webpackConfig);
    return new WebpackDevServer(webpackCompiler, {
      contentBase: 'public',
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {
        hash: true,
        version: true,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: true,
        warnings: true,
        publicPath: true,
        colors: true
      }
    });
  }

  const server = express();
  server.use(morgan('combined'));
  server.use('/', express.static('public'));
  server.use('/healthcare/apply', express.static('public'));
  server.use('/healthcare/apply/generated', express.static('generated'));
  return server;
}

const server = makeServer();
const api = loopback();
voaRest.attach(api);
server.use('/', api);

server.listen(port);
