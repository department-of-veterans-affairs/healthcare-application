import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { validateIfDirty, validateIfDirtyProvider, isNotBlank, isValidInsurancePolicy } from '../../utils/validations';

class Provider extends React.Component {
  render() {
    let content;

    if (this.props.view === 'collapsed') {
      content = this.props.data.insuranceName.value;
    } else {
      content = (
        <div className="input-section">
          <ErrorableTextInput required
              errorMessage={validateIfDirty(this.props.data.insuranceName, isNotBlank) ? undefined : 'Please enter the insurer’s name'}
              label="Name of Provider"
              field={this.props.data.insuranceName}
              onValueChange={(update) => {this.props.onValueChange('insuranceName', update);}}/>

          <ErrorableTextInput required
              errorMessage={validateIfDirty(this.props.data.insurancePolicyHolderName, isNotBlank) ? undefined : 'Please enter the name of the policy holder'}
              label="Name of Policy Holder"
              field={this.props.data.insurancePolicyHolderName}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyHolderName', update);}}/>

          <p>Either the provider's policy number or group code is required.</p>

          <ErrorableTextInput required
              errorMessage={validateIfDirtyProvider(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode, isValidInsurancePolicy) ? undefined : 'Please enter the policy number or group code'}
              label="Policy Number"
              field={this.props.data.insurancePolicyNumber}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyNumber', update);}}/>

          <ErrorableTextInput required
              errorMessage={validateIfDirtyProvider(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode, isValidInsurancePolicy) ? undefined : 'Please enter the policy number or group code'}
              label="Group Code"
              field={this.props.data.insuranceGroupCode}
              onValueChange={(update) => {this.props.onValueChange('insuranceGroupCode', update);}}/>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

Provider.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};

export default Provider;
