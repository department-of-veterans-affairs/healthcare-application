// TODO: Remove this whole file in favor of a build envrionment variable like
// used in definePlugin in webpack.config.js.

var path = require('path');

var config = require('./webpack.config');

config.output.path = path.join(__dirname, "generated/prod");
config.output.publicPath = "/healthcare/apply/generated/prod/";
config.devtool = '#source-map';

module.exports = config;
