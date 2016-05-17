const validations = require('../../../src/server/utils/validations');
const chai = require('chai');
chai.should();

describe('validations', () => {
  describe('dateOfBirth', () => {
    describe('should return an empty string', () => {
      it('if the date passed is an empty string', () => {
        const convertedDate = validations.dateOfBirth('');
        convertedDate.should.be.a('string');
        convertedDate.should.be.empty;
      });
      it('if the date passed in is an array', () => {
        const convertedDate = validations.dateOfBirth(['dec 1, 2016']);
        convertedDate.should.be.a('string');
        convertedDate.should.be.empty;
      });
      it('if the date passed in is a number', () => {
        const convertedDate = validations.dateOfBirth(12345);
        convertedDate.should.be.a('string');
        convertedDate.should.be.empty;
      });
      it('if the date passed in is a string after today', () => {
        const convertedDate = validations.dateOfBirth('dec 1, 2016');
        convertedDate.should.be.a('string');
        convertedDate.should.be.empty;
      });
    });
    describe('should return a validated string', () => {
      it('if the date passed in is a string before today', () => {
        const convertedDate = validations.dateOfBirth('dec 1, 1974');
        convertedDate.should.be.a('string');
        convertedDate.should.be.equal('12/01/1974');
      });
    });
  });
  describe('validateString', () => {
    describe('should return an empty string', () => {
      it('if the data passed is an empty string', () => {
        const convertedData = validations.validateString('');
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in is an array', () => {
        const convertedData = validations.validateString(['firstName']);
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in is a number', () => {
        const convertedData = validations.validateString(12345);
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
    });
    describe('should return a validated string', () => {
      it('if the valid string that is passed in we should get converted string', () => {
        const convertedData = validations.validateString('firstName');
        convertedData.should.be.a('string');
        convertedData.should.be.equal('FirstName');
      });
      it('if the valid string and a count is passed in we should get converted string', () => {
        const convertedData = validations.validateString('firstName', 30);
        convertedData.should.be.a('string');
        convertedData.should.be.equal('FirstName');
      });
      it('if the valid string and a count is passed in we should get converted string', () => {
        const convertedData = validations.validateString('firstNameIsLonger', 9);
        convertedData.should.be.a('string');
        convertedData.should.be.equal('FirstName');
      });
    });
    describe('should return null', () => {
      it('if the string is empty and true is passed to the third parameter', () => {
        chai.expect(validations.validateString('', null, true)).to.be.null;
      });
    });
  });
  describe('validateSsn', () => {
    describe('should return an empty string', () => {
      it('if the data passed is an empty string', () => {
        const convertedData = validations.validateSsn('');
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in is an array', () => {
        const convertedData = validations.validateSsn(['1234567890']);
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in is a number', () => {
        const convertedData = validations.validateSsn(12345);
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in is 9 of the same number', () => {
        const convertedData = validations.validateSsn(111111111);
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
      it('if the data passed in starts with 3 0s', () => {
        const convertedData = validations.validateSsn('000111111');
        convertedData.should.be.a('string');
        convertedData.should.be.empty;
      });
    });
    describe('should return a validated SSN', () => {
      it('if the valid string that is passed in we should get converted string', () => {
        const convertedData = validations.validateSsn('210438765');
        convertedData.should.be.a('string');
        convertedData.should.be.equal('210438765');
      });
      it('if the valid string with hyphens', () => {
        const convertedData = validations.validateSsn('210-43-8765');
        convertedData.should.be.a('string');
        convertedData.should.be.equal('210438765');
      });
      it('if the string passed in is more then 9 numbers', () => {
        const convertedData = validations.validateSsn('1112233334444');
        convertedData.should.be.a('string');
        convertedData.should.be.equal('');
      });
    });
  });
});
