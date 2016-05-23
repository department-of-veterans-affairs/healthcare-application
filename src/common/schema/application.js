// Relocate options-for-select.
const options = require('../../client/utils/options-for-select');
const _ = require('lodash');

const states = _.uniq(_.flatten(_.values(options.states)).map(object => object.value));
const countries = options.countries.map(object => object.value);
const countriesWithAnyState = Object.keys(options.states).filter(x => _.includes(countries, x));
const countryStateProperites = _.map(options.states, (value, key) => ({
  properties: {
    country: {
      'enum': [key]
    },
    state: {
      'enum': value.map(x => x.value)
    },
  }
}));
countryStateProperites.push(
  {
    properties: {
      country: {
        not: {
          'enum': countriesWithAnyState
        }
      },
      state: {
        type: 'string'
      },
    },
  });

module.exports = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  definitions: {
    address: {
      type: 'object',
      oneOf: countryStateProperites,
      properties: {
        street: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        zipcode: {
          type: 'string'
        }
      },
      required: [
        'street',
        'city',
        'country',
        'state',
        'zipcode',
      ]
    },
    date: {
      format: 'date',
      type: 'string'
    },
    fullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string'
        },
        middle: {
          type: 'string'
        },
        last: {
          type: 'string'
        },
        suffix: {
          'enum': options.suffixes
        },
      },
      required: [
        'first',
        'last'
      ]
    },
    monetaryValue: {
      type: 'number',
      minimum: 0,
      maximum: 9999999.99,
    },
    phone: {
      type: 'string',
      pattern: '^[0-9]{10}$'
    },
    ssn: {
      oneOf: [
        {
          type: 'string',
          pattern: '^[0-9]{9}$'
        }, {
          type: 'string',
          pattern: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$'
        }
      ]
    },
  },
  type: 'object',
  properties: {
    veteranFullName: {
      $ref: '#/definitions/fullName'
    },
    mothersMaidenName: {
      type: 'string'
    },
    veteranSocialSecurityNumber: {
      $ref: '#/definitions/ssn'
    },
    gender: {
      'enum': options.genders.map(option => option.value)
    },
    cityOfBirth: {
      type: 'string'
    },
    stateOfBirth: {
      'enum': states
    },
    veteranDateOfBirth: {
      $ref: '#/definitions/date'
    },
    maritalStatus: {
      'enum': options.maritalStatuses
    },
    isVaServiceConnected: {
      type: 'boolean'
    },
    compensableVaServiceConnected: {
      type: 'boolean'
    },
    receivesVaPension: {
      type: 'boolean'
    },
    isEssentialAcaCoverage: {
      type: 'boolean'
    },
    vaMedicalFacility: {
      'enum': _.flatten(_.values(options.vaMedicalFacilities)).map(object => object.value)
    },
    wantsInitialVaContact: {
      type: 'boolean'
    },
    isSpanishHispanicLatino: {
      type: 'boolean'
    },
    isAmericanIndianOrAlaskanNative: {
      type: 'boolean'
    },
    isBlackOrAfricanAmerican: {
      type: 'boolean'
    },
    isNativeHawaiianOrOtherPacificIslander: {
      type: 'boolean'
    },
    isAsian: {
      type: 'boolean'
    },
    isWhite: {
      type: 'boolean'
    },
    veteranAddress: {
      $ref: '#/definitions/address'
    },
    email: {
      type: 'string',
      format: 'email'
    },
    homePhone: {
      $ref: '#/definitions/phone'
    },
    mobilePhone: {
      $ref: '#/definitions/phone'
    },
    provideFinancialInfo: {
      type: 'boolean'
    },
    understandsFinancialDisclosure: {
      type: 'boolean'
    },
    spouseFullName: {
      $ref: '#/definitions/fullName'
    },
    spouseSocialSecurityNumber: {
      $ref: '#/definitions/ssn'
    },
    spouseDateOfBirth: {
      $ref: '#/definitions/date'
    },
    dateOfMarriage: {
      $ref: '#/definitions/date'
    },
    sameAddress: {
      type: 'boolean'
    },
    cohabitedLastYear: {
      type: 'boolean'
    },
    provideSupportLastYear: {
      type: 'boolean'
    },
    spouseAddress: {
      $ref: '#/definitions/address'
    },
    spousePhone: {
      $ref: '#/definitions/phone'
    },
    children: {
      type: 'array'
    },
    veteranGrossIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    veteranNetIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    veteranOtherIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseGrossIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseNetIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    spouseOtherIncome: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleMedicalExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleFuneralExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    deductibleEducationExpenses: {
      $ref: '#/definitions/monetaryValue'
    },
    isCoveredByHealthInsurance: {
      type: 'boolean'
    },
    isMedicaidEligible: {
      type: 'boolean'
    },
    isEnrolledMedicarePartA: {
      type: 'boolean'
    },
    medicarePartAEffectiveDate: {
      $ref: '#/definitions/date'
    },
    lastServiceBranch: {
      'enum': options.branchesServed.map(option => option.value)
    },
    lastEntryDate: {
      $ref: '#/definitions/date'
    },
    lastDischargeDate: {
      $ref: '#/definitions/date'
    },
    dischargeType: {
      'enum': options.dischargeTypes.map(option => option.value)
    },
    purpleHeartRecipient: {
      type: 'boolean'
    },
    isFormerPow: {
      type: 'boolean'
    },
    postNov111998Combat: {
      type: 'boolean'
    },
    disabledInLineOfDuty: {
      type: 'boolean'
    },
    swAsiaCombat: {
      type: 'boolean'
    },
    vietnamService: {
      type: 'boolean'
    },
    exposedToRadiation: {
      type: 'boolean'
    },
    radiumTreatments: {
      type: 'boolean'
    },
    campLejeune: {
      type: 'boolean'
    }
  }
};
