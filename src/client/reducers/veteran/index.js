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
  nameAndGeneralInformation: {
    fullName: {
      first: makeField(''),
      middle: makeField(''),
      last: makeField(''),
      suffix: makeField(''),
    },
    mothersMaidenName: makeField(''),
    socialSecurityNumber: makeField(''),
    gender: makeField(''),
    cityOfBirth: makeField(''),
    stateOfBirth: makeField(''),
    dateOfBirth: {
      month: makeField(''),
      day: makeField(''),
      year: makeField(''),
    },
    maritalStatus: makeField('')
  },

  vaInformation: {
    isVaServiceConnected: makeField(''),
    compensableVaServiceConnected: makeField(''),
    receivesVaPension: makeField('')
  },

  additionalInformation: {
    isEssentialAcaCoverage: false,
    facilityState: makeField(''),
    vaMedicalFacility: makeField(''),
    wantsInitialVaContact: false
  },

  demographicInformation: {
    isSpanishHispanicLatino: false,
    isAmericanIndianOrAlaskanNative: false,
    isBlackOrAfricanAmerican: false,
    isNativeHawaiianOrOtherPacificIslander: false,
    isAsian: false,
    isWhite: false
  },

  veteranAddress: {
    address: {
      street: makeField(''),
      city: makeField(''),
      country: makeField(''),
      state: makeField(''),
      zipcode: makeField(''),
    },
    county: makeField(''),
    email: makeField(''),
    emailConfirmation: makeField(''),
    homePhone: makeField(''),
    mobilePhone: makeField('')
  },

  financialDisclosure: {
    provideFinancialInfo: false,
    understandsFinancialDisclosure: false
  },

  spouseInformation: {
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
    spousePhone: makeField('')
  },

  childInformation: {
    hasChildrenToReport: false,
    children: []
  },

  annualIncome: {
    veteranGrossIncome: makeField(''),
    veteranNetIncome: makeField(''),
    veteranOtherIncome: makeField(''),
    spouseGrossIncome: makeField(''),
    spouseNetIncome: makeField(''),
    spouseOtherIncome: makeField(''),
    children: []
  },

  deductibleExpenses: {
    deductibleMedicalExpenses: makeField(''),
    deductibleFuneralExpenses: makeField(''),
    deductibleEducationExpenses: makeField('')
  },

  insuranceInformation: {
    isCoveredByHealthInsurance: false,
    providers: []
  },

  medicareMedicaid: {
    isMedicaidEligible: false,
    isEnrolledMedicarePartA: false,
    medicarePartAEffectiveDate: {
      month: makeField(''),
      day: makeField(''),
      year: makeField('')
    }
  },

  serviceInformation: {
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
    dischargeType: makeField('')
  },

  militaryAdditionalInfo: {
    purpleHeartRecipient: false,
    isFormerPow: false,
    postNov111998Combat: false,
    disabledInLineOfDuty: false,
    swAsiaCombat: false,
    vietnamService: false,
    exposedToRadiation: false,
    radiumTreatments: false,
    campLejeune: false
  }
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
      newState.annualIncome.children.splice(newState.childInformation.children.length);
      for (let i = 0; i < newState.childInformation.children.length; i++) {
        if (newState.annualIncome.children[i] === undefined) {
          newState.annualIncome.children[i] = createBlankChild();
        }
      }
      Object.assign(pathToData(newState, action.path), dirtyAllFields(pathToData(newState, action.path)));
      return newState;

    default:
      return state;
  }
}

export default veteran;

