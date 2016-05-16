'use strict'; // eslint-disable-line
const moment = require('moment');
const _ = require('lodash');

const validations = {
  /**
   * Validate a string as and convert to a valid format.
   * @param {string} inputDob The date of birth string to validate / convert.
   * @returns {string} If input was valid a valid SSN if not valid an empty string.
   */
  dateOfBirth: (inputDob) => {
    let convertedDob = '';
    if (_.isEmpty(inputDob) || !_.isString(inputDob)) {
      return convertedDob;
    }
    const parsedDob = new Date(inputDob);
    if (moment().isBefore(parsedDob)) {
      return convertedDob;
    }
    convertedDob = moment(parsedDob).format('MM/DD/YYYY');
    return convertedDob;
  },
  /**
   * Validate a string, that isn't empty and with conditional logic for
   * trimming to a specific length or if the data is nullable.
   * @param {string} data The string to validated.
   * @param {number} count The character count for the length of the data param.
   * @param {boolean} nullable The param for allowing if the data past in is nullable.
   */
  validateString: (data, count, nullable) => {
    if (nullable && _.isEmpty(data)) {
      return null;
    }
    if (_.isEmpty(data) || !_.isString(data)) {
      return '';
    }
    const validatedString = _.upperFirst(data);
    if (count && _.isNumber(count)) {
      return (validatedString.length > count) ? validatedString.slice(0, count) : validatedString;
    }
    return validatedString;
  },
  /**
   * Validate a string or number to meet the requirements offrom the original
   * 1010ez pdf form.
   * Conditions for valid SSN :
   * '123456789' is not a valid SSN
   * A value where the first 3 digits are 0 is not a valid SSN
   * A value where the 4th and 5th digits are 0 is not a valid SSN
   * A value where the last 4 digits are 0 is not a valid SSN
   * A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
   * 9 of the same digits (e.g., '111111111') is not a valid SSN
   * @param {string|number} inputSsn The Social Security Number to validate.
   * @returns {string} The 9 number SSN or empty string.
   */
  validateSsn: (inputSsn) => {
    const validatedSsn = _.replace(inputSsn, /\D+/g, '');
    if (validatedSsn.length !== 9
      || (/^\d{3}-?\d{2}-?0{4}$/.test(validatedSsn)) ||
      (/1{9}|2{9}|3{9}|4{9}|5{9}|6{9}|7{9}|8{9}|9{9}/.test(validatedSsn)) ||
      (/^0{3}-?\d{2}-?\d{4}$/.test(validatedSsn)) || (/^\d{3}-?0{2}-?\d{4}$/.test(validatedSsn))
      ) {
      return '';
    }
    return validatedSsn;
  }
};
module.exports = validations;
