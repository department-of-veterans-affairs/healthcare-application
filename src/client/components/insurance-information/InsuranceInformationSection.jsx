import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import GrowableTable from '../form-elements/GrowableTable.jsx';
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
      insuranceAddress: makeField(''),
      insuranceCity: makeField(''),
      insuranceCountry: makeField(''),
      insuranceState: makeField(''),
      insuranceZipcode: makeField(''),
      insurancePhone: makeField(''),
      insurancePolicyHolderName: makeField(''),
      insurancePolicyNumber: makeField(''),
      insuranceGroupCode: makeField(''),
    };
  }

  render() {
    let providersTable;
    let content;
    let providers;

    if (this.props.data.isCoveredByHealthInsurance) {
      providersTable = (
        <GrowableTable
            component={Provider}
            createRow={this.createBlankProvider}
            data={this.props.data}
            initializeCurrentElement={() => {this.props.initializeFields();}}
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
        const insuranceAddress = obj.insuranceAddress.value;
        const insuranceCity = obj.insuranceCity.value;
        const insuranceCountry = obj.insuranceCountry.value;
        const insuranceState = obj.insuranceState.value;
        const insuranceZipcode = obj.insuranceZipcode.value;
        const insurancePhone = obj.insurancePhone.value;
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
              <td>Address:</td>
              <td>{insuranceAddress}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{insuranceCity}</td>
            </tr>
            <tr>
              <td>Country:</td>
              <td>{insuranceCountry}</td>
            </tr>
            <tr>
              <td>State:</td>
              <td>{insuranceState}</td>
            </tr>
            <tr>
              <td>ZIP Code:</td>
              <td>{insuranceZipcode}</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td>{insurancePhone}</td>
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
        </table>);
      });
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
      content = (<div>
        <ErrorableCheckbox
            label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
            checked={this.props.data.isCoveredByHealthInsurance}
            onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
        <hr/>
        {providersTable}
      </div>);
    }

    return (
      <fieldset>
        <div className="input-section">
          <h4>Coverage Information</h4>
          {content}
        </div>
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran.insuranceInformation,
    isSectionComplete: state.uiState.completedSections['/insurance-information/general']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(['insuranceInformation', field], update));
    },
    initializeFields: () => {
      dispatch(ensureFieldsInitialized('/insurance-information/general'));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(InsuranceInformationSection);
export { InsuranceInformationSection };
