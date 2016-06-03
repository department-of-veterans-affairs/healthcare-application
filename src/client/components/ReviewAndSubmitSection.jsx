import React from 'react';
import { connect } from 'react-redux';

import AdditionalInformationSection from './insurance-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './household-information/AnnualIncomeSection';
import BirthInformationSection from './veteran-information/BirthInformationSection';
import ChildInformationSection from './household-information/ChildInformationSection';
import ContactInformationSection from './veteran-information/ContactInformationSection';
import DeductibleExpensesSection from './household-information/DeductibleExpensesSection';
import DemographicInformationSection from './veteran-information/DemographicInformationSection';
import FinancialDisclosureSection from './household-information/FinancialDisclosureSection';
import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
import PersonalInfoSection from './veteran-information/PersonalInfoSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';
import SpouseInformationSection from './household-information/SpouseInformationSection';
import VAInformationSection from './va-benefits/VAInformationSection';
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
            additionalClass="confirm-personal-information"
            sectionLabel="Personal Information"
            updatePath="/veteran-information/personal-information"
            component={<PersonalInfoSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-birth-information"
            sectionLabel="Birth Information"
            updatePath="/veteran-information/birth-information"
            component={<BirthInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-demographic-information"
            sectionLabel="Demographic Information"
            updatePath="/veteran-information/demographic-information"
            component={<DemographicInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-veteran-address"
            sectionLabel="Veteran Address"
            updatePath="/veteran-information/veteran-address"
            component={<VeteranAddressSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-contact-information"
            sectionLabel="Contact Information"
            updatePath="/veteran-information/contact-information"
            component={<ContactInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-military-service-information"
            sectionLabel="Military Service Information"
            updatePath="/military-service/service-information"
            component={<ServiceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-additional-service-information"
            sectionLabel="Additional Service Information"
            updatePath="/military-service/additional-information"
            component={<AdditionalMilitaryInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-basic-information"
            sectionLabel="VA Benefits Information"
            updatePath="/va-benefits/basic-information"
            component={<VAInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-financial-disclosure"
            sectionLabel="Financial Disclosure"
            updatePath="/household-information/financial-disclosure"
            component={<FinancialDisclosureSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-spouse-information"
            sectionLabel="Spouse Information"
            updatePath="/household-information/spouse-information"
            component={<SpouseInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-child-information"
            sectionLabel="Children Information"
            updatePath="/household-information/child-information"
            component={<ChildInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-income-information"
            sectionLabel="Annual Income Information"
            updatePath="/household-information/annual-income"
            component={<AnnualIncomeSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-deductible-expenses"
            sectionLabel="Deductible Expenses"
            updatePath="/household-information/deductible-expenses"
            component={<DeductibleExpensesSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-medicare-medicaid-information"
            sectionLabel="Medicare/Medicaid Information"
            updatePath="/insurance-information/medicare"
            component={<MedicareMedicaidSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-insurance-information"
            sectionLabel="Insurance Information"
            updatePath="/insurance-information/general"
            component={<InsuranceInformationSection reviewSection/>}/>

        <ReviewCollapsiblePanel
            additionalClass="confirm-additional-information"
            sectionLabel="Additional Information"
            updatePath="/insurance-information/va-facility"
            component={<AdditionalInformationSection reviewSection/>}/>
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
    isApplicationSubmitted: state.uiState.applicationSubmitted,
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(ReviewAndSubmitSection);
export { ReviewAndSubmitSection };
