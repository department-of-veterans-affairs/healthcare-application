import React from 'react';
import { Route } from 'react-router';

import AdditionalInformationSection from './components/veteran-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './components/financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './components/financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './components/financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from './components/veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './components/financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from './components/insurance-information/InsuranceInformationSection';
import IntroductionSection from './components/IntroductionSection.jsx';
import MedicareMedicaidSection from './components/insurance-information/MedicareMedicaidSection';
import PersonalInfoSection from './components/veteran-information/PersonalInfoSection';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import SpouseInformationSection from './components/financial-assessment/SpouseInformationSection';
import VeteranAddressSection from './components/veteran-information/VeteranAddressSection';
import VaInformationSection from './components/veteran-information/VaInformationSection';


const routes = [
  // Introduction route.
  <Route
      component={IntroductionSection}
      key="/introduction"
      path="/introduction"/>,

  // Personal Information routes.
  <Route
      component={PersonalInfoSection}
      key="/veteran-information/name-and-general-information"
      path="/veteran-information/name-and-general-information"/>,
  <Route
      component={DemographicInformationSection}
      key="/veteran-information/demographic-information"
      path="/veteran-information/demographic-information"/>,
  <Route
      component={VeteranAddressSection}
      key="/veteran-information/veteran-address"
      path="/veteran-information/veteran-address"/>,
  <Route
      component={VaInformationSection}
      key="/veteran-information/va-information"
      path="/veteran-information/va-information"/>,
  <Route
      component={AdditionalInformationSection}
      key="/veteran-information/additional-information"
      path="/veteran-information/additional-information"/>,

  // Insurance Information routes.
  <Route
      component={InsuranceInformationSection}
      key="/insurance-information/general"
      path="/insurance-information/general"/>,
  <Route
      component={MedicareMedicaidSection}
      key="/insurance-information/medicare-medicaid"
      path="/insurance-information/medicare-medicaid"/>,

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
