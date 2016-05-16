import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import { yesNo } from '../../utils/options-for-select';
import { validateIfDirty, isNotBlank } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class FinancialDisclosureSection extends React.Component {
  render() {
    let content;
    let understandsFinancialDisclosure;

    if (this.props.data.provideFinancialInfo.value === 'N') {
      understandsFinancialDisclosure = (<div>
        <ErrorableRadioButtons
            label="I understand VA is not currently enrolling new applicants who decline to provide their financial information unless they have other qualifying eligibility factors."
            options={yesNo}
            value={this.props.data.understandsFinancialDisclosure}
            onValueChange={(update) => {this.props.onStateChange('understandsFinancialDisclosure', update);}}/>
      </div>);
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I agree to provide my financial information so the VA can determine my eligibility
             for VA healthcare and if I should be charged for copays and medication.:
            </td>
            <td>{`${this.props.data.provideFinancialInfo === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>I understand VA is not currently enrolling new applicants who decline to
            provide their financial information unless they have other qualifying eligibility factors: </td>
            <td>{`${this.props.data.understandsFinancialDisclosure === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Financial Disclosure</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <p>You will now be asked to provide your financial information from the
          most recent tax year. We ask for this information for 2 reasons:</p>

          <ol>
            <li>To determine your eligibility for healthcare if you do not have a
            qualifying eligibility factor</li>
            <li>To determine your eligibility for additional benefits, like travel
            assistance, cost-free medications, and/or medical care unrelated to
            military experience</li>
          </ol>

          <p>
            You are not required to provide your financial information. However,
            <strong> if you do not have a qualifying eligibility factor, providing
            your financial information is the only way to determine your eligibility.</strong>
          </p>

          {/* Move this list to a tooltip in reference above, create new tooltip component */}
          <ul>The qualifying eligibility factors are:
            <li>discharged for a disability incurred or aggravated in the line of duty</li>
            <li>receiving monetary compensation for VA service-connected disability</li>
            <li>a former Prisoner of War</li>
            <li>in receipt of a Purple Heart</li>
            <li>receiving VA pension</li>
            <li>in receipt of Medicaid benefits</li>
            <li>a recently discharged Combat Veteran, discharged within the past 5 years</li>
          </ul>

          <div className="input-section">
            <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Click here</a> to view more information about the income thresholds and copayments.
          </div>

          <div className="input-section">
            <ErrorableRadioButtons required
                errorMessage={validateIfDirty(this.props.data.provideFinancialInfo, isNotBlank) ? '' : 'Please select a response'}
                label="I agree to provide my financial information so the VA can determine my eligibility for VA healthcare and if I should be charged for copays and medication."
                options={yesNo}
                value={this.props.data.provideFinancialInfo}
                onValueChange={(update) => {this.props.onStateChange('provideFinancialInfo', update);}}/>

            {understandsFinancialDisclosure}
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
