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

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I understand VA is not currently enrolling new applicants who decline to
            provide their financial information unless they have other qualifying eligibility factors: </td>
            <td>{`${this.props.data.understandsFinancialDisclosure.value === 'Y' ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Financial Disclosure</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <p>You will now be asked to provide your financial information from the
          most recent tax year. We ask for this information for two reasons:</p>

          <ol>
            <li>To determine your eligibility for healthcare if you do not have a
            qualifying eligibility factor</li>
            <li>To determine your eligibility for additional benefits, like travel
            assistance, cost-free medications, and/or waiver of travel deductible</li>
            <li>To determine whether you should be charged for copays and medication</li>
          </ol>

          <div className="usa-alert usa-alert-info">
            <div className="hca-alert-body">
              <p>
                You are not required to provide your financial information. However,
                <strong> if you do not have a qualifying eligibility factor, providing
                your financial information is the only way to determine your eligibility.</strong>
              </p>
            </div>
          </div>

          {/* Move this list to a tooltip in reference above, create new tooltip component */}
          <ul>The qualifying eligibility factors are:
            <li>a former Prisoner of War</li>
            <li>those in receipt of a Purple Heart</li>
            <li>a recently discharged Combat Veteran</li>
            <li>those discharged for a disability incurred or aggravated in the line of duty</li>
            <li>those receiving VA SC disability compensation</li>
            <li>those receiving VA pension</li>
            <li>those in receipt of Medicaid benefits</li>
            <li>those who served in Vietnam between January 9, 1962 and May 7, 1975</li>
            <li>those who served in SW Asia during the Gulf War between August 2, 1990 and November 11, 1998</li>
            <li>those who served at least 30 days at Camp Lejeune between August 1, 1953 and December 31, 1987.</li>
          </ul>

          <div className="input-section">
            <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Learn more</a> about the income thresholds and copayments.
          </div>

          <div className="input-section">
            <ErrorableRadioButtons required
                errorMessage={validateIfDirty(this.props.data.understandsFinancialDisclosure, isNotBlank) ? '' : 'Please select a response'}
                label="I understand VA is not currently enrolling new applicants who decline to provide their financial information unless they have other qualifying eligibility factors."
                name="understandsFinancialDisclosure"
                options={yesNo}
                value={this.props.data.understandsFinancialDisclosure}
                onValueChange={(update) => {this.props.onStateChange('understandsFinancialDisclosure', update);}}/>
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
