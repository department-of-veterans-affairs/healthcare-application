const validations = require('../../src/server/utils/validations');
const chai = require('chai');
chai.should();
describe.only('validations', () => {
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
});
