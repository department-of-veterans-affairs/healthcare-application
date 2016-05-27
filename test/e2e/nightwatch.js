/* eslint-disable */
const _ = require('lodash');

// Default settings for local Selenium installation
const settings = {
  src_folders: ['./test/e2e/tests'],
  output_folder: './reports',
  live_output: true,
  parallel_process_delay: 10,
  disable_colors: false,
  test_workers: false,
  test_settings: {
    default: {
      selenium_host: 'localhost',
      selenium_port: 4444,
      use_ssl: false,
      silent: true,
      output: true,
      screenshots: {
        enabled: false,
        on_failure: true,
        path: ''
      },
      desiredCapabilities: {
        name: 'firefox-test',
        browserName: 'firefox'
      },
      selenium: {
        start_process: false
      }
    }
  },
  saucelabs_environments: []
};

// Settings for Travis CI + SauceLabs integration
const travis = {
  launch_url: 'https://ondemand.saucelabs.com',
  selenium_host: 'ondemand.saucelabs.com',
  selenium_port: 443,
  username: process.env.SAUCE_USERNAME,
  access_key: process.env.SAUCE_ACCESS_KEY,
  use_ssl: true,
  silent: true,
  output: true,
  globals: {
    waitForConditionTimeout: 10000
  },
  selenium: {
    start_process: false
  }
};

// Browsers that we are testing via Saucelabs
const browsers = {
  firefox: {
    browserName: 'firefox'
  },
  chrome: {
    browserName: 'chrome'
  },
  ie9: {
    browserName: 'internetExplorer',
    version: '9'
  },
  ie10: {
    browserName: 'internetExplorer',
    version: '10'
  },
  ie11: {
    browserName: 'internetExplorer',
    version: '11'
  }
};

// Merge environment settings for each browser.  This is necessary in order to test multiple browsers in parallel.
// See: https://github.com/nightwatchjs/nightwatch-docs/blob/master/guide/running-tests/run-parallel.md
for (var name in browsers){
  var environment = {
    desiredCapabilities : {
      name: name,
      browserName: browsers[name].browserName,
      version: browsers[name].version,
      build: `build-${process.env.TRAVIS_JOB_NUMBER}`,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    }
  };
  settings.test_settings[name] = _.merge({}, travis, environment);
  settings.saucelabs_environments.push(name); 
}

module.exports = settings;
