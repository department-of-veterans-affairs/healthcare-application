'use strict';
const moment = require('moment');
const _ = require('lodash');


module.exports = {
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

