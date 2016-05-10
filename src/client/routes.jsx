import React from 'react';
import { Route } from 'react-router';

// import AdditionalInformationSection from './components/veteran-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './components/military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './components/household-information/AnnualIncomeSection';
import ChildInformationSection from './components/household-information/ChildInformationSection';
import DeductibleExpensesSection from './components/household-information/DeductibleExpensesSection';
import DemographicInformationSection from './components/veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './components/household-information/FinancialDisclosureSection';
import InsuranceInformationSection from './components/insurance-information/InsuranceInformationSection';
import IntroductionSection from './components/IntroductionSection.jsx';
import PersonalInfoSection from './components/veteran-information/PersonalInfoSection';
import ReviewAndSubmitSection from './components/ReviewAndSubmitSection.jsx';
import ServiceInformationSection from './components/military-service/ServiceInformationSection';
import SpouseInformationSection from './components/household-information/SpouseInformationSection';
import VeteranAddressSection from './components/veteran-information/VeteranAddressSection';
import VaInformationSection from './components/va-benefits/VaInformationSection';


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

// Military Service routes.
  <Route
      component={ServiceInformationSection}
      key="/military-service/service-information"
      path="/military-service/service-information"/>,
  <Route
      component={AdditionalMilitaryInformationSection}
      key="/military-service/additional-information"
      path="/military-service/additional-information"/>,

  // VA Benefits routes.
  <Route
      component={VaInformationSection}
      key="/va-benefits/basic-information"
      path="/va-benefits/basic-information"/>,

 // Household Information routes.
  <Route
      component={FinancialDisclosureSection}
      key="/household-information/financial-disclosure"
      path="/household-information/financial-disclosure"/>,
  <Route
      component={SpouseInformationSection}
      key="/household-information/spouse-information"
      path="/household-information/spouse-information"/>,
  <Route
      component={ChildInformationSection}
      key="/household-information/child-information"
      path="/household-information/child-information"/>,
  <Route
      component={AnnualIncomeSection}
      key="/household-information/annual-income"
      path="/household-information/annual-income"/>,
  <Route
      component={DeductibleExpensesSection}
      key="/household-information/deductible-expenses"
      path="/household-information/deductible-expenses"/>,

// Insurance Information routes.
  <Route
      component={InsuranceInformationSection}
      key="/insurance-information/general"
      path="/insurance-information/general"/>,

  // Review and Submit route.
  <Route
      component={ReviewAndSubmitSection}
      key="/review-and-submit"
      path="/review-and-submit"/>
];

export default routes;
