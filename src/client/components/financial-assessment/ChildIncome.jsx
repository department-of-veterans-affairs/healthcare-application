import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';

import { isBlank, isValidMonetaryValue, validateIfDirty } from '../../utils/validations';

/**
 * Sub-component for children income portion AnnualIncomeSection.
 *
 * Props:
 * `data` - Collection of numbers for each field.
 * `relatedData` - Used to pass down child information data.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ChildIncome extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <h6>Child: {`${this.props.relatedData.childFullName.first.value} ${this.props.relatedData.childFullName.last.value}`}</h6>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.childGrossIncome, isBlank) || validateIfDirty(this.props.data.childGrossIncome, isValidMonetaryValue) ? undefined : message}
            label="Gross Income"
            field={this.props.data.childGrossIncome}
            onValueChange={(update) => {this.props.onValueChange('childGrossIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.childNetIncome, isBlank) || validateIfDirty(this.props.data.childNetIncome, isValidMonetaryValue) ? undefined : message}
            label="Net Income"
            field={this.props.data.childNetIncome}
            onValueChange={(update) => {this.props.onValueChange('childNetIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.childOtherIncome, isBlank) || validateIfDirty(this.props.data.childOtherIncome, isValidMonetaryValue) ? undefined : message}
            label="Other Income"
            field={this.props.data.childOtherIncome}
            onValueChange={(update) => {this.props.onValueChange('childOtherIncome', update);}}/>
      </div>
    );
  }
}

ChildIncome.propTypes = {
  data: React.PropTypes.object.isRequired,
  relatedData: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default ChildIncome;
