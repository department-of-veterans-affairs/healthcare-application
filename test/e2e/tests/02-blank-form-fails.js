const request = require('request');

const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port + '/healthcare/apply/application/review-and-submit'; // eslint-disable-line

// Test timeout constants
// TODO(awong): Move to a common file usable for all tests.
const timeout = {
  normal: 500,     // The normal timeout to use. For most opreations w/o a server roundtrip, this should be more than fast enough.
  slow: 1000,      // A slow timeout incase the page is doing something complex.
  molasses: 5000,  // A really really slow timeout. This should rarely be used.
  submission: 10000 // Only to be used for submission.
};

const section = [
  'confirm-personal-information',
  'confirm-birth-information',
  'confirm-demographic-information',
  'confirm-veteran-address',
  'confirm-contact-information',
  'confirm-military-service-information',
  'confirm-additional-service-information',
  'confirm-basic-information',
  'confirm-financial-disclosure',
  'confirm-spouse-information',
  'confirm-child-information',
  'confirm-income-information',
  'confirm-deductible-expenses',
  'confirm-medicare-medicaid-information',
  'confirm-insurance-information',
  'confirm-additional-information'
];

module.exports = {
  'Begin application': (client) => {
    request({
      uri: `${url}/api/hca/v1/mock`,
      method: 'POST',
      json: {
        resource: 'application',
        verb: 'post',
        value: {
          formSubmissionId: '123fake-submission-id-567',
          timeStamp: '2016-05-16'
        }
      }
    });

    // Review and Submit Page.
    client
      .url(url)
      .waitForElementVisible('body', timeout.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', timeout.slow);  // First render of React may be slow.

    // confirm all sections (even though they're blank)
    for (var i = 0; i < section.length; i++) { // eslint-disable-line
      client
        .waitForElementPresent(`span.${section[i]} button`, timeout.slow)
        .click(`span.${section[i]} button`)
        .waitForElementPresent(`input.${section[i]}`, timeout.slow)
        .click(`input.${section[i]} + label`);
    }

    client.click('.form-panel .usa-button-primary');

    // TODO: test that submission works and they are redirect to the confirmation page. Uncomment
    // this expectation when that works.
    // expectNavigateAwayFrom(client, '/review-and-submit');
    client
      .pause(timeout.submission)
      .expect.element('.js-test-location').attribute('data-location')
      .to.contain('/review-and-submit').before(timeout.submission);

    client.end();
  },
  tearDown: report
};
