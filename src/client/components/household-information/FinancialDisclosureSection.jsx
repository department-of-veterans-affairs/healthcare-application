import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class FinancialDisclosureSection extends React.Component {
  render() {
    let content;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I agree to provide my financial information so the VA can determine
             my eligibility for VA healthcare and if I should be charged for copays and medication:
            </td>
            <td>{`${this.props.data.provideFinancialInfo ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>I understand VA is not currently enrolling new applicants who decline to
            provide their financial information unless they have other qualifying eligibility factors: </td>
            <td>{`${this.props.data.understandsFinancialDisclosure ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Financial Disclosure</legend>
        <div className="input-section">
          <p>In the next 4 sections you will be asked to provide your financial information from the most recent tax year. This
          information is used to determine your eligibility for health care. Your most recent
          tax filing will have all the information you need in it.</p>
          <p>
            Veterans are not required to disclose their financial information; however,
            <strong> VA is not currently enrolling new applicants who decline to provide their financial information unless
            they have other qualifying eligibility factors.</strong>
          </p>

          <p>Qualifying Eligibility Factors:</p>
          <ul>
            <li>discharged for a disability incurred or aggravated in the line of duty</li>
            <li>receiving monetary compensation for VA service-connected disability</li>
            <li>a former Prisoner of War</li>
            <li>in receipt of a Purple Heart</li>
            <li>receiving VA pension</li>
            <li>in receipt of Medicaid benefits</li>
            <li>a recently discharged Combat Veteran, discharged within the past 5 years</li>
          </ul>

          <p>Veterans with qualifying eligibility factors may choose to provide their financial
          information, to qualify for additional benefits like: travel assistance, cost-free medications
          and/or medical care for services unrelated to military experience.</p>

          <div className="input-section">
            <ErrorableCheckbox
                label="I agree to provide my financial information so the VA can determine my eligibility for VA healthcare and if I should be charged for copays and medication."
                checked={this.props.data.provideFinancialInfo}
                onValueChange={(update) => {this.props.onStateChange('provideFinancialInfo', update);}}/>

            <ErrorableCheckbox
                label="I understand VA is not currently enrolling new applicants who decline to provide their financial information unless they have other qualifying eligibility factors."
                checked={this.props.data.understandsFinancialDisclosure}
                onValueChange={(update) => {this.props.onStateChange('understandsFinancialDisclosure', update);}}/>
          </div>

          <div className="input-section">
            <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Click here</a> to view more information about the income thresholds and copayments.
          </div>

        </div>
      </fieldset>);
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/household-information/financial-disclosure'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(FinancialDisclosureSection);
export { FinancialDisclosureSection };
