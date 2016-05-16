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
    const upperFirstData = _.upperFirst(data);
    if (count && _.isNumber(count)) {
      return (upperFirstData.length > count) ? upperFirstData.slice(0, count) : upperFirstData;
    }
    return upperFirstData;
  }
};
