const request = require('request');

const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port; // eslint-disable-line

const common = require('../utils/common.js');

// TODO(awong): Move this into a custom command or assertion that can be used with client.expect.element().
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(common.timeouts.normal);
}

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

    // Ensure introduction page renders.
    client
      .url(url)
      .waitForElementVisible('body', common.timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', common.timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    common.completePersonalInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    common.completeBirthInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    common.completeDemographicInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    common.completeVeteranAddress(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    client.assert.cssClassPresent('.hca-process li.step:nth-child(1)', 'section-complete');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    common.completeMilitaryService(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/additional-information');

    client.assert.cssClassPresent('.hca-process li.step:nth-child(2)', 'section-complete');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    common.completeVaBenefits(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    client.assert.cssClassPresent('.hca-process li.step:nth-child(3)', 'section-complete');

		// Financial disclosure page.
    client.expect.element('input[name="discloseFinancialInformation-0"] + label').to.be.visible;
    common.completeFinancialDisclosure(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Selecting "no" for financial disclosures here causes the application to skip the next several sections:
    // Spouse information Page
    // Child Information Page
    // Annual Income Page
    // Deductible Expenses Page

    client.assert.cssClassPresent('.hca-process li.step:nth-child(4)', 'section-complete');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    common.completeMedicareAndMedicaid(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    common.completeInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    common.completeVaInsuranceInformation(client, common.testValues, true);
    client.click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    client.assert.cssClassPresent('.hca-process li.step:nth-child(5)', 'section-complete');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;

    client.expect.element('.form-panel .usa-button-primary').text.to.equal('Submit Application');
    client.click('.form-panel .usa-button-primary');
    client.expect.element('.form-panel .hca-button-green').text.to.equal('✓ Submitted');

    client.expect.element('.js-test-location').attribute('data-location')
      .to.not.contain('/review-and-submit').before(common.timeouts.submission);

    // Submit message
    client.expect.element('.success-alert-box').to.be.visible;


    client.end();
  },
  tearDown: report
};
