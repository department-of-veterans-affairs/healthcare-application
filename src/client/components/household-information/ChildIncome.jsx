import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';

import { isBlank, isValidMonetaryValue, validateIfDirty } from '../../utils/validations';

/**
 * Sub-component for children income portion AnnualIncomeSection.
 *
 * Props:
 * `data` - Collection of numbers for each field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ChildIncome extends React.Component {
  render() {
    const message = 'Please enter only numbers and a decimal point if necessary (no commas or currency signs)';

    return (
      <div>
        <h6>Child: {`${this.props.data.childFullName.first.value} ${this.props.data.childFullName.last.value}`}</h6>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.grossIncome, isBlank) || validateIfDirty(this.props.data.grossIncome, isValidMonetaryValue) ? undefined : message}
            label="Gross Income"
            name="childGrossIncome"
            field={this.props.data.grossIncome}
            onValueChange={(update) => {this.props.onValueChange('grossIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.netIncome, isBlank) || validateIfDirty(this.props.data.netIncome, isValidMonetaryValue) ? undefined : message}
            label="Net Income"
            name="childNetIncome"
            field={this.props.data.netIncome}
            onValueChange={(update) => {this.props.onValueChange('netIncome', update);}}/>
        <ErrorableTextInput
            errorMessage={validateIfDirty(this.props.data.otherIncome, isBlank) || validateIfDirty(this.props.data.otherIncome, isValidMonetaryValue) ? undefined : message}
            label="Other Income"
            name="ChildOtherIncome"
            field={this.props.data.otherIncome}
            onValueChange={(update) => {this.props.onValueChange('otherIncome', update);}}/>
      </div>
    );
  }
}

ChildIncome.propTypes = {
  data: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default ChildIncome;
