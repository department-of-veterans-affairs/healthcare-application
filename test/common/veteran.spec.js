const chai = require('chai');
const _ = require('lodash');
chai.should();

const veteran = require('../../src/common/veteran');
const applicationSchema = require('../../src/common/schema/application');
const validate = require('../../src/common/schema/validator').compile(applicationSchema);
const fakeApplication = require('../data/fake-application.json');

// This is a trivial test that shows the CI system is sane.
describe('Veteran model', () => {
  describe('veteranToApplication', () => {
    it('completeVeteran translates exactly to fake-application.json.', () => {
      const application = JSON.parse(veteran.veteranToApplication(veteran.completeVeteran));
      const valid = validate(application);
      chai.assert.isTrue(valid, JSON.stringify([validate.errors, application], null, 2));
      application.should.deep.eql(fakeApplication);
    });
  });
});

describe('Veteran model', () => {
  describe('veteranToApplication', () => {
    it('should not validate if depedencies aren\'t met.', () => {
      const data = _.cloneDeep(veteran.completeVeteran);
      console.log(data);
      const application = JSON.parse(veteran.veteranToApplication(data));
      const valid = validate(application);
      console.log(valid);
      chai.assert.isFalse(valid, JSON.stringify([validate.errors, application], null, 2));
      application.should.deep.eql(fakeApplication);
    });
  });
});
