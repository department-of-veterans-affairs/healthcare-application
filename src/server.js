'use strict'; // eslint-disable-line
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const winston = require('winston');

const config = require('../config');

const options = {
  config,
  logger: winston
};

const application = require('./server/routes/application');
const status = require('./server/routes/status');
const mockapi = require('./server/routes/mockapi');

const port = config.port;

function makeApp() {
  if (process.env.BABEL_ENV === 'hot') {
    // Set up webpack dev server.
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const webpackConfig = require('../webpack.config');
    webpackConfig.entry.unshift(
      `webpack-dev-server/client?http://localhost:${port}/`,
      'webpack/hot/dev-server');
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    const webpackCompiler = webpack(webpackConfig);
    return new WebpackDevServer(webpackCompiler, {
      contentBase: 'public',
      hot: true,
      publicPath: webpackConfig.output.publicPath,
      historyApiFallback: true,
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

  const app = express();
  app.use(`${config.basePath}/generated`, express.static('generated'));
  app.use(`${config.basePath}/*`, express.static('public/index.html'));
  app.use(config.basePath, express.static('public'));
  app.use('/', express.static('public'));

  return app;
}

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
  throw new Error('Use the right values in config.soap.serverCA instead of disabling TLS cert validation!');
}

const app = makeApp();
app.use(morgan('combined'));
app.use(bodyParser.json());
if (process.env.HCA_MOCK_API !== '1') {
  app.use(`${config.apiRoot}/application`, application(options));
  app.use(`${config.apiRoot}/status`, status(options));
} else {
  app.use(`${config.apiRoot}`, mockapi(options));
}

app.listen(port);
