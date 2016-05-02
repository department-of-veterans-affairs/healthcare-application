import React from 'react';
import { Route } from 'react-router';

// import AdditionalInformationSection from './components/who-are-you/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './components/financial-assessment/DeductibleExpensesSection';
// import DemographicInformationSection from './components/who-are-you/DemographicInformationSection';
import FinancialDisclosureSection from './components/financial-assessment/FinancialDisclosureSection';
import IntroductionSection from './components/IntroductionSection.jsx';
// import NameAndGeneralInfoSection from './components/who-are-you/NameAndGeneralInfoSection';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import SpouseInformationSection from './components/financial-assessment/SpouseInformationSection';
// import VAInformationSection from './components/who-are-you/VAInformationSection';
// import VeteranAddressSection from './components/who-are-you/VeteranAddressSection';
import WhoAreYouPanel1 from './components/who-are-you/WhoAreYouPanel1';
import WhoAreYouPanel2 from './components/who-are-you/WhoAreYouPanel2';
import WhoAreYouPanel3 from './components/who-are-you/WhoAreYouPanel3';
import HowDoWeReachYouPanel1 from './components/how-do-we-reach-you/HowDoWeReachYouPanel1';
import HowDoWeReachYouPanel2 from './components/how-do-we-reach-you/HowDoWeReachYouPanel2';
import InsuranceInformationSection from './components/other-insurance/InsuranceInformationSection';
import MedicareMedicaidSection from './components/other-insurance/MedicareMedicaidSection';

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
      key="/military-service/service-information"
      path="/military-service/service-information"/>,
  <Route
      component={AdditionalMilitaryInformationSection}
      key="/military-service/additional-information"
      path="/military-service/additional-information"/>,

  // Financial Assessment routes.
  <Route
      component={FinancialDisclosureSection}
      key="/financial-assessment/financial-disclosure"
      path="/financial-assessment/financial-disclosure"/>,
  <Route
      component={SpouseInformationSection}
      key="/financial-assessment/spouse-information"
      path="/financial-assessment/spouse-information"/>,
  <Route
      component={ChildInformationSection}
      key="/financial-assessment/child-information"
      path="/financial-assessment/child-information"/>,
  <Route
      component={AnnualIncomeSection}
      key="/financial-assessment/annual-income"
      path="/financial-assessment/annual-income"/>,
  <Route
      component={DeductibleExpensesSection}
      key="/financial-assessment/deductible-expenses"
      path="/financial-assessment/deductible-expenses"/>,

  // Review and Submit route.
  <Route
      component={ReviewAndSubmitSection}
      key="/review-and-submit"
      path="/review-and-submit"/>
];

export default routes;
