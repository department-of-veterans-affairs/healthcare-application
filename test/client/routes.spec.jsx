import React from 'react';
import SkinDeep from 'skin-deep';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';
import { expect } from 'chai';

import AdditionalInformationSection from '../../src/client/components/who-are-you/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from '../../src/client/components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from '../../src/client/components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from '../../src/client/components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from '../../src/client/components/financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from '../../src/client/components/who-are-you/DemographicInformationSection';
import FinancialDisclosureSection from '../../src/client/components/financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from '../../src/client/components/insurance-information/InsuranceInformationSection';
import IntroductionSection from '../../src/client/components/IntroductionSection.jsx';
import MedicareMedicaidSection from '../../src/client/components/insurance-information/MedicareMedicaidSection';
import NameAndGeneralInfoSection from '../../src/client/components/who-are-you/NameAndGeneralInfoSection';
import ReviewAndSubmitSection from '../../src/client/components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from '../../src/client/components/military-service/ServiceInformationSection';
import SpouseInformationSection from '../../src/client/components/financial-assessment/SpouseInformationSection';
import VAInformationSection from '../../src/client/components/who-are-you/VAInformationSection';
import VeteranAddressSection from '../../src/client/components/who-are-you/VeteranAddressSection';
import routes from '../../src/client/routes';
import veteran from '../../src/client/reducers/veteran';

function getName(component) {
  return component.displayName || component.name;
}

class Container extends React.Component {
  render() {
    return (<div>{this.props.children}</div>);
  }
}

describe('routes', () => {
  describe('renders correct component', () => {
    const history = createMemoryHistory('/');
    const store = createStore(veteran);
    let tree;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      tree = SkinDeep.shallowRender((
        <Router history={history}>
          <Route path="/" component={Container}>
            {routes}
          </Route>
        </Router>
        ), {
          store // Mock the Redux store context so components render.
        }
      );
    });

    afterEach(() => {
      // Ensure navigations do not leak from one test case to another.
      history.replace('/');
    });

    it('/introduction', () => {
      history.replace('/introduction');
      expect(tree.dive(['RouterContext']).subTree(getName(IntroductionSection))).to.be.an('object');
    });

    it('/who-are-you/name-and-general-information', () => {
      history.replace('/who-are-you/name-and-general-information');
      expect(tree.dive(['RouterContext']).subTree(getName(NameAndGeneralInfoSection))).to.be.an('object');
    });

    it('/who-are-you/va-information', () => {
      history.replace('/who-are-you/va-information');
      expect(tree.dive(['RouterContext']).subTree(getName(VAInformationSection))).to.be.an('object');
    });

    it('/who-are-you/additional-information', () => {
      history.replace('/who-are-you/additional-information');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalInformationSection))).to.be.an('object');
    });

    it('/who-are-you/demographic-information', () => {
      history.replace('/who-are-you/demographic-information');
      expect(tree.dive(['RouterContext']).subTree(getName(DemographicInformationSection))).to.be.an('object');
    });

    it('/who-are-you/veteran-address', () => {
      history.replace('/who-are-you/veteran-address');
      expect(tree.dive(['RouterContext']).subTree(getName(VeteranAddressSection))).to.be.an('object');
    });

    it('/insurance-information/general', () => {
      history.replace('/insurance-information/general');
      expect(tree.dive(['RouterContext']).subTree(getName(InsuranceInformationSection))).to.be.an('object');
    });

    it('/insurance-information/medicare-medicaid', () => {
      history.replace('/insurance-information/medicare-medicaid');
      expect(tree.dive(['RouterContext']).subTree(getName(MedicareMedicaidSection))).to.be.an('object');
    });

    it('/military-service/service-information', () => {
      history.replace('/military-service/service-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ServiceInformationSection))).to.be.an('object');
    });

    it('/military-service/additional-information', () => {
      history.replace('/military-service/additional-information');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalMilitaryInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/financial-disclosure', () => {
      history.replace('/financial-assessment/financial-disclosure');
      expect(tree.dive(['RouterContext']).subTree(getName(FinancialDisclosureSection))).to.be.an('object');
    });

    it('/financial-assessment/spouse-information', () => {
      history.replace('/financial-assessment/spouse-information');
      expect(tree.dive(['RouterContext']).subTree(getName(SpouseInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/child-information', () => {
      history.replace('/financial-assessment/child-information');
      expect(tree.dive(['RouterContext']).subTree(getName(ChildInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/annual-income', () => {
      history.replace('/financial-assessment/annual-income');
      expect(tree.dive(['RouterContext']).subTree(getName(AnnualIncomeSection))).to.be.an('object');
    });

    it('/financial-assessment/deductible-expenses', () => {
      history.replace('/financial-assessment/deductible-expenses');
      expect(tree.dive(['RouterContext']).subTree(getName(DeductibleExpensesSection))).to.be.an('object');
    });

    it('/review-and-submit', () => {
      history.replace('/review-and-submit');
      expect(tree.dive(['RouterContext']).subTree(getName(ReviewAndSubmitSection))).to.be.an('object');
    });
  });
});
