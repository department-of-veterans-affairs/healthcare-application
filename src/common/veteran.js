'use strict';  // eslint-disable-line
// Veteran resource prototype objects. In common so server unittests can access.

const fields = require('./fields');
const makeField = fields.makeField;

// TODO: Remove providers and children if checkbox within section is unchecked
const blankVeteran = {
  veteranFullName: {
    first: makeField(''),
    middle: makeField(''),
    last: makeField(''),
    suffix: makeField(''),
  },
  mothersMaidenName: makeField(''),
  veteranSocialSecurityNumber: makeField(''),
  gender: makeField(''),
  cityOfBirth: makeField(''),
  stateOfBirth: makeField(''),
  veteranDateOfBirth: {
    month: makeField(''),
    day: makeField(''),
    year: makeField(''),
  },
  maritalStatus: makeField(''),

  isVaServiceConnected: makeField(''),
  compensableVaServiceConnected: makeField(''),  // TODO(awong): Ignored by ES System
  receivesVaPension: makeField(''),  // TODO(awong): Ignored by ES System

  isEssentialAcaCoverage: false,
  facilityState: makeField(''),  // TODO(awong): Ignored by ES System
  vaMedicalFacility: makeField(''),
  wantsInitialVaContact: false,

  isSpanishHispanicLatino: false,
  isAmericanIndianOrAlaskanNative: false,
  isBlackOrAfricanAmerican: false,
  isNativeHawaiianOrOtherPacificIslander: false,
  isAsian: false,
  isWhite: false,

  veteranAddress: {
    street: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    zipcode: makeField(''),
  },
  email: makeField(''),
  emailConfirmation: makeField(''),  // TODO(awong): Ignored by ES System
  homePhone: makeField(''),
  mobilePhone: makeField(''),

  provideFinancialInfo: makeField(''),  // TODO(awong): Ignored by ES System
  understandsFinancialDisclosure: makeField(''),  // TODO(awong): Ignored by ES System

  spouseFullName: {
    first: makeField(''),
    middle: makeField(''),
    last: makeField(''),
    suffix: makeField(''),
  },
  spouseSocialSecurityNumber: makeField(''),
  spouseDateOfBirth: {
    month: makeField(''),
    day: makeField(''),
    year: makeField(''),
  },
  dateOfMarriage: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },
  sameAddress: makeField(''),  // TODO(awong): Not sure how to handle the mapping.
  cohabitedLastYear: makeField('N'),  // TODO(awong): This name should be scoped to spouse.
  provideSupportLastYear: makeField(''),  // TODO(awong): This name should be scoped to spouse.
  spouseAddress: {
    street: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    zipcode: makeField(''),
  },
  spousePhone: makeField(''),

  hasChildrenToReport: makeField(''),
  children: [],

  veteranGrossIncome: makeField(''),
  veteranNetIncome: makeField(''),
  veteranOtherIncome: makeField(''),
  spouseGrossIncome: makeField(''),
  spouseNetIncome: makeField(''),
  spouseOtherIncome: makeField(''),

  deductibleMedicalExpenses: makeField(''),
  deductibleFuneralExpenses: makeField(''),
  deductibleEducationExpenses: makeField(''),

  isCoveredByHealthInsurance: makeField(''),  // TODO(awong): Ignored by ES System
  providers: [],

  isMedicaidEligible: makeField(''),
  isEnrolledMedicarePartA: makeField(''),
  medicarePartAEffectiveDate: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },

  lastServiceBranch: makeField(''),
  lastEntryDate: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },
  lastDischargeDate: {
    month: makeField(''),
    day: makeField(''),
    year: makeField('')
  },
  dischargeType: makeField(''),

  purpleHeartRecipient: false,
  isFormerPow: false,
  postNov111998Combat: false,  // TODO(awong): Verify against e-mail.
  disabledInLineOfDuty: false,  // TODO(awong): Verify against e-mail.
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false

};

const completeVeteran = {
  veteranFullName: {
    first: {
      value: 'FirstName',
      dirty: true
    },
    middle: {
      value: '',
      dirty: true
    },
    last: {
      value: 'LastName',
      dirty: true
    },
    suffix: {
      value: '',
      dirty: true
    }
  },
  mothersMaidenName: {
    value: '',
    dirty: true
  },
  veteranSocialSecurityNumber: {
    value: '111-11-1234',
    dirty: true
  },
  gender: {
    value: 'F',
    dirty: true
  },
  cityOfBirth: {
    value: '',
    dirty: true
  },
  stateOfBirth: {
    value: '',
    dirty: true
  },
  veteranDateOfBirth: {
    month: {
      value: '1',
      dirty: true
    },
    day: {
      value: '2',
      dirty: true
    },
    year: {
      value: '1923',
      dirty: true
    }
  },
  maritalStatus: {
    value: 'Never Married',
    dirty: false
  },
  isVaServiceConnected: {
    value: 'N',
    dirty: true
  },
  compensableVaServiceConnected: {
    value: 'N',
    dirty: true
  },
  receivesVaPension: {
    value: 'N',
    dirty: true
  },
  isEssentialAcaCoverage: false,
  facilityState: {
    value: 'CT',
    dirty: true
  },
  vaMedicalFacility: {
    value: '689A4',
    dirty: true
  },
  wantsInitialVaContact: false,
  isSpanishHispanicLatino: false,
  isAmericanIndianOrAlaskanNative: false,
  isBlackOrAfricanAmerican: false,
  isNativeHawaiianOrOtherPacificIslander: false,
  isAsian: false,
  isWhite: false,
  veteranAddress: {
    street: {
      value: '123 NW 5th St',
      dirty: true
    },
    city: {
      value: 'Washington',
      dirty: true
    },
    country: {
      value: 'USA',
      dirty: true
    },
    state: {
      value: 'DC',
      dirty: true
    },
    zipcode: {
      value: '20005',
      dirty: true
    }
  },
  email: {
    value: '',
    dirty: false
  },
  emailConfirmation: {
    value: '',
    dirty: false
  },
  homePhone: {
    value: '',
    dirty: false
  },
  mobilePhone: {
    value: '',
    dirty: false
  },
  provideFinancialInfo: {
    value: 'Y',
    dirty: true
  },
  understandsFinancialDisclosure: {
    value: '',
    dirty: false
  },
  spouseFullName: {
    first: {
      value: '',
      dirty: false
    },
    middle: {
      value: '',
      dirty: false
    },
    last: {
      value: '',
      dirty: false
    },
    suffix: {
      value: '',
      dirty: false
    }
  },
  spouseSocialSecurityNumber: {
    value: '',
    dirty: false
  },
  spouseDateOfBirth: {
    month: {
      value: '',
      dirty: false
    },
    day: {
      value: '',
      dirty: false
    },
    year: {
      value: '',
      dirty: false
    }
  },
  dateOfMarriage: {
    month: {
      value: '',
      dirty: false
    },
    day: {
      value: '',
      dirty: false
    },
    year: {
      value: '',
      dirty: false
    }
  },
  sameAddress: {
    value: '',
    dirty: false
  },
  cohabitedLastYear: {
    value: '',
    dirty: false
  },
  provideSupportLastYear: {
    value: '',
    dirty: false
  },
  spouseAddress: {
    street: {
      value: '',
      dirty: false
    },
    city: {
      value: '',
      dirty: false
    },
    country: {
      value: '',
      dirty: false
    },
    state: {
      value: '',
      dirty: false
    },
    zipcode: {
      value: '',
      dirty: false
    }
  },
  spousePhone: {
    value: '',
    dirty: false
  },
  hasChildrenToReport: {
    value: 'N',
    dirty: false
  },
  children: [],
  veteranGrossIncome: {
    value: '',
    dirty: true
  },
  veteranNetIncome: {
    value: '',
    dirty: true
  },
  veteranOtherIncome: {
    value: '',
    dirty: true
  },
  spouseGrossIncome: {
    value: '',
    dirty: true
  },
  spouseNetIncome: {
    value: '',
    dirty: true
  },
  spouseOtherIncome: {
    value: '',
    dirty: true
  },
  deductibleMedicalExpenses: {
    value: '',
    dirty: true
  },
  deductibleFuneralExpenses: {
    value: '',
    dirty: true
  },
  deductibleEducationExpenses: {
    value: '',
    dirty: true
  },
  isCoveredByHealthInsurance: {
    value: 'N',
    dirty: true
  },
  providers: [],
  isMedicaidEligible: {
    value: 'N',
    dirty: true
  },
  isEnrolledMedicarePartA: {
    value: 'N',
    dirty: true
  },
  medicarePartAEffectiveDate: {
    month: {
      value: '',
      dirty: true
    },
    day: {
      value: '',
      dirty: true
    },
    year: {
      value: '',
      dirty: true
    }
  },
  lastServiceBranch: {
    value: 'merchant seaman',
    dirty: true
  },
  lastEntryDate: {
    month: {
      value: '3',
      dirty: true
    },
    day: {
      value: '7',
      dirty: true
    },
    year: {
      value: '1980',
      dirty: true
    }
  },
  lastDischargeDate: {
    month: {
      value: '7',
      dirty: true
    },
    day: {
      value: '8',
      dirty: true
    },
    year: {
      value: '1984',
      dirty: true
    }
  },
  dischargeType: {
    value: 'general',
    dirty: true
  },
  purpleHeartRecipient: false,
  isFormerPow: false,
  postNov111998Combat: false,
  disabledInLineOfDuty: false,
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false
};

function veteranToApplication(veteran) {
  return JSON.stringify(veteran, (key, value) => {

    // Remove properties that are not interesting to the API.
    switch (key) {
      case 'emailConfirmation':
      case 'hasChildrenToReport':
        return undefined;

      default:
        // fall through.
    }

    switch (key) {
      // Convert radio buttons into booleans.
      case 'isVaServiceConnected':
      case 'compensableVaServiceConnected':
      case 'provideSupportLastYear':
      case 'receivesVaPension':
      case 'provideFinancialInfo':
      case 'understandsFinancialDisclosure':
      case 'sameAddress':
      case 'cohabitedLastYear':
      case 'isCoveredByHealthInsurance':
      case 'isMedicaidEligible':
      case 'isEnrolledMedicarePartA':
        return value.value === 'Y';

      case 'childEducationExpenses':
      case 'deductibleEducationExpenses':
      case 'deductibleFuneralExpenses':
      case 'deductibleMedicalExpenses':
      case 'grossIncome':
      case 'netIncome':
      case 'otherIncome':
      case 'spouseGrossIncome':
      case 'spouseNetIncome':
      case 'spouseOtherIncome':
      case 'veteranGrossIncome':
      case 'veteranNetIncome':
      case 'veteranOtherIncome':
        return Number(value.value);

      // Optional Date fields
      case 'spouseDateOfBirth':
      case 'dateOfMarriage':
      case 'medicarePartAEffectiveDate':
        if (value.day.value === '' && value.month.value === '' && value.year.value === '') {
          return undefined;
        }
        break;

      // Optional String fields
      case 'spouseSocialSecurityNumber':
      case 'cityOfBirth':
      case 'stateOfBirth':
      case 'email':
      case 'homePhone':
      case 'mobilePhone':
      case 'spousePhone':
        if (value.value === '') {
          return undefined;
        }
        break;

      // case 'veteranFullName':
      // case 'spouseFullName':
      //   if (value.suffix.value === '') {
      //     value.suffix.value = undefined;
      //   }
      //   return value;

      default:
        // fall through.
    }

    // Turn date fields into ISO8601 dates. Doing this manually because the format is constricted
    // enough that going through the Javascript Date object has no real benefit and instead
    // just inserts runtime envrionment compatibility concerns with whether or not the date is
    // read as localtime or UTC.
    //
    // Testing of this is tricky as it will only be noticeable if the runtime has different
    // timezone from expectation and tests are run at a time of day where there might be
    // an issue.
    if (value.day !== undefined && value.month !== undefined && value.year !== undefined) {
      let iso8601date = value.year.value;
      iso8601date += '-';
      if (parseInt(value.month.value, 10) < 10) {
        iso8601date += '0';
      }
      iso8601date += value.month.value;

      iso8601date += '-';
      if (parseInt(value.day.value, 10) < 10) {
        iso8601date += '0';
      }
      iso8601date += value.day.value;

      return iso8601date;
    }

    // Strip all the dirty flags out of the veteran and flatted it into a single atomic value.
    // Do this last in the sequence as a sweep of all remaining objects that are not special cased.
    if (value.value !== undefined && value.dirty !== undefined) {
      return value.value;
    }

    console.log(value);
    return value;
  });
}

module.exports = { blankVeteran, completeVeteran, veteranToApplication };
