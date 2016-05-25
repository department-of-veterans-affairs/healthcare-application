const chai = require('chai');
chai.should();
const tk = require('timekeeper');

const enrollmentSystem = require('../../src/server/enrollment-system');
const fakeApplication = require('../data/fake-application');
const ajv = require('ajv');

const ApplicationJsonSchema = require('../../src/common/schema/application');
const validate = ajv({ allErrors: true, errorDataPath: 'property', removeAdditional: true, useDefaults: true }).compile(ApplicationJsonSchema);

const goldenSoapSubmission = require('../data/golden-soap-submission.json');

describe('enrollment-system base tests', () => {
  describe('characterization tests', () => {
    const fluxCapacitor = new Date('2015-10-21');
    beforeEach(() => {
      // Ensure all date stamping done during message generation is locked to the same instant.
      tk.travel(fluxCapacitor);
    });

    afterEach(() => {
      tk.reset();
    });

    it('should transform the fake applicaiton to a known good soap message', () => {
      const valid = validate(fakeApplication);
      chai.assert.isTrue(valid, JSON.stringify([validate.errors, fakeApplication], null, 2));
      const result = enrollmentSystem.veteranToSaveSubmitForm(fakeApplication);
      result.should.be.instanceOf(Object);
      result.should.deep.equal(goldenSoapSubmission);
    });
  });

  describe('validate the input is a non-empty Object', () => {
    it('should return an empty object when nothing is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm();
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when an empty object is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm({});
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when an array is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm([1, 2, 3]);
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when a string is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm('veteran');
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when a number is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm(1);
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
  });
});
