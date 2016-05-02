import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, UPDATE_SPOUSE_ADDRESS, CREATE_CHILD_INCOME_FIELDS } from '../../actions';
import { makeField, dirtyAllFields } from '../fields';
import { pathToData } from '../../store';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

// TODO(awong): This structure should reflect a logical data model for a veteran. Currently it
// mirrors the UI stricture too much.

// TODO: Remove providers and children if checkbox within section is unchecked
const blankVeteran = {
  fullName: {
    first: makeField(''),
    middle: makeField(''),
    last: makeField(''),
    suffix: makeField(''),
  },
  socialSecurityNumber: makeField(''),
  dateOfBirth: {
    month: makeField(''),
    day: makeField(''),
    year: makeField(''),
  },

  mothersMaidenName: makeField(''),
  gender: makeField(''),
  cityOfBirth: makeField(''),
  stateOfBirth: makeField(''),
  maritalStatus: makeField(''),

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
  veteranEmail: makeField(''),
  veteranEmailConfirmation: makeField(''),
  veteranHomePhone: makeField(''),
  veteranMobilePhone: makeField(''),

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
  campLejeune: false,

  isVaServiceConnected: makeField(''),
  compensableVaServiceConnected: makeField(''),
  receivesVaPension: makeField(''),

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

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: makeField(''),
    vaMedicalFacility: makeField(''),
    wantsInitialVaContact: false
  },

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

  // This information was not in the new structure.
  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false
  },

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
      // TODO(awong): HACK! Assigning to the sub object assumes pathToData() returns a reference
      // to the actual substructre such that it can be reassigned to.
      Object.assign(pathToData(newState, action.path), dirtyAllFields(pathToData(newState, action.path)));
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
      Object.assign(pathToData(newState, action.path), dirtyAllFields(pathToData(newState, action.path)));
      return newState;

    default:
      return state;
  }
}

export default veteran;

