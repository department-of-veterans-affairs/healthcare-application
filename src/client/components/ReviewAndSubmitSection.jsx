import React from 'react';
import { connect } from 'react-redux';

import AdditionalInformationSection from './personal-information/AdditionalInformationSection';
import AdditionalMilitaryInformationSection from './military-service/AdditionalMilitaryInformationSection';
import AnnualIncomeSection from './financial-assessment/AnnualIncomeSection';
import ChildInformationSection from './financial-assessment/ChildInformationSection';
import DeductibleExpensesSection from './financial-assessment/DeductibleExpensesSection';
import DemographicInformationSection from './personal-information/DemographicInformationSection';
import FinancialDisclosureSection from './financial-assessment/FinancialDisclosureSection';
import InsuranceInformationSection from './insurance-information/InsuranceInformationSection';
import MedicareMedicaidSection from './insurance-information/MedicareMedicaidSection';
import NameAndGeneralInfoSection from './personal-information/NameAndGeneralInfoSection';
import ServiceInformationSection from './military-service/ServiceInformationSection';
import SpouseInformationSection from './financial-assessment/SpouseInformationSection';
import VAInformationSection from './personal-information/VAInformationSection';
import VeteranAddressSection from './personal-information/VeteranAddressSection';

import ReviewCollapsiblePanel from './form-elements/ReviewCollapsiblePanel';


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
        <ReviewCollapsiblePanel sectionComplete={this.props.sectionsComplete} sectionLabel="NameAndGeneralInfoSection">
          <NameAndGeneralInfoSection reviewSection/>
        </ReviewCollapsiblePanel>


        <div className="usa-accordion-bordered">
          <ul className="usa-unstyled-list">
            <li>
              <button className="usa-button-unstyled" aria-expanded="true" aria-controls="collapsible-0">
                First Amendment
              </button>
              <div id="collapsible-0" aria-hidden="false" className="usa-accordion-content">
                <NameAndGeneralInfoSection reviewSection/>
              </div>
            </li>
            <li>
              <button className="usa-button-unstyled" aria-expanded="false" aria-controls="collapsible-1">
                Second Amendment
              </button>
              <div id="collapsible-1" aria-hidden="true" className="usa-accordion-content">
                <p>
                A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.
                </p>
              </div>
            </li>
            <li>
              <button className="usa-button-unstyled" aria-expanded="false" aria-controls="collapsible-2">
                Third Amendment
              </button>
              <div id="collapsible-2" aria-hidden="true" className="usa-accordion-content">
                <p>
                No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.
                </p>
              </div>
            </li>
            <li>
              <button className="usa-button-unstyled" aria-expanded="false" aria-controls="collapsible-3">
                Fourth Amendment
              </button>
              <div id="collapsible-3" aria-hidden="true" className="usa-accordion-content">
                <p>
                The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.
                </p>
              </div>
            </li>
            <li>
              <button className="usa-button-unstyled" aria-expanded="false" aria-controls="collapsible-4">
                Fifth Amendment
              </button>
              <div id="collapsible-4" aria-hidden="true" className="usa-accordion-content">
                <p>
                No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <p>Please ensure all of your information is correct before submitting your application.</p>
        <VAInformationSection reviewSection/>
        <AdditionalInformationSection reviewSection/>
        <DemographicInformationSection reviewSection/>
        <VeteranAddressSection reviewSection/>
        <InsuranceInformationSection reviewSection/>
        <MedicareMedicaidSection reviewSection/>
        <ServiceInformationSection reviewSection/>
        <AdditionalMilitaryInformationSection reviewSection/>
        <FinancialDisclosureSection reviewSection/>
        <SpouseInformationSection reviewSection/>
        <ChildInformationSection reviewSection/>
        <AnnualIncomeSection reviewSection/>
        <DeductibleExpensesSection reviewSection/>
        <div className="input-section">
          <a href="#">Upload documents</a>
        </div>
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
    sectionsComplete: state.uiState.completedSections
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(ReviewAndSubmitSection);
export { ReviewAndSubmitSection };
