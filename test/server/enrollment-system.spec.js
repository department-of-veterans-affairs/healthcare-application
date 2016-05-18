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
            }
          }
        },
        ethnicity: '2186-5',
        maritalStatus: 'M',
        preferredFacility: '689A4',
        races: {
          race: '2106-3',
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
          agentOrangeInd: 'false',
          envContaminantsInd: 'false',
          campLejeuneInd: 'true',
          radiationExposureInd: 'true',
        }
      },
      insuranceList: {
        insurance: {
          companyName: 'Medicare',
          enrolledInPartA: 'false',
          enrolledInPartB: 'false',
          insuranceMappingTypeName: 'MDCR',
        }
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
            site: '565GC',
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
      console.log(JSON.stringify(result, null, 2));
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
