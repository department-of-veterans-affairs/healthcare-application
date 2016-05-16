import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import { ENSURE_FIELDS_INITIALIZED, VETERAN_FIELD_UPDATE, VETERAN_OVERWRITE, UPDATE_SPOUSE_ADDRESS, CREATE_CHILD_INCOME_FIELDS } from '../../actions';
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

  provideFinancialInfo: makeField(''),
  understandsFinancialDisclosure: makeField(''),

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
  sameAddress: makeField(''),
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
  postNov111998Combat: false,
  disabledInLineOfDuty: false,
  swAsiaCombat: false,
  vietnamService: false,
  exposedToRadiation: false,
  radiumTreatments: false,
  campLejeune: false

};

export const completeVeteran = {
  veteranFullName: {
    first: {
      value: 'FirstName',
      dirty: true
    },
    middle: {
      value: 'MiddleName',
      dirty: true
    },
    last: {
      value: 'LastName',
      dirty: true
    },
    suffix: {
      value: 'Jr.',
      dirty: true
    }
  },
  mothersMaidenName: {
    value: 'Maiden',
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
    value: 'Springfield',
    dirty: true
  },
  stateOfBirth: {
    value: 'AK',
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
    value: 'Married',
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
    value: 'Y',
    dirty: true
  },
  isEssentialAcaCoverage: true,
  facilityState: {
    value: 'CT',
    dirty: true
  },
  vaMedicalFacility: {
    value: '689A4',
    dirty: true
  },
  wantsInitialVaContact: true,
  isSpanishHispanicLatino: true,
  isAmericanIndianOrAlaskanNative: true,
  isBlackOrAfricanAmerican: true,
  isNativeHawaiianOrOtherPacificIslander: true,
  isAsian: true,
  isWhite: true,
  veteranAddress: {
    street: {
      value: '123 NW 5th St',
      dirty: false
    },
    city: {
      value: 'Washington',
      dirty: false
    },
    country: {
      value: 'USA',
      dirty: false
    },
    state: {
      value: 'DC',
      dirty: false
    },
    zipcode: {
      value: '20005',
      dirty: false
    }
  },
  veteranCounty: {
    value: 'USA',
    dirty: true
  },
  email: {
    value: 'foo@example.com',
    dirty: false
  },
  emailConfirmation: {
    value: 'foo@example.com',
    dirty: false
  },
  homePhone: {
    value: '1231241234',
    dirty: false
  },
  mobilePhone: {
    value: '1235551234',
    dirty: false
  },
  provideFinancialInfo: true,
  understandsFinancialDisclosure: true,
  spouseFullName: {
    first: {
      value: 'FirstSpouse',
      dirty: true
    },
    middle: {
      value: 'MiddleSpouse',
      dirty: true
    },
    last: {
      value: 'LastSpouse',
      dirty: true
    },
    suffix: {
      value: 'Sr.',
      dirty: true
    }
  },
  spouseSocialSecurityNumber: {
    value: '111-22-1234',
    dirty: true
  },
  spouseDateOfBirth: {
    month: {
      value: '4',
      dirty: true
    },
    day: {
      value: '6',
      dirty: true
    },
    year: {
      value: '1987',
      dirty: true
    }
  },
  dateOfMarriage: {
    month: {
      value: '5',
      dirty: true
    },
    day: {
      value: '10',
      dirty: true
    },
    year: {
      value: '1983',
      dirty: true
    }
  },
  sameAddress: true,
  cohabitedLastYear: true,
  provideSupportLastYear: false,
  spousePhone: {
    value: '',
    dirty: false
  },
  hasChildrenToReport: true,
  children: [
    {
      childFullName: {
        first: {
          value: 'FirstChildA',
          dirty: true
        },
        middle: {
          value: 'MiddleChildA',
          dirty: true
        },
        last: {
          value: 'LastChildA',
          dirty: true
        },
        suffix: {
          value: '',
          dirty: true
        }
      },
      childRelation: {
        value: 'Stepson',
        dirty: true
      },
      childSocialSecurityNumber: {
        value: '111-22-9876',
        dirty: true
      },
      childBecameDependent: {
        month: {
          value: '4',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '1992',
          dirty: true
        }
      },
      childDateOfBirth: {
        month: {
          value: '5',
          dirty: true
        },
        day: {
          value: '5',
          dirty: true
        },
        year: {
          value: '1982',
          dirty: true
        }
      },
      childDisabledBefore18: true,
      childAttendedSchoolLastYear: true,
      childEducationExpenses: {
        value: '45.2',
        dirty: true
      },
      childCohabitedLastYear: true,
      childReceivedSupportLastYear: false,
      key: 'key-128'
    },
    {
      childFullName: {
        first: {
          value: 'FirstChildB',
          dirty: true
        },
        middle: {
          value: 'MiddleChildB',
          dirty: true
        },
        last: {
          value: 'LastChildB',
          dirty: true
        },
        suffix: {
          value: 'Sr.',
          dirty: true
        }
      },
      childRelation: {
        value: 'Stepdaughter',
        dirty: true
      },
      childSocialSecurityNumber: {
        value: '222-11-1234',
        dirty: true
      },
      childBecameDependent: {
        month: {
          value: '4',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '2003',
          dirty: true
        }
      },
      childDateOfBirth: {
        month: {
          value: '3',
          dirty: true
        },
        day: {
          value: '7',
          dirty: true
        },
        year: {
          value: '1996',
          dirty: true
        }
      },
      childDisabledBefore18: false,
      childAttendedSchoolLastYear: true,
      childEducationExpenses: {
        value: '1198.11',
        dirty: true
      },
      childCohabitedLastYear: false,
      childReceivedSupportLastYear: true,
      key: 'key-149'
    }
  ],
  veteranGrossIncome: {
    value: '123.33',
    dirty: true
  },
  veteranNetIncome: {
    value: '90.11',
    dirty: true
  },
  veteranOtherIncome: {
    value: '10.1',
    dirty: true
  },
  spouseGrossIncome: {
    value: '64.1',
    dirty: true
  },
  spouseNetIncome: {
    value: '35.1',
    dirty: true
  },
  spouseOtherIncome: {
    value: '12.3',
    dirty: true
  },
  childrenIncome: [],
  deductibleMedicalExpenses: {
    value: '33.3',
    dirty: true
  },
  deductibleFuneralExpenses: {
    value: '44.44',
    dirty: true
  },
  deductibleEducationExpenses: {
    value: '77.77',
    dirty: true
  },
  isCoveredByHealthInsurance: true,
  providers: [
    {
      insuranceName: {
        value: 'MyInsruance',
        dirty: true
      },
      insurancePolicyHolderName: {
        value: 'FirstName LastName',
        dirty: true
      },
      insurancePolicyNumber: {
        value: 'P1234',
        dirty: true
      },
      insuranceGroupCode: {
        value: 'G1234',
        dirty: true
      },
      key: 'key-174'
    }
  ],
  isMedicaidEligible: true,
  isEnrolledMedicarePartA: false,
  medicarePartAEffectiveDate: {
    month: {
      value: '10',
      dirty: true
    },
    day: {
      value: '16',
      dirty: true
    },
    year: {
      value: '1999',
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
  isFormerPow: true,
  postNov111998Combat: true,
  disabledInLineOfDuty: true,
  swAsiaCombat: true,
  vietnamService: true,
  exposedToRadiation: true,
  radiumTreatments: true,
  campLejeune: true
};

function createBlankChild() {
  return {
    childGrossIncome: makeField(''),
    childNetIncome: makeField(''),
    childOtherIncome: makeField('')
  };
}

export default function veteran(state = blankVeteran, action) {
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

    case VETERAN_OVERWRITE:
      return action.value;

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
      if (action.value.value === 'Y') {
        _.set(newState, action.propertyPath, state.veteranAddress);
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
