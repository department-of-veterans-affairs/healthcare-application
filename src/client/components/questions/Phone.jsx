import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { validateIfDirty, isBlank, isValidPhone } from '../../utils/validations.js';

/**
 * Input component for collecting a Phone number.
 *
 * Validates the input data. Does NOT consider "invalid" phone numbers such
 * as 000-000-0000 to be errors. This is to allow integration testing with
 * fake data.
 *
 * Props:
 * `label` - String. Not required as a prop, can be passed directly to
 *            ErrorableTextInput
 * `required` - Boolean. Render marker indicating field is required.
 * `value` - String. Stores the phone number.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class Phone extends React.Component {
  render() {
    let errorMessage;
    if (this.props.required) {
      errorMessage = validateIfDirty(this.props.value, isValidPhone) ? undefined : 'Phone numbers must be 10 digits and include only numbers (no dashes)';
    } else {
      errorMessage = isBlank(this.props.value.value) || validateIfDirty(this.props.value, isValidPhone) ? undefined : 'Phone numbers must be 10 digits and include only numbers (no dashes)';
    }

    return (
      <div>
        <ErrorableTextInput
            errorMessage={errorMessage}
            label={this.props.label}
            name="phone"
            autocomplete="tel"
            placeholder="xxxxxxxxxx"
            field={this.props.value}
            onValueChange={this.props.onValueChange}/>
      </div>
    );
  }
}

Phone.propTypes = {
  required: React.PropTypes.bool,
  label: React.PropTypes.string,
  value: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool,
  }).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default Phone;
