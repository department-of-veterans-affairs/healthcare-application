import React from 'react';
import { connect } from 'react-redux';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isValidField, isValidMonetaryValue } from '../../utils/validations';
import { veteranUpdateField } from '../../actions';

function getErrorMessage(field, message) {
  return isValidField(isValidMonetaryValue, field) ? undefined : message;
}

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class DeductibleExpensesSection extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let notRequiredMessage;
    let content;

    if (this.props.data.receivesVaPension === true) {
      notRequiredMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you are receiving a VA pension.
          </strong>
        </p>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Total non-reimbursed medical expenses paid by you or your spouse:</td>
            <td>{this.props.data.deductibleMedicalExpenses.value}</td>
          </tr>
          <tr>
            <td>Amount you paid last calendar year for funeral and burial expenses
         for your deceased spouse or dependent child:
            </td>
            <td>{this.props.data.deductibleFuneralExpenses.value}</td>
          </tr>
          <tr>
            <td>Amount you paid last calendar year for your college or vocational
              educational expenses:
            </td>
            <td>{this.props.data.deductibleEducationExpenses.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<fieldset>
        <legend>Previous calendar year deductible expenses</legend>
        {notRequiredMessage}

        <p>
          Tell us a bit about your expenses this past calendar year. Enter information for any expenses that apply to you.
        </p>

        <div className="input-section">
          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.deductibleMedicalExpenses, message)}
              label="Amount you or your spouse paid in non-reimbursable medical expenses this past year."
              field={this.props.data.deductibleMedicalExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleMedicalExpenses', update);}}/>

          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.deductibleFuneralExpenses, message)}
              label="Amount you paid in funeral or burial expenses for a deceased spouse or child this past year."
              field={this.props.data.deductibleFuneralExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleFuneralExpenses', update);}}/>

          <ErrorableTextInput
              errorMessage={getErrorMessage(this.props.data.deductibleEducationExpenses, message)}
              label="Amount you paid for anything related to your own education (college or vocational) this past year. Do not list your dependent's educational expenses."
              field={this.props.data.deductibleEducationExpenses}
              onValueChange={(update) => {this.props.onStateChange('deductibleEducationExpenses', update);}}/>
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
    isSectionComplete: state.uiState.sections['/household-information/deductible-expenses'].complete
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
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(DeductibleExpensesSection);
export { DeductibleExpensesSection };
