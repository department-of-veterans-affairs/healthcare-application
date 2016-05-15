'use strict';
const moment = require('moment');
const _ = require('lodash');
module.exports = {
  dateOfBirth: (inputDob) => {
    let parsedDob = '';
    let convertedDob = '';
    if (_.isEmpty(inputDob) || !_.isString(inputDob)) {
      return convertedDob;
    }
    parsedDob = new Date(inputDob);
    if (moment().isBefore(parsedDob)) {
      return convertedDob;
    }
    convertedDob = moment(parsedDob).format('MM/DD/YYYY');
    return convertedDob;
  }
};
