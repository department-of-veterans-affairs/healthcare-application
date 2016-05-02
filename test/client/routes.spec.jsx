import React from 'react';
import SkinDeep from 'skin-deep';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';
import { expect } from 'chai';

import AdditionalMilitaryInformationSection from '../../src/client/components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from '../../src/client/components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from '../../src/client/components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from '../../src/client/components/financial-assessment/DeductibleExpensesSection';
import InsuranceInformationSection from '../../src/client/components/other-insurance/InsuranceInformationSection';
import IntroductionSection from '../../src/client/components/IntroductionSection.jsx';
import MedicareMedicaidSection from '../../src/client/components/other-insurance/MedicareMedicaidSection';
import ReviewAndSubmitSection from '../../src/client/components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from '../../src/client/components/military-service/ServiceInformationSection';
import SpouseInformationSection from '../../src/client/components/financial-assessment/SpouseInformationSection';
import VAInformationSection from '../../src/client/components/va-service-connected/VAInformationSection';
import WhoAreYouPanel1 from '../../src/client/components/who-are-you/WhoAreYouPanel1';
import WhoAreYouPanel2 from '../../src/client/components/who-are-you/WhoAreYouPanel2';
import WhoAreYouPanel3 from '../../src/client/components/who-are-you/WhoAreYouPanel3';
import HowDoWeReachYouPanel1 from '../../src/client/components/how-do-we-reach-you/HowDoWeReachYouPanel1';
import HowDoWeReachYouPanel2 from '../../src/client/components/how-do-we-reach-you/HowDoWeReachYouPanel2';
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

    it('/who-are-you/panel1', () => {
      history.replace('/who-are-you/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(WhoAreYouPanel1))).to.be.an('object');
    });

    it('/who-are-you/panel2', () => {
      history.replace('/who-are-you/panel2');
      expect(tree.dive(['RouterContext']).subTree(getName(WhoAreYouPanel2))).to.be.an('object');
    });

    it('/who-are-you/panel3', () => {
      history.replace('/who-are-you/panel3');
      expect(tree.dive(['RouterContext']).subTree(getName(WhoAreYouPanel3))).to.be.an('object');
    });

    it('/how-do-we-reach-you/panel1', () => {
      history.replace('/how-do-we-reach-you/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(HowDoWeReachYouPanel1))).to.be.an('object');
    });

    it('/how-do-we-reach-you/panel2', () => {
      history.replace('/how-do-we-reach-you/panel2');
      expect(tree.dive(['RouterContext']).subTree(getName(HowDoWeReachYouPanel2))).to.be.an('object');
    });

    it('/other-insurance/panel1', () => {
      history.replace('/other-insurance/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(MedicareMedicaidSection))).to.be.an('object');
    });

    it('/other-insurance/panel2', () => {
      history.replace('/other-insurance/panel2');
      expect(tree.dive(['RouterContext']).subTree(getName(InsuranceInformationSection))).to.be.an('object');
    });

    it('/military-service/panel1', () => {
      history.replace('/military-service/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(ServiceInformationSection))).to.be.an('object');
    });

    it('/military-service/panel2', () => {
      history.replace('/military-service/panel2');
      expect(tree.dive(['RouterContext']).subTree(getName(AdditionalMilitaryInformationSection))).to.be.an('object');
    });

    it('/va-service-connected/panel1', () => {
      history.replace('/va-service-connected/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(VAInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/panel1', () => {
      history.replace('/financial-assessment/panel1');
      expect(tree.dive(['RouterContext']).subTree(getName(AnnualIncomeSection))).to.be.an('object');
    });

    it('/financial-assessment/panel2', () => {
      history.replace('/financial-assessment/panel2');
      expect(tree.dive(['RouterContext']).subTree(getName(DeductibleExpensesSection))).to.be.an('object');
    });

    it('/financial-assessment/panel3', () => {
      history.replace('/financial-assessment/panel3');
      expect(tree.dive(['RouterContext']).subTree(getName(SpouseInformationSection))).to.be.an('object');
    });

    it('/financial-assessment/panel4', () => {
      history.replace('/financial-assessment/panel4');
      expect(tree.dive(['RouterContext']).subTree(getName(ChildInformationSection))).to.be.an('object');
    });

    it('/review-and-submit', () => {
      history.replace('/review-and-submit');
      expect(tree.dive(['RouterContext']).subTree(getName(ReviewAndSubmitSection))).to.be.an('object');
    });
  });
});
