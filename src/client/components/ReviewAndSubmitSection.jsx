import React from 'react';
import { connect } from 'react-redux';

import AdditionalInformationSection from './veteran-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from './veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
import PersonalInfoSection from './veteran-information/PersonalInfoSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';
import SpouseInformationSection from './financial-assessment/SpouseInformationSection';
import VAInformationSection from './veteran-information/VAInformationSection';
import VeteranAddressSection from './veteran-information/VeteranAddressSection';

import ReviewCollapsiblePanel from './form-elements/ReviewCollapsiblePanel';

/*
    TODO(crew): Get components from store and create array to check if ReviewCollapsiblePanel is
    open or closed. Also, potentially generate ReviewCollapsiblePanel components with routes from
    json object.
*/

class ReviewAndSubmitSection extends React.Component {
  render() {
    let content;

    if (this.props.isApplicationSubmitted) {
      content = (
        // TODO(crew): We need to figure out why the css isn't working here.
        <div className="usa-alert usa-alert-success">
          <div className="usa-alert-body">
            <h3 className="usa-alert-heading">You have submitted your application for health care!</h3>
            <p className="usa-alert-text">We are processing your application. You should receive a phone call from the VA in the next week.</p>
            <p className="usa-alert-text">If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387).</p>
          </div>
        </div>
      );
    } else {
      content = (<div>
        <p>Please ensure all of your information is correct before submitting your application.</p>

        {/* TODO(crew): Change names of sections to real names. */}
        <ReviewCollapsiblePanel
            sectionLabel="PersonalInfoSection"
            updatePath="/veteran-information/name-and-general-information"
            component={<PersonalInfoSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="DemographicInformationSection"
            updatePath="/veteran-information/demographic-information"
            component={<DemographicInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="VAInformationSection"
            updatePath="/veteran-information/demographic-information"
            component={<VAInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="AdditionalInformationSection"
            updatePath="/veteran-information/additional-information"
            component={<AdditionalInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="VeteranAddressSection"
            updatePath="/veteran-information/veteran-address"
            component={<VeteranAddressSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="InsuranceInformationSection"
            updatePath="/insurance-information/general"
            component={<InsuranceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="MedicareMedicaidSection"
            updatePath="/insurance-information/medicare-medicaid"
            component={<MedicareMedicaidSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="ServiceInformationSection"
            updatePath="/military-service/service-information"
            component={<ServiceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="AdditionalMilitaryInformationSection"
            updatePath="/military-service/additional-information"
            component={<AdditionalMilitaryInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="FinancialDisclosureSection"
            updatePath="/financial-assessment/financial-disclosure"
            component={<FinancialDisclosureSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="SpouseInformationSection"
            updatePath="/financial-assessment/spouse-information"
            component={<SpouseInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="ChildInformationSection"
            updatePath="/financial-assessment/child-information"
            component={<ChildInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="AnnualIncomeSection"
            updatePath="/financial-assessment/annual-income"
            component={<AnnualIncomeSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            sectionLabel="DeductibleExpensesSection"
            updatePath="/financial-assessment/deductible-expenses"
            component={<DeductibleExpensesSection reviewSection/>}/>
      </div>);
    }
    return (
      <div>
        <h4>Review Application</h4>
        {content}
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
