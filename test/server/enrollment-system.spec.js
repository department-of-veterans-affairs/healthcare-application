const chai = require('chai');
chai.should();

const enrollmentSystem = require('../../src/server/enrollment-system');
const veteran = require('../../src/common/veteran');

const goldenFormOutput = {
  form: {
    formIdentifier: {
      type: '100',
      value: '1010EZ',
    },
    summary: {
      demographics: {
        appointmentRequestResponse: 'true',
        contactInfo: {
          addresses: {
            address: {
              city: 'Washington',
              country: 'USA',
              line1: '123 NW 5th St',
              state: 'DC',
              zipCode: '20005',
              addressTypeCode: 'P',
            },
            emails: {
              email: 'foo@example.com',
            },
            phones: {
              phone: {
                phoneNumber: '1235551234',
                type: '4',
              }
            }
          }
        },
        ethnicity: '2135-2',
        maritalStatus: 'M',
        preferredFacility: '689A4',
        races: [
          '1002-5',
          '2028-9',
          '2054-5',
          '2076-8',
          '2106-3',
        ],
        acaIndicator: 'true',
      },
      enrollmentDeterminationInfo: {
        eligibleForMedicaid: 'true',
        noseThroatRadiumInfo: {
          receivingTreatment: 'true',
        },
        serviceConnectionAward: {
          serviceConnectedIndicator: 'false',
        },
        specialFactors: {
          agentOrangeInd: 'true',
          envContaminantsInd: 'true',
          campLejeuneInd: 'true',
          radiationExposureInd: 'true',
        }
      },
      financialsInfo: {
        financialStatement: {
          dependentFinancialsList: [
            {
              dependentFinancials: {
                attendedSchool: 'true',
                contributedToSupport: 'false',
                dependentInfo: {
                  dob: '05/05/1982',
                  familyName: 'LastChildA',
                  givenName: 'FirstChildA',
                  middleName: 'MiddleChildA',
                  relationship: '5',
                  ssns: {
                    ssnText: '111229876',
                  },
                  suffix: '',
                },
                incapableOfSelfSupport: 'true',
              }
            },
            {
              dependentFinancials: {
                attendedSchool: 'true',
                contributedToSupport: 'true',
                dependentInfo: {
                  dob: '03/07/1996',
                  familyName: 'LastChildB',
                  givenName: 'FirstChildB',
                  middleName: 'MiddleChildB',
                  relationship: '6',
                  ssns: {
                    ssnText: '222111234',
                  },
                  suffix: 'Sr.',
                },
                incapableOfSelfSupport: 'false',
              }
            }
          ],
          numberOfDependentChildren: '2',
          spouseFinancialsList: {
            spouseFinancials: {
              contributedToSpouse: 'false',
              livedWithPatient: 'true',
              marriedLastCalendarYear: 'true',
              spouse: {
                address: {
                  city: 'Dulles',
                  country: 'USA',
                  line1: '123 NW 8th St',
                  state: 'VA',
                  zipCode: '20101',
                },
                dob: '04/06/1987',
                familyName: 'LastSpouse',
                givenName: 'FirstSpouse',
                middleName: 'MiddleSpouse',
                phoneNumber: '',
                ssns: {
                  ssnText: '111221234',
                },
                suffix: 'Sr.',
              }
            }
          }
        }
      },
      insuranceList: [
        {
          insurance: {
            companyName: 'MyInsruance',
            groupNumber: 'G1234',
            insuranceMappingTypeName: 'PI',
            policyHolderName: 'FirstName LastName',
            policyNumber: 'P1234',
          }
        }
      ],
      militaryServiceInfo: {
        militaryServiceSiteRecords: {
          militaryServiceSiteRecord: {
            militaryServiceEpisodes: {
              militaryServiceEpisode: {
                dischargeType: '3',
                startDate: '03/07/1980',
                endDate: '07/08/1984',
                serviceBranch: '7',
              }
            }
          }
        }
      },
      prisonerOfWarInfo: {
        powIndicator: 'true',
      },
      purpleHeart: {
        indicator: 'false',
      },
      personInfo: {
        firstName: 'FirstName',
        middleName: 'MiddleName',
        lastName: 'LastName',
        suffix: 'Jr.',
        ssnText: '111111234',
        gender: 'F',
        dob: '01/02/1923',
        mothersMaidenName: 'Maiden',
        placeOfBirthCity: 'Springfield',
        placeOfBirthState: 'AK',
      }
    },
    applications: {
      applicationInfo: {
        appDate: '2016-05-13',
        appMethod: '1',
      }
    }
  },
  identity: {
    authenticationLevel: {
      type: '100',
      value: 'anonymous',
    }
  }
};

describe('enrollment-system base tests', () => {
  describe('characterization test', () => {
    it('should transform the debug veteran to a known output format', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm(
        JSON.parse(JSON.stringify(veteran.completeVeteran, (i, d) => {
          return typeof d.value !== 'undefined' ? d.value : d;
        })));
      result.should.be.instanceOf(Object);
      result.should.deep.equal(goldenFormOutput);
    });
  });

  describe('validate the input is a non-empty Object', () => {
    it('should return an empty object when nothing is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm();
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when an empty object is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm({});
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when an array is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm([1, 2, 3]);
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when a string is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm('veteran');
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
    it('should return an empty object when a number is passed in', () => {
      const result = enrollmentSystem.veteranToSaveSubmitForm(1);
      result.should.be.empty;
      result.should.be.instanceOf(Object);
    });
  });
});
