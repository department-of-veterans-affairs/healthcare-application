const chai = require('chai');
chai.should();

const enrollmentSystem = require('../../src/server/enrollment-system');
const veteran = require('../../src/common/veteran');
const ajv = require('ajv');

const ApplicationJsonSchema = require('../../src/common/schema/application');
const validate = ajv({ allErrors: true, errorDataPath: 'property', removeAdditional: true, useDefaults: true }).compile(ApplicationJsonSchema);

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
              phone: [
                {
                  phoneNumber: '1231241234',
                  type: '1',
                }, {
                  phoneNumber: '1235551234',
                  type: '4',
                }
              ]
            }
          }
        },
        ethnicity: '2135-2',
        maritalStatus: 'M',
        preferredFacility: '689A4',
        races: {
          race: [
            '1002-5',
            '2028-9',
            '2054-5',
            '2076-8',
            '2106-3',
          ]
        },
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
                    ssn: {
                      ssnText: '111229876',
                    }
                  },
                  startDate: '04/07/1992',
                  suffix: '',
                },
                incapableOfSelfSupport: 'true',
                incomes: {
                  income: [
                    {
                      amount: '991.9',
                      type: '12'
                    },
                    {
                      amount: '981.2',
                      type: '13'
                    },
                    {
                      amount: '91.9',
                      type: '10'
                    }
                  ],
                },
                livedWithPatient: 'true',
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
                    ssn: {
                      ssnText: '222111234',
                    }
                  },
                  startDate: '04/07/2003',
                  suffix: 'Sr.',
                },
                incapableOfSelfSupport: 'false',
                incomes: {
                  income: [
                    {
                      amount: '791.9',
                      type: '12'
                    },
                    {
                      amount: '781.2',
                      type: '13'
                    },
                    {
                      amount: '71.9',
                      type: '10'
                    }
                  ]
                },
                livedWithPatient: 'false',
              }
            }
          ],
          numberOfDependentChildren: '2',
          expenses: {
            expense: [
              {
                amount: '77.77',
                expenseType: '3',
              },
              {
                amount: '44.44',
                expenseType: '19',
              },
              {
                amount: '33.3',
                expenseType: '18',
              }
            ]
          },
          incomes: {
            income: [
              {
                amount: '123.33',
                type: '12',
              },
              {
                amount: '90.11',
                type: '13',
              },
              {
                amount: '10.1',
                type: '10',
              }
            ]
          },
          spouseFinancialsList: {
            spouseFinancials: {
              contributedToSpouse: 'false',
              incomes: {
                income: [
                  {
                    amount: '64.1',
                    type: '12',
                  }, {
                    amount: '35.1',
                    type: '13',
                  }, {
                    amount: '12.3',
                    type: '10',
                  }
                ]
              },
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
                dob: '04/06/1980',
                familyName: 'LastSpouse',
                givenName: 'FirstSpouse',
                middleName: 'MiddleSpouse',
                phoneNumber: '1112221234',
                ssns: {
                  ssn: {
                    ssnText: '111221234',
                  }
                },
                startDate: '05/10/1983',
                suffix: 'Sr.',
              }
            }
          }
        }
      },
      insuranceList: {
        insurance: [
          {
            companyName: 'MyInsruance',
            groupNumber: 'G1234',
            insuranceMappingTypeName: 'PI',
            policyHolderName: 'FirstName LastName',
            policyNumber: 'P1234',
          }, {
            companyName: 'Medicare',
            enrolledInPartA: 'true',
            insuranceMappingTypeName: 'MDCR',
            partAEffectiveDate: '10/16/1999'
          }
        ]
      },
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
            },
            site: '689A4',
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
      const completeVeteran = JSON.parse(veteran.veteranToApplication(veteran.completeVeteran));
      const valid = validate(completeVeteran);
      if (!valid) {
        console.log(JSON.stringify(completeVeteran, null, 2));
        console.log(validate.errors);
        valid.should.be.true;
      }
      const result = enrollmentSystem.veteranToSaveSubmitForm(completeVeteran);
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
