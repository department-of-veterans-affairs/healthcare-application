const report = require('../report');
const config = require('../../../config');

// FIXME: This should come in from a config variable
const url = 'http://localhost:' + config.port; // eslint-disable-line

// Test timeout constants
// TODO(awong): Move to a common file usable for all tests.
const timeouts = {
  normal: 500,     // The normal timeout to use. For most opreations w/o a server roundtrip, this should be more than fast enough.
  slow: 1000,      // A slow timeout incase the page is doing something complex.
  molasses: 5000,  // A really really slow timeout. This should rarely be used.
};

// TODO(awong): Move this into a custom command or assertion that can be used with client.expect.element().
function expectNavigateAwayFrom(client, urlSubstring) {
  client.expect.element('.js-test-location').attribute('data-location')
    .to.not.contain(urlSubstring).before(timeouts.normal);
}

module.exports = {
  'Begin application': (client) => {
    console.log(url);

    // Ensure introduction page renders.
    client
      .url(url)
      .waitForElementVisible('body', timeouts.normal)
      .assert.title('Apply for Health Care: Vets.gov')
      .waitForElementVisible('.form-panel', timeouts.slow)  // First render of React may be slow.
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/introduction');

    // Personal Information page.
    client.expect.element('input[name="fname"]').to.be.visible;
    client
      .setValue('input[name="fname"]', 'William')
      .setValue('input[name="mname"]', 'Swan')
      .setValue('input[name="lname"]', 'Shakespeare')
      .setValue('select[name="suffix"]', 'Jr.')
      .setValue('input[name="mothersMaidenName"]', 'Arden')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/personal-information');

    // Birth information page.
    client.expect.element('select[name="veteranBirthMonth"]').to.be.visible;
    client
      .setValue('select[name="veteranBirthMonth"]', 'Apr')
      .setValue('select[name="veteranBirthDay"]', '23')
      .setValue('input[name="veteranBirthYear"]', '1980')
      .setValue('input[name="ssn"]', '111-22-3333')
      .setValue('input[name="cityOfBirth"]', 'Akron')
      .setValue('select[name="stateOfBirth"]', 'OH')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/birth-information');

    // Demographic information page.
    client.expect.element('select[name="gender"]').to.be.visible;
    client
      .setValue('select[name="gender"]', 'M')
      .click('input[name="isAmericanIndianOrAlaskanNative"] + label')
      .click('input[name="isBlackOrAfricanAmerican"] + label')
      .click('input[name="isNativeHawaiianOrOtherPacificIslander"] + label')
      .click('input[name="isAsian"] + label')
      .click('input[name="isWhite"] + label')
      .click('input[name="isSpanishHispanicLatino"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/demographic-information');

    // Veteran Address page.
    client.expect.element('input[name="address"]').to.be.visible;
    client
      .setValue('input[name="address"]', '111 S Michigan Ave')
      .setValue('input[name="city"]', 'Chicago')
      .setValue('select[name="country"]', 'USA')
      .setValue('select[name="state"]', 'IL')
      .setValue('input[name="zip"]', '60603')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/veteran-address');

    // Contact Information Page.
    client.expect.element('input[name="email"]').to.be.visible;
    client
      .setValue('input.first-email', 'bills@bard.com')
      .setValue('input.second-email', 'bills@bard.com')
      .setValue('input.home-phone', '3125551212')
      .setValue('input.mobile-phone', '3125551213')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/veteran-information/contact-information');

    // Military Service Information Page.
    client.expect.element('select[name="lastServiceBranch"]').to.be.visible;
    client
      .setValue('select[name="lastServiceBranch"]', 'army')
      .setValue('select[name="lastEntryMonth"]', 'Oct')
      .setValue('select[name="lastEntryDay"]', '10')
      .setValue('input[name="lastEntryYear"]', '2000')
      .setValue('select[name="lastDischargeMonth"]', 'Nov')
      .setValue('select[name="lastDischargeDay"]', '11')
      .setValue('input[name="lastDischargeYear"]', '2004')
      .setValue('select[name="dischargeType"]', 'honorable')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/service-information');

    // Military Service Additional Information Page.
    client.expect.element('input[name="purpleHeartRecipient"] + label').to.be.visible;
    client
      .click('input[name="purpleHeartRecipient"] + label')
      .click('input[name="isFormerPow"] + label')
      .click('input[name="postNov111998Combat"] + label')
      .click('input[name="disabledInLineOfDuty"] + label')
      .click('input[name="swAsiaCombat"] + label')
      .click('input[name="vietnamService"] + label')
      .click('input[name="exposedToRadiation"] + label')
      .click('input[name="radiumTreatments"] + label')
      .click('input[name="campLejeune"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/military-service/additional-information');

    // VA Benefits Basic Info page.
    client.expect.element('input[name="compensableVaServiceConnected-0"] + label').to.be.visible;
    client
      .click('input[name="compensableVaServiceConnected-0"] + label')
      .click('input[name="isVaServiceConnected-0"] + label')
      .click('input[name="receivesVaPension-0"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/va-benefits/basic-information');

    // Financial disclosure page.
    client.expect.element('input[name="provideFinancialInfo-1"] + label').to.be.visible;
    client
      .click('input[name="provideFinancialInfo-1"] + label')
      .click('input[name="understandsFinancialDisclosure-0"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/financial-disclosure');

    // Spouse information Page.
    client.expect.element('select[name="maritalStatus"]').to.be.visible;
    client
      .setValue('select[name="maritalStatus"]', 'Married')
      .click('.form-panel');
    client.expect.element('input[name="fname"]').to.be.visible.before(timeouts.normal);

    client
      .setValue('input[name="fname"]', 'Anne')
      .setValue('input[name="mname"]', 'Jacqueline')
      .setValue('input[name="lname"]', 'Hathaway')
      .setValue('select[name="suffix"]', 'Sr.')
      .setValue('input[name="ssn"]', '444-55-6666')
      .setValue('select[name="spouseBirthMonth"]', 'Aug')
      .setValue('select[name="spouseBirthDay"]', '6')
      .setValue('input[name="spouseBirthYear"]', '1980')
      .setValue('select[name="marriageMonth"]', 'Jun')
      .setValue('select[name="marriageDay"]', '1')
      .setValue('input[name="marriageYear"]', '2010')
      .click('input[name="sameAddress-1"] + label');
    client.expect.element('input[name="address"]').to.be.visible.before(timeouts.normal);

    client
      .setValue('input[name="address"]', '115 S Michigan Ave')
      .setValue('input[name="city"]', 'Chicago')
      .setValue('select[name="country"]', 'USA')
      .setValue('select[name="state"]', 'IL')
      .setValue('input[name="zip"]', '60603')
      .click('input[name="cohabitedLastYear-0"] + label')
      .click('input[name="provideSupportLastYear-0"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/spouse-information');


    // Child Information Page.
    client.expect.element('input[name="hasChildrenToReport-0"] + label').to.be.visible;
    client.click('input[name="hasChildrenToReport-0"] + label');
    client.expect.element('input[name="fname"]').to.be.visible.before(timeouts.normal);
    client
      .setValue('input[name="fname"]', 'Hamnet')
      .setValue('input[name="mname"]', 'Dirtbike')
      .setValue('input[name="lname"]', 'Shakespeare')
      .setValue('select[name="suffix"]', 'Jr.')
      .setValue('select[name="childRelation"]', 'Son')
      .setValue('input[name="ssn"]', '777-88-9999')
      .setValue('select[name="childBirthMonth"]', 'Feb')
      .setValue('select[name="childBirthDay"]', '2')
      .setValue('input[name="childBirthYear"]', '2012')
      .setValue('select[name="childBecameDependentMonth"]', 'Feb')
      .setValue('select[name="childBecameDependentDay"]', '2')
      .setValue('input[name="childBecameDependentYear"]', '2012')
      .click('input[name="childDisabledBefore18"] + label')
      .click('input[name="childAttendedSchoolLastYear"] + label')
      .setValue('input[name="childEducationExpenses"]', '6000')
      .click('input[name="childCohabitedLastYear"] + label')
      .click('input[name="childReceivedSupportLastYear"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/child-information');

    // Annual Income Page.
    client.expect.element('input[name="veteranGrossIncome"]').to.be.visible;
    client
      .setValue('input[name="veteranGrossIncome"]', '10000')
      .setValue('input[name="veteranNetIncome"]', '9000')
      .setValue('input[name="veteranOtherIncome"]', '8000')
      .setValue('input[name="spouseGrossIncome"]', '7000')
      .setValue('input[name="spouseNetIncome"]', '6000')
      .setValue('input[name="spouseOtherIncome"]', '5000')
      .setValue('input[name="childGrossIncome"]', '4000')
      .setValue('input[name="childNetIncome"]', '3000')
      .setValue('input[name="ChildOtherIncome"]', '2000')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/annual-income');

    // Deductible Expenses Page.
    client.expect.element('input[name="deductibleMedicalExpenses"]').to.be.visible;
    client
      .setValue('input[name="deductibleMedicalExpenses"]', '1000')
      .setValue('input[name="deductibleFuneralExpenses"]', '2000')
      .setValue('input[name="deductibleEducationExpenses"]', '3000')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/household-information/deductible-expenses');

    // Medicare and Medicaid Page.
    client.expect.element('input[name="isMedicaidEligible-0"] + label').to.be.visible;
    client
      .click('input[name="isMedicaidEligible-1"] + label')
      .click('input[name="isEnrolledMedicarePartA-1"] + label')
      .setValue('select[name="medicarePartAEffectiveMonth"]', 'Apr')
      .setValue('select[name="medicarePartAEffectiveDay"]', '23')
      .setValue('input[name="medicarePartAEffectiveYear"]', '1980')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/medicare');

    // Insurance Information Page.
    client.expect.element('input[name="isCoveredByHealthInsurance-0"] + label').to.be.visible;
    client.click('input[name="isCoveredByHealthInsurance-0"] + label');
    client.expect.element('input[name="insuranceName"]').to.be.visible.before(timeouts.normal);
    client
      .setValue('input[name="insuranceName"]', 'BCBS')
      .setValue('input[name="insurancePolicyHolderName"]', 'William Shakespeare')
      .setValue('input[name="insurancePolicyNumber"]', '100')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/general');

    // Additional VA Insurance Information Page.
    client.expect.element('select[name="state"]').to.be.visible;
    client
      .click('input[name="isEssentialAcaCoverage"] + label')
      .setValue('select[name="state"]', 'IL')
      .setValue('select[name="vaMedicalFacility"]', 'EVANSTON CBOC')
      .click('input[name="wantsInitialVaContact"] + label')
      .click('.form-panel .usa-button-primary');
    expectNavigateAwayFrom(client, '/insurance-information/va-facility');

    // Review and Submit Page.
    client.expect.element('button.edit-btn').to.be.visible;
    client.click('.form-panel .usa-button-primary');
    // TODO: test that submission works and they are redirect to the confirmation page. Uncomment
    // this expectation when that works.
    // expectNavigateAwayFrom(client, '/review-and-submit');


    client.end();
  },
  tearDown: report
};
