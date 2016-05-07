import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { UPDATE_COMPLETED_STATUS, UPDATE_INCOMPLETE_STATUS, UPDATE_REVIEW_STATUS, UPDATE_VERIFIED_STATUS, UPDATE_SUBMISSION_STATUS } from '../../actions';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);


const ui = {
  applicationSubmitted: false,
  sections: {
    '/introduction': {
      complete: false,
      verified: false,
      fields: []
    },
    '/personal-information/name-and-general-information': {
      complete: false,
      verified: false,
      fields: ['veteranFullName', 'mothersMaidenName', 'veteranSocialSecurityNumber', 'gender', 'cityOfBirth', 'stateOfBirth', 'veteranDateOfBirth', 'maritalStatus']
    },
    '/personal-information/va-information': {
      complete: false,
      verified: false,
      fields: ['isVaServiceConnected', 'compensableVaServiceConnected', 'receivesVaPension']
    },
    '/personal-information/additional-information': {
      complete: false,
      verified: false,
      fields: ['isEssentialAcaCoverage', 'facilityState', 'vaMedicalFacility', 'wantsInitialVaContact']
    },
    '/personal-information/demographic-information': {
      complete: false,
      verified: false,
      fields: ['isSpanishHispanicLatino', 'isAmericanIndianOrAlaskanNative', 'isBlackOrAfricanAmerican', 'isNativeHawaiianOrOtherPacificIslander', 'isAsian', 'isWhite']
    },
    '/personal-information/veteran-address': {
      complete: false,
      verified: false,
      fields: ['veteranAddress', 'veteranCounty', 'email', 'emailConfirmation', 'homePhone', 'mobilePhone']
    },
    '/insurance-information/general': {
      complete: false,
      verified: false,
      fields: ['isCoveredByHealthInsurance', 'providers']
    },
    '/insurance-information/medicare-medicaid': {
      complete: false,
      verified: false,
      fields: ['isMedicaidEligible', 'isEnrolledMedicarePartA', 'medicarePartAEffectiveDate']
    },
    '/military-service/service-information': {
      complete: false,
      verified: false,
      fields: ['lastServiceBranch', 'lastEntryDate', 'lastDischargeDate', 'dischargeType']
    },
    '/military-service/additional-information': {
      complete: false,
      verified: false,
      fields: ['purpleHeartRecipient', 'isFormerPow', 'postNov111998Combat', 'disabledInLineOfDuty', 'swAsiaCombat', 'vietnamService', 'exposedToRadiation', 'radiumTreatments', 'campLejeune']
    },
    '/financial-assessment/financial-disclosure': {
      complete: false,
      verified: false,
      fields: ['provideFinancialInfo', 'understandsFinancialDisclosure']
    },
    '/financial-assessment/spouse-information': {
      completed: false,
      verified: false,
      fields: ['spouseFullName', 'spouseSocialSecurityNumber', 'spouseDateOfBirth', 'dateOfMarriage', 'sameAddress', 'cohabitedLastYear', 'provideSupportLastYear', 'spouseAddress', 'spousePhone']
    },
    '/financial-assessment/child-information': {
      complete: false,
      verified: false,
      fields: ['hasChildrenToReport', 'children']
    },
    '/financial-assessment/annual-income': {
      complete: false,
      verified: false,
      fields: ['veteranGrossIncome', 'veteranNetIncome', 'veteranOtherIncome', 'spouseGrossIncome', 'spouseNetIncome', 'spouseOtherIncome', 'childrenIncome']
    },
    '/financial-assessment/deductible-expenses': {
      complete: false,
      verified: false,
      fields: ['deductibleMedicalExpenses', 'deductibleFuneralExpenses', 'deductibleEducationExpenses']
    },
    '/review-and-submit': {
      complete: false,
      verified: false,
      fields: []
    }
  }
};

function uiState(state = ui, action) {
  let newState = undefined;
  switch (action.type) {
    case UPDATE_COMPLETED_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], true);
      return newState;

    case UPDATE_INCOMPLETE_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], false);
      return newState;

    case UPDATE_REVIEW_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'complete'], action.value);
      return newState;

    case UPDATE_VERIFIED_STATUS:
      newState = Object.assign({}, state);
      _.set(newState.sections, [action.path, 'verified'], action.value);
      return newState;

    case UPDATE_SUBMISSION_STATUS:
      newState = Object.assign({}, state);
      _.set(newState, action.field, true);
      return newState;

    default:
      return state;
  }
}

export default uiState;
