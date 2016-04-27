const loopback = require('loopback');
const voaRest = require('../hca-api-stub/voa-rest');

const api = loopback();
voaRest.attach(api);

// TODO(awong): Ensure we do NOT load this on travis and staging.
//   const express = require('express');
//   server.use(express.static('public'));
// Set up webpack dev server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');
webpackConfig.entry.app.unshift(
  'webpack-dev-server/client?http://localhost:8080/',
  'webpack/hot/dev-server');
const webpackCompiler = webpack(webpackConfig);
const server = new WebpackDevServer(webpackCompiler, {
  contentBase: 'public',
  hot: true,
  publicPath: webpackConfig.output.publicPath,
  stats: { colors: true }
});
server.use('/', api);
server.listen(8080);
