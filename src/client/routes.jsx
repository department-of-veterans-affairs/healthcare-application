import React from 'react';
import { Route } from 'react-router';

import AnnualIncomeSection from './components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './components/financial-assessment/DeductibleExpensesSection';
import IntroductionSection from './components/IntroductionSection.jsx';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import SpouseInformationSection from './components/financial-assessment/SpouseInformationSection';
import WhoAreYouPanel1 from './components/who-are-you/WhoAreYouPanel1';
import WhoAreYouPanel2 from './components/who-are-you/WhoAreYouPanel2';
import WhoAreYouPanel3 from './components/who-are-you/WhoAreYouPanel3';
import HowDoWeReachYouPanel1 from './components/how-do-we-reach-you/HowDoWeReachYouPanel1';
import HowDoWeReachYouPanel2 from './components/how-do-we-reach-you/HowDoWeReachYouPanel2';
import InsuranceInformationSection from './components/other-insurance/InsuranceInformationSection';
import MedicareMedicaidSection from './components/other-insurance/MedicareMedicaidSection';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import VAInformationSection from './components/va-service-connected/VAInformationSection';


const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,

  // Personal Information routes.
  <Route
      component={WhoAreYouPanel1}
      key="/who-are-you/panel1"
      path="/who-are-you/panel1"/>,
  <Route
      component={WhoAreYouPanel2}
      key="/who-are-you/panel2"
      path="/who-are-you/panel2"/>,
  <Route
      component={WhoAreYouPanel3}
      key="/who-are-you/panel3"
      path="/who-are-you/panel3"/>,

  // Contact Information routes.
  <Route
      component={HowDoWeReachYouPanel1}
      key="/how-do-we-reach-you/panel1"
      path="/how-do-we-reach-you/panel1"/>,
  <Route
      component={HowDoWeReachYouPanel2}
      key="/how-do-we-reach-you/panel2"
      path="/how-do-we-reach-you/panel2"/>,

  // Insurance Information routes.
  <Route
      component={MedicareMedicaidSection}
      key="/other-insurance/panel1"
      path="/other-insurance/panel1"/>,
  <Route
      component={InsuranceInformationSection}
      key="/other-insurance/panel2"
      path="/other-insurance/panel2"/>,

  // Military Service routes.
  <Route
      component={ServiceInformationSection}
      key="/military-service/panel1"
      path="/military-service/panel1"/>,
  <Route
      component={AdditionalMilitaryInformationSection}
      key="/military-service/panel2"
      path="/military-service/panel2"/>,

  // VA Service-Connected routes.
  <Route
      component={VAInformationSection}
      key="/va-service-connected/panel1"
      path="/va-service-connected/panel1"/>,

  // Financial Assessment routes.
  <Route
      component={AnnualIncomeSection}
      key="/financial-assessment/panel1"
      path="/financial-assessment/panel1"/>,
  <Route
      component={DeductibleExpensesSection}
      key="/financial-assessment/panel2"
      path="/financial-assessment/panel2"/>,
  <Route
      component={SpouseInformationSection}
      key="/financial-assessment/panel3"
      path="/financial-assessment/panel3"/>,
  <Route
      component={ChildInformationSection}
      key="/financial-assessment/panel4"
      path="/financial-assessment/panel4"/>,

  // Review and Submit route.
  <Route
      component={ReviewAndSubmitSection}
      key="/review-and-submit"
      path="/review-and-submit"/>
];

export default routes;
