const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port; // eslint-disable-line

module.exports = {
  'Begin application': (client) => {
    console.log(url);
    client
      .url(url)
      .waitForElementVisible('body', 1000)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', 3000)
      .click('.form-panel .usa-button-primary')
      .pause(1000)
      .assert.visible('input[name="fname"]')
      .setValue('input[name="fname"]', 'William')
      .setValue('input[name="lname"]', 'Shakespeare');
      // etc...
  },
  tearDown: report
};
