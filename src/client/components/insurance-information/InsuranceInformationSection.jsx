import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
import AdditionalInformationSection from './AdditionalInformationSection.jsx';
import Provider from './Provider.jsx';
import { veteranUpdateField, ensureFieldsInitialized } from '../../actions';

import { makeField } from '../../reducers/fields';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class InsuranceInformationSection extends React.Component {
  // TODO(awong): Pull this out into a model.
  createBlankProvider() {
    return {
      insuranceName: makeField(''),
      insurancePolicyHolderName: makeField(''),
      insurancePolicyNumber: makeField(''),
      insuranceGroupCode: makeField(''),
    };
  }

  render() {
    let providersTable;
    let content;
    let medicarePartA;
    let providers;
    const fields = ['insuranceName', 'insurancePolicyHolderName', 'insurancePolicyNumber', 'insuranceGroupCode'];

    if (this.props.data.isCoveredByHealthInsurance) {
      providersTable = (
        <GrowableTable
            component={Provider}
            createRow={this.createBlankProvider}
            data={this.props.data}
            initializeCurrentElement={() => {this.props.initializeFields(fields);}}
            onRowsUpdate={(update) => {this.props.onStateChange('providers', update);}}
            path="/insurance-information/general"
            rows={this.props.data.providers}/>
      );
    }


    if (this.props.data.providers) {
      const providersList = this.props.data.providers;
      let reactKey = 0;
      let providerIndex = 0;
      providers = providersList.map((obj) => {
        const insuranceName = obj.insuranceName.value;
        const insurancePolicyHolderName = obj.insurancePolicyHolderName.value;
        const insurancePolicyNumber = obj.insurancePolicyNumber.value;
        const insuranceGroupCode = obj.insuranceGroupCode.value;
        return (<table key={++reactKey} className="review usa-table-borderless">
          <thead>
            <tr>
              <td scope="col">Provider {++providerIndex}</td>
              <td scope="col"></td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{insuranceName}</td>
            </tr>
            <tr>
              <td>Policy Holder Name:</td>
              <td>{insurancePolicyHolderName}</td>
            </tr>
            <tr>
              <td>Policy Number:</td>
              <td>{insurancePolicyNumber}</td>
            </tr>
            <tr>
              <td>Group Code:</td>
              <td>{insuranceGroupCode}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td>Are you eligible for Medicaid?:</td>
              <td>{`${this.props.data.isMedicaidEligible ? 'Yes' : 'No'}`}</td>
            </tr>
            <tr>
              <td>Are you enrolled in Medicare Part A (hospital insurance):</td>
              <td>{`${this.props.data.isEnrolledMedicarePartA ? 'Yes' : 'No'}`}</td>
            </tr>
            {medicarePartA}
          </tbody>
        </table>);
      });
    }

    if (this.props.data.isEnrolledMedicarePartA) {
      medicarePartA = (<tr>
        <td>If so, what is your Medicare Part A effective date?:</td>
        <td>{this.props.data.medicarePartAEffectiveDate.month.value}
        /{this.props.data.medicarePartAEffectiveDate.day.value}/
        {this.props.data.medicarePartAEffectiveDate.year.value}</td>
      </tr>);
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Are you covered by health insurance? (Including coverage through a spouse or another person):</td>
              <td>{`${this.props.data.isCoveredByHealthInsurance ? 'Yes' : 'No'}`}</td>
            </tr>
          </tbody>
        </table>
      {providers}
      </div>);
    } else {
      content = (<fieldset>
        <legend>Coverage Information</legend>
        <ErrorableCheckbox
            label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
            checked={this.props.data.isCoveredByHealthInsurance}
            onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
        <hr/>
        {providersTable}
        <div className="input-section">
          <ErrorableCheckbox
              label="Are you eligible for Medicaid?"
              checked={this.props.data.isMedicaidEligible}
              onValueChange={(update) => {this.props.onStateChange('isMedicaidEligible', update);}}/>
          <div>Medicaid is a United States Health program for eligible individuals and
          families with low income and resources.</div>
          <ErrorableCheckbox
              label="Are you enrolled in Medicare Part A (hospital insurance)"
              checked={this.props.data.isEnrolledMedicarePartA}
              onValueChange={(update) => {this.props.onStateChange('isEnrolledMedicarePartA', update);}}/>
          <div>Medicare is a social insurance program administered by the United
          States government, providing health insurance coverage to people aged
          65 and over, or who meet special criteria.</div>
          <DateInput label="If so, what is your Medicare Part A effective date?"
              day={this.props.data.medicarePartAEffectiveDate.day}
              month={this.props.data.medicarePartAEffectiveDate.month}
              year={this.props.data.medicarePartAEffectiveDate.year}
              onValueChange={(update) => {this.props.onStateChange('medicarePartAEffectiveDate', update);}}/>
        </div>
        <AdditionalInformationSection/>
      </fieldset>);
    }

    return (
      <div className="input-section">
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.sections['/insurance-information/general'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    initializeFields: (fields) => {
      dispatch(ensureFieldsInitialized(fields, 'providers'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(InsuranceInformationSection);
export { InsuranceInformationSection };
