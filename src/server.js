const loopback = require('loopback');
const voaRest = require('../hca-api-stub/voa-rest');

const app = loopback();
voaRest.attach(app);

// TODO(awong): Ensure we do NOT load this on travis and staging.
// Set up webpack dev server.
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../webpack.config');
const webpackCompiler = webpack(webpackConfig);
app.use(loopback.static('public'));
app.use(webpackDevMiddleware(webpackCompiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {colors: true}
}));

app.listen(3000, () => {
  const baseUrl = 'http://127.0.0.1:3000';
  app.emit('started', baseUrl);
  console.log('LoopBack server listening @ %s%s', baseUrl, '/');
});
