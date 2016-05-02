import React from 'react';
import { connect } from 'react-redux';

import WhoAreYouPanel1 from './who-are-you/WhoAreYouPanel1';
// import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
// import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
// import ChildInformationSection from './financial-assessment/ChildInformationSection';
// import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
// import DemographicInformationSection from './who-are-you/DemographicInformationSection';
// import FinancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
// import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
// import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
// import NameAndGeneralInfoSection from './who-are-you/NameAndGeneralInfoSection';
// import ServiceInformationSection from './military-service/ServiceInformationSection';
// import SpouseInformationSection from './financial-assessment/SpouseInformationSection';
// import VAInformationSection from './who-are-you/VAInformationSection';
// import VeteranAddressSection from './who-are-you/VeteranAddressSection';


class ReviewAndSubmitSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Review and Submit</h4>
        <p>Please ensure all of your information is correct before submitting your application.</p>
        <WhoAreYouPanel1 reviewSection/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isApplicationSubmitted: state.uiState.applicationSubmitted
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(ReviewAndSubmitSection);
export { ReviewAndSubmitSection };
