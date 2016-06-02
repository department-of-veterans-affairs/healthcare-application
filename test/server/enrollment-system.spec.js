const chai = require('chai');
chai.should();
const tk = require('timekeeper');

const enrollmentSystem = require('../../src/server/enrollment-system');
const fakeApplication = require('../data/fake-application');

const ApplicationJsonSchema = require('../../src/common/schema/application');
const validate = require('../../src/common/schema/validator').compile(ApplicationJsonSchema);

const goldenJsonSubmission = require('../data/golden-soap-submission.json');

const soap = require('soap');
const config = require('../../config.js');
const xsdValidator = require('libxml-xsd');
const fs = require('fs');

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

    it('should transform the fake applicaiton to a known good json structure', () => {
      const valid = validate(fakeApplication);
      chai.assert.isTrue(valid, JSON.stringify([validate.errors, fakeApplication], null, 2));
      const result = enrollmentSystem.veteranToSaveSubmitForm(fakeApplication);
      result.should.be.instanceOf(Object);
      result.should.deep.equal(goldenJsonSubmission);
    });

    it('should become a valid SOAP request', (done) => {
      // build the json to be sent through the SOAP service
      const result = enrollmentSystem.veteranToSaveSubmitForm(fakeApplication);
      // read in the base XSD file
      const xsdContents = fs.readFileSync('hca-api-stub/voa-voaSvc-xsd-2.xml', 'utf8');
      // we need to change directories because the xsd validator
      // loads a secondary file (voa-voaSvc-xsd-1.xml) by a path
      // relative to the process' cwd.
      process.chdir('./hca-api-stub');
      const schema = xsdValidator.parse(xsdContents);
      // reset the path
      process.chdir('../');

      // create a soap client
      soap.createClient(config.soap.wsdl, {}, (_soapError, client) => {
        // when the client sends a message, look at the body
        client.on('message', (messageBody) => {
          // validate the message body against the XSD schema
          schema.validate(messageBody, (_validationError, validationErrors) => {
            if (validationErrors.length > 0) {
              console.error(validationErrors);
            }
            validationErrors.should.be.empty;
            // tell chai that we're done
            done();
          });
        });
        // trigger the call
        client.saveSubmitForm(result, (_submitError, _result) => {});
      });
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
