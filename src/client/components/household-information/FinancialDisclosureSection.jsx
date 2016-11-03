import React from 'react';
import { connect } from 'react-redux';

import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import { isValidFinancialDisclosure } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

import { yesNo } from '../../utils/options-for-select.js';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class FinancialDisclosureSection extends React.Component {
  render() {
    let content;
    let message;

    if (this.props.data.understandsFinancialDisclosure.value === 'N') {
      message = (
        <div className="usa-alert usa-alert-info">
          <div className="hca-alert-body">
            <p>If you don't provide your financial information and you don't have another qualifying eligibility factor, VA can't enroll you.</p>
          </div>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>I understand VA is not currently enrolling new applicants who decline to
            provide their financial information unless they have other qualifying eligibility factors: </td>
            <td>{`${this.props.data.understandsFinancialDisclosure.value ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Financial Disclosure</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <div className="input-section">
          <p>Next, we'll ask you to provide your financial information from the most recent
          tax year, which we will verify with the IRS. This information allows us to determine:</p>

          <ol>
            <li>Your eligibility for health care if you don't have another qualifying factor</li>
            <li>Your eligibility for additional benefits, like travel assistance or cost-free medications</li>
            <li>Whether you should be charged for copays and medication</li>
          </ol>

          <div className="usa-alert usa-alert-info">
            <div className="hca-alert-body">
              <p>
                Note: You don't have to provide your financial information. But if you don't have a qualifying
                eligibility factor, this information is the only other way to determine your eligiblity. This
                information also allows us to see if you should receive additional benefits like travel assistance
                or waived copays.
              </p>
            </div>
          </div>

          <ul>Qualifying eligibility factors:
            <li>Former prisoners of war</li>
            <li>Received a Purple Heart</li>
            <li>Recently discharged combat Veteran</li>
            <li>Discharged for a disability that was acquired or became worse in the line of duty</li>
            <li>Receiving VA service-connected disability compensation</li>
            <li>Receiving a VA pension</li>
            <li>Receiving Medicaid benefits</li>
            <li>Served in Vietnam between January 9, 1962, and May 7, 1975</li>
            <li>Served in Southwest Asia during the Gulf War between August 2, 1990, and November 11, 1998</li>
            <li>Served at least 30 days at Camp Lejeune between August 1, 1953, and December 31, 1987</li>
          </ul>

          <div className="input-section">
            <a target="_blank" href="http://www.va.gov/healthbenefits/cost/income_thresholds.asp">Learn more</a> about our income thresholds and copayments.
          </div>

          <div className="input-section">
            <ErrorableRadioButtons required
                errorMessage={isValidFinancialDisclosure(this.props.data) ? '' : 'Please select either "Yes" or "No"'}
                label="I understand VA is not currently enrolling new applicants who decline to provide their financial information unless they have other qualifying eligibility factors."
                name="understandsFinancialDisclosure"
                options={yesNo}
                value={this.props.data.understandsFinancialDisclosure}
                onValueChange={(update) => {this.props.onStateChange('understandsFinancialDisclosure', update);}}/>
          </div>
          {message}
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
