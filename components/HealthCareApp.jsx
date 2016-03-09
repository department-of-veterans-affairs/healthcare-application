import React from 'react';
import { hashHistory } from 'react-router';
import _ from 'lodash';
import lodashDeep from 'lodash-deep';

import ContinueButton from './ContinueButton';
import IntroductionPanel from './IntroductionPanel.jsx';
import Nav from './Nav.jsx';

// Add deep object manipulation routines to lodash.
_.mixin(lodashDeep);

class HealthCareApp extends React.Component {
  constructor() {
    super();
    this.publishStateChange = this.publishStateChange.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.getNextUrl = this.getNextUrl.bind(this);

    let initialState = {
      applicationData: {
        introduction: {},

        personalInformation: {
          nameAndGeneralInfo: {
            fullName: {
              first: 'William',
              middle: '',
              last: 'Shakespeare',
              suffix: '',
            },

            mothersMaidenName: 'Arden',

            socialSecurityNumber: '999-99-9999',

            dateOfBirth: {
              month: 1,
              day: 15,
              year: 1997,
            }
          },

          vaInformation: {
            isVaServiceConnected: false,
            compensableVaServiceConnected: false,
            receivesVaPension: false
          },

          additionalInformation: {
            isEssentialAcaCoverage: false,
            vaMedicalFacility: '',
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
              street: undefined,
              city: undefined,
              country: undefined,
              state: undefined,
              zipcode: undefined,
            },
            county: undefined,
            email: 'test@test.com',
            emailConfirmation: 'test@test.com',
            homePhone: '555-555-5555',
            mobilePhone: '111-111-1111'
          }
        },

        financialAssessment: {
          financialDisclosure: {
            provideFinancialInfo: false,
            understandsFinancialDisclosure: false
          },
          spouseInformation: {
            spouseFirstName: undefined,
            spouseMiddleName: undefined,
            spouseLastName: undefined,
            spouseSuffix: undefined,
            spouseSocialSecurityNumber: '111-11-1111',
            spouseDateOfBirth: {
              month: 4,
              day: 23,
              year: 1989,
            },
            dateOfMarriage: {
              month: 3,
              day: 8,
              year: 2016
            },
            sameAddress: false,
            cohabitedLastYear: false,
            provideSupportLastYear: false,
            spouseAddress: {
              street: undefined,
              city: undefined,
              country: undefined,
              state: undefined,
              zipcode: undefined,
            },
            spousePhone: '222-222-2222'
          },
          childInformation: {},
          annualIncome: {
            veteranGrossIncome: '',
            veteranNetIncome: '',
            veteranOtherIncome: '',
            spouseGrossIncome: '',
            spouseNetIncome: '',
            spouseOtherIncome: '',
            childrenGrossIncome: '',
            childrenNetIncome: '',
            childrenOtherIncome: ''
          },
          deductibleExpenses: {
            deductibleMedicalExpenses: '',
            deductibleFuneralExpenses: '',
            deductibleEducationExpenses: ''
          },
        },

        // TODO: insuranceInformation should be an array where each row
        //       contains all the following fields:
        insuranceInformation: {
          insuranceInfo: {
            isCoveredByHealthInsurance: false,
            insuranceName: '',
            insuranceAddress: '',
            insuranceCity: '',
            insuranceCountry: '',
            insuranceState: '',
            insuranceZipcode: '',
            insurancePhone: '404-123-1234',
            insurancePolicyHolderName: '',
            insurancePolicyNumber: '',
            insuranceGroupCode: '',
          },

          medicareMedicaidInfo: {
            isMedicaidEligible: false,
            isEnrolledMedicarePartA: false,
            medicarePartAEffectiveDate: {
              month: 10,
              day: 25,
              year: 2001
            }
          }
        }
      }
    };

    // Merge in saved data.
    // TODO(awong): If a field is ever removed in a new version of the code,
    // this will preserve the key. The result of JSON.parse() should first
    // be filtered to only contain keys also in this.state.applicationData.
    const savedDataJson = window.localStorage['health-app-data'];
    if (savedDataJson !== undefined) {
      const savedData = JSON.parse(savedDataJson);
      initialState = _.deepMapValues(
        initialState,
        (value, propertyPath) => {
          const savedValue = _.get(savedData, propertyPath);
          if (savedValue !== undefined) {
            return savedValue;
          }

          return value;
        });
    }

    this.state = initialState;
  }

  getNextUrl() {
    const routes = this.props.route.childRoutes;
    const panels = [];
    let currentPath = this.props.location.pathname;
    let nextPath = '';

    // TODO(awong): remove the '/' alias for '/introduction' using history.replaceState()
    if (currentPath === '/') {
      currentPath = '/introduction';
    }

    panels.push.apply(panels, routes.map((obj) => { return obj.path; }));

    for (let i = 0; i < panels.length; i++) {
      if (currentPath === panels[i]) {
        nextPath = panels[i + 1];
        break;
      }
    }

    return nextPath;
  }

  publishStateChange(propertyPath, update) {
    const newApplicationData = Object.assign({}, this.state.applicationData);
    _.set(newApplicationData, propertyPath, update);
    window.localStorage['health-app-data'] = JSON.stringify(newApplicationData);

    this.setState({ applicationData: newApplicationData });
  }

  handleContinue() {
    hashHistory.push(this.getNextUrl());
  }

  render() {
    let children = this.props.children;

    if (children === null) {
      // This occurs if the root route is hit. Default to IntroductionPanel.
      children = (<IntroductionPanel
          applicationData={this.state.applicationData}
          publishStateChange={this.publishStateChange}/>);
    } else {
      // Pass the application state down to child components. The
      // cloneElement idiom is the standard react way to add
      // properties to a child. It doesn't actually new a bunch of objects
      // so it's fast.
      children = React.Children.map(children, (child) => {
        return React.cloneElement(child,
          { applicationData: this.state.applicationData,
            publishStateChange: this.publishStateChange });
      });
    }

    return (
      <div className="row">
        <div className="small-4 columns">
          <Nav currentUrl={this.props.location.pathname}/>
        </div>
        <div className="small-8 columns">
          <div className="progress-box">
            <div className="form-panel">
              {children}
              <ContinueButton onButtonClick={this.handleContinue}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HealthCareApp;
