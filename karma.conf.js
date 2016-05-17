// Karma configuration
// Generated on Wed Dec 30 2015 15:40:11 GMT-0800 (PST)
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

webpackConfig.entry = undefined;
webpackConfig.output = undefined;
webpackConfig.devtool = 'inline-source-map';
webpackConfig.plugins.push(new webpack.IgnorePlugin(/ReactContext|react\/addons/));

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
    ],

    // list of files / patterns to load in the browser
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'test/client/**/*.spec.js?(x)'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.spec.js?(x)': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      // Don't spam Karma with output.
      noInfo: true
    },

    // test results reporter to use
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // Make Karma insert a Content-Security-Policy that disables all resource
    // loads that don't original from the same origin. This enforces
    // hermeticity in the test by terminating network loads if the page
    // happens to have a reference to something like Google analytics.
    // In PhantomJS, this is particularly critical because there will be no
    // resource cache. Test times dropped from ~4s to ~1s with this.
    customHeaders: [
    ],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    customLaunchers: {
      'PhantomJS_debug': {
        base: 'PhantomJS',
        debug: true
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // to avoid DISCONNECTED messages when connecting
    // TODO(awong): look into why browser was timing out
    browserNoActivityTimeout: 60000, //default 10000

    proxies: {
    },

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
