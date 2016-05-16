import React from 'react';
import { connect } from 'react-redux';

import ChildIncome from './ChildIncome';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import FixedTable from '../form-elements/FixedTable.jsx';
import { isValidField, isValidMonetaryValue } from '../../utils/validations';
import { createChildIncomeFields, veteranUpdateField } from '../../actions';

function getErrorMessage(field, message) {
  return isValidField(isValidMonetaryValue, field) ? undefined : message;
}

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class AnnualIncomeSection extends React.Component {
  componentWillMount() {
    this.props.initializeChildIncomeFields();
  }

  // TODO: Figure out best way to enable users to change their response to pension
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';
    let childrenIncomeInput;
    let childrenIncomeReview;
    let content;

    if (this.props.data.hasChildrenToReport === true) {
      childrenIncomeInput = (
        <div className="input-section">
          <FixedTable
              component={ChildIncome}
              onRowsUpdate={(update) => {this.props.onStateChange('childrenIncome', update);}}
              relatedData={this.props.data.children}
              rows={this.props.data.childrenIncome}/>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      const childrenData = this.props.data.children;
      let reactKey = 0;
      childrenIncomeReview = this.props.data.childrenIncome.map((obj, index) => {
        return (
          <div key={reactKey++}>
            <h6>Child: {`${childrenData[index].childFullName.first.value} ${childrenData[index].childFullName.last.value}`}</h6>
            <table className="review usa-table-borderless">
              <tbody>
                <tr>
                  <td>Children Gross Income:</td>
                  <td>{obj.childGrossIncome.value}</td>
                </tr>
                <tr>
                  <td>Children Net Income:</td>
                  <td>{obj.childNetIncome.value}</td>
                </tr>
                <tr>
                  <td>Children Other Income:</td>
                  <td>{obj.childOtherIncome.value}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      });

      content = (
        <div>
          <h6>Veteran</h6>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Veteran Gross Income:</td>
                <td>{this.props.data.veteranGrossIncome.value}</td>
              </tr>
              <tr>
                <td>Veteran Net Income:</td>
                <td>{this.props.data.veteranNetIncome.value}</td>
              </tr>
              <tr>
                <td>Veteran Other Income:</td>
                <td>{this.props.data.veteranOtherIncome.value}</td>
              </tr>
            </tbody>
          </table>
          <h6>Spouse</h6>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Spouse Gross Income:</td>
                <td>{this.props.data.spouseGrossIncome.value}</td>
              </tr>
              <tr>
                <td>Spouse Net Income:</td>
                <td>{this.props.data.spouseNetIncome.value}</td>
              </tr>
              <tr>
                <td>Spouse Other Income:</td>
                <td>{this.props.data.spouseOtherIncome.value}</td>
              </tr>
            </tbody>
          </table>

          {childrenIncomeReview}

        </div>
      );
    } else {
      content = (<fieldset>
        <legend>Annual Income</legend>

        <div>

          <h5></h5>

          <p>
          Please fill these out to the best of your knowledge. You should provide the previous calendar year gross
          annual income of veteran, spouse and dependent children.
          </p>

          <p><strong>Gross annual income</strong>: Gross (pre-tax) annual income last year</p>
          <p><strong>Net income</strong>: Net income from a farm, ranch, property, or business last year</p>
          <p><strong>Other income</strong>: Other sources of income, including retirement and pension income,
          Social Security, VA disability compensation, unemployment, interest, and dividends</p>

          <div className="input-section">
            <h6>Veteran</h6>
            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranGrossIncome, message)}
                label="Veteran Gross Income"
                field={this.props.data.veteranGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranNetIncome, message)}
                label="Veteran Net Income"
                field={this.props.data.veteranNetIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.veteranOtherIncome, message)}
                label="Veteran Other Income"
                field={this.props.data.veteranOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('veteranOtherIncome', update);}}/>
          </div>

          <div className="input-section">
            <h6>Spouse</h6>
            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.spouseGrossIncome, message)}
                label="Spouse Gross Income"
                field={this.props.data.spouseGrossIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseGrossIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.spouseNetIncome, message)}
                label="Spouse Net Income"
                field={this.props.data.spouseNetIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseNetIncome', update);}}/>

            <ErrorableTextInput
                errorMessage={getErrorMessage(this.props.data.spouseOtherIncome, message)}
                label="Spouse Other Income"
                field={this.props.data.spouseOtherIncome}
                onValueChange={(update) => {this.props.onStateChange('spouseOtherIncome', update);}}/>
          </div>

          {childrenIncomeInput}

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
    isSectionComplete: state.uiState.sections['/household-information/annual-income'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    initializeChildIncomeFields: () => {
      dispatch(createChildIncomeFields('/household-information/annual-income'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(AnnualIncomeSection);
export { AnnualIncomeSection };
