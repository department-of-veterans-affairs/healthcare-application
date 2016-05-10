import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, UPDATE_SPOUSE_ADDRESS, CREATE_CHILD_INCOME_FIELDS } from '../../actions';
import { makeField, dirtyAllFields } from '../fields';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

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
  compensableVaServiceConnected: makeField(''),
  receivesVaPension: makeField(''),

  isEssentialAcaCoverage: false,
  facilityState: makeField(''),
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
  veteranCounty: makeField(''),
  email: makeField(''),
  emailConfirmation: makeField(''),
  homePhone: makeField(''),
  mobilePhone: makeField(''),

  provideFinancialInfo: false,
  understandsFinancialDisclosure: false,

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
  sameAddress: false,
  cohabitedLastYear: false,
  provideSupportLastYear: false,
  spouseAddress: {
    street: makeField(''),
    city: makeField(''),
    country: makeField(''),
    state: makeField(''),
    zipcode: makeField(''),
  },
  spousePhone: makeField(''),

  hasChildrenToReport: false,
  children: [],

  veteranGrossIncome: makeField(''),
  veteranNetIncome: makeField(''),
  veteranOtherIncome: makeField(''),
  spouseGrossIncome: makeField(''),
  spouseNetIncome: makeField(''),
  spouseOtherIncome: makeField(''),
  childrenIncome: [],

  deductibleMedicalExpenses: makeField(''),
  deductibleFuneralExpenses: makeField(''),
  deductibleEducationExpenses: makeField(''),

  isCoveredByHealthInsurance: false,
  providers: [],

  isMedicaidEligible: false,
  isEnrolledMedicarePartA: false,
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
  postNov111998Combat: false,
  disabledInLineOfDuty: false,
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false

};

function createBlankChild() {
  return {
    childGrossIncome: makeField(''),
    childNetIncome: makeField(''),
    childOtherIncome: makeField('')
  };
}

function veteran(state = blankVeteran, action) {
  let newState = undefined;
  switch (action.type) {
    case VETERAN_FIELD_UPDATE: {
      newState = Object.assign({}, state);
      _.set(newState, action.propertyPath, action.value);
      return newState;
    }

    case ENSURE_FIELDS_INITIALIZED: {
      newState = Object.assign({}, state);

      if (action.parentNode) {
        action.fields.map((field) => {
          Object.assign(newState[action.parentNode][0][field], dirtyAllFields(newState[action.parentNode][0][field]));
          return newState;
        });
      } else {
        action.fields.map((field) => {
          Object.assign(newState[field], dirtyAllFields(newState[field]));
          return newState;
        });
      }

      return newState;
    }

    // Copies the veteran's address into the spouse's address fields if they have the same address.
    // Clears the spouse's address fields if they do not.
    case UPDATE_SPOUSE_ADDRESS: {
      newState = Object.assign({}, state);
      const emptyAddress = {
        street: makeField(''),
        city: makeField(''),
        country: makeField(''),
        state: makeField(''),
        zipcode: makeField(''),
      };
      if (action.value) {
        _.set(newState, action.propertyPath, state.veteranAddress.address);
      } else {
        _.set(newState, action.propertyPath, emptyAddress);
      }
      return newState;
    }

    case CREATE_CHILD_INCOME_FIELDS:
      newState = Object.assign({}, state);
      // update children income from children info
      newState.childrenIncome.splice(newState.children.length);
      for (let i = 0; i < newState.children.length; i++) {
        if (newState.childrenIncome[i] === undefined) {
          newState.childrenIncome[i] = createBlankChild();
        }
      }

      Object.assign(newState.childrenIncome, dirtyAllFields(newState.childrenIncome));
      return newState;

    default:
      return state;
  }
}

export default veteran;

