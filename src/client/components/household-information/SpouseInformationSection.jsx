import React from 'react';
import { connect } from 'react-redux';

import * as calculated from '../../store/calculated';
import Address from '../questions/Address';
import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableRadioButtons from '../form-elements/ErrorableRadioButtons';
import FullName from '../questions/FullName';
import Phone from '../questions/Phone';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import { maritalStatuses, yesNo } from '../../utils/options-for-select.js';
import { isNotBlank, validateIfDirty, isValidMarriageDate } from '../../utils/validations';
import { veteranUpdateField, updateSpouseAddress } from '../../actions';

// TODO: Consider adding question for marital status here so if user
// entered something incorrect in Personal Information they don't have
// to return to that section to change response

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class SpouseInformationSection extends React.Component {
  render() {
    let noSpouseMessage;
    let content;
    let spouseInformationSummary;
    let spouseInformationFields;
    let spouseAddressSummary;
    let spouseAddressFields;

    if (this.props.data.maritalStatus.value === 'Married' || this.props.data.maritalStatus.value === 'Separated') {
      spouseInformationSummary = (
        <tbody>
          <tr>
            <td>Spouse Name:</td>
            <td>{this.props.data.spouseFullName.first.value} {this.props.data.spouseFullName.middle.value} {this.props.data.spouseFullName.last.value} {this.props.data.spouseFullName.suffix.value}</td>
          </tr>
          <tr>
            <td>Social Security Number:</td>
            <td>{this.props.data.spouseSocialSecurityNumber.value}</td>
          </tr>
          <tr>
            <td>Date of Birth:</td>
            <td>{this.props.data.spouseDateOfBirth.month.value}/{this.props.data.spouseDateOfBirth.day.value}/{this.props.data.spouseDateOfBirth.year.value}</td>
          </tr>
          <tr>
            <td>Date of Marriage:</td>
            <td>{this.props.data.dateOfMarriage.month.value}/{this.props.data.dateOfMarriage.day.value}/{this.props.data.dateOfMarriage.year.value}</td>
          </tr>
          <tr>
            <td>Do you have the same address as your spouse?:</td>
            <td>{`${this.props.data.sameAddress ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>Did your spouse live with you last year?:</td>
            <td>{`${this.props.data.cohabitedLastYear ? 'Yes' : 'No'}`}</td>
          </tr>
          <tr>
            <td>If your spouse did not live with you last year, did you provide support?:</td>
            <td>{`${this.props.data.provideSupportLastYear ? 'Yes' : 'No'}`}</td>
          </tr>
        </tbody>
      );

      spouseInformationFields = (
        <div className="input-section">
          <FullName required
              name={this.props.data.spouseFullName}
              onUserInput={(update) => {this.props.onStateChange('spouseFullName', update);}}/>

          <SocialSecurityNumber required
              label="Spouse’s Social Security Number"
              ssn={this.props.data.spouseSocialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('spouseSocialSecurityNumber', update);}}/>

          <DateInput required
              label="Spouse’s Date of Birth"
              day={this.props.data.spouseDateOfBirth.day}
              month={this.props.data.spouseDateOfBirth.month}
              year={this.props.data.spouseDateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('spouseDateOfBirth', update);}}/>

          <DateInput required
              errorMessage="Date of marriage cannot be before veteran's or spouse's date of birth"
              validation={isValidMarriageDate(this.props.data.dateOfMarriage, this.props.data.veteranDateOfBirth, this.props.data.spouseDateOfBirth)}
              label="Date of Marriage"
              day={this.props.data.dateOfMarriage.day}
              month={this.props.data.dateOfMarriage.month}
              year={this.props.data.dateOfMarriage.year}
              onValueChange={(update) => {this.props.onStateChange('dateOfMarriage', update);}}/>

          <ErrorableRadioButtons required
              errorMessage={validateIfDirty(this.props.data.sameAddress, isNotBlank) ? '' : 'Please select a response'}
              label="Do you have the same address as your spouse?"
              options={yesNo}
              value={this.props.data.sameAddress}
              onValueChange={(update) => {this.props.onStateChange('sameAddress', update);}}/>

          <ErrorableCheckbox
              label="Did your spouse live with you last year?"
              checked={this.props.data.cohabitedLastYear}
              onValueChange={(update) => {this.props.onStateChange('cohabitedLastYear', update);}}/>
          <hr/>
          <p>You may count your spouse as your dependent even if you did not live
          together, as long as you contributed support last calendar year.</p>
          <hr/>
          <ErrorableCheckbox
              label="If your spouse did not live with you last year, did you provide support?"
              checked={this.props.data.provideSupportLastYear}
              onValueChange={(update) => {this.props.onStateChange('provideSupportLastYear', update);}}/>
        </div>
      );
    }

    if (this.props.data.sameAddress.value === 'N') {
      spouseAddressSummary = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>
          <table className="review usa-table-borderless">
            <tbody>
              <tr>
                <td>Street:</td>
                <td>{this.props.data.spouseAddress.street.value}</td>
              </tr>
              <tr>
                <td>City:</td>
                <td>{this.props.data.spouseAddress.city.value}</td>
              </tr>
              <tr>
                <td>Country:</td>
                <td>{this.props.data.spouseAddress.country.value}</td>
              </tr>
              <tr>
                <td>State:</td>
                <td>{this.props.data.spouseAddress.state.value}</td>
              </tr>
              <tr>
                <td>ZIP Code:</td>
                <td>{this.props.data.spouseAddress.zipcode.value}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>{this.props.data.spousePhone.value}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      spouseAddressFields = (
        <div>
          <h4>Spouse's Address and Telephone Number</h4>
          <div className="input-section">
            <Address required
                value={this.props.data.spouseAddress}
                onUserInput={(update) => {this.props.onStateChange('spouseAddress', update);}}/>
            <Phone
                label="Phone"
                value={this.props.data.spousePhone}
                onValueChange={(update) => {this.props.onStateChange('spousePhone', update);}}/>
          </div>
        </div>
      );
    }

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<div>
        <table className="review usa-table-borderless">
          <tbody>
            <tr>
              <td>Martial Status:</td>
              <td>{this.props.data.maritalStatus.value}</td>
            </tr>
          </tbody>
          {spouseInformationSummary}
        </table>
        {spouseAddressSummary}
      </div>);
    } else {
      content = (<fieldset>
        <legend>Spouse's Information</legend>
        <p>(<span className="hca-required-span">*</span>) Indicates a required field</p>
        <p>Please fill this out to the best of your knowledge. The more accurate your responses, the faster your application can proceed.</p>
        <div className="input-section">
          <ErrorableSelect
              errorMessage={validateIfDirty(this.props.data.maritalStatus, isNotBlank) ? undefined : 'Please select a marital status'}
              label="Current Marital Status"
              options={maritalStatuses}
              required
              value={this.props.data.maritalStatus}
              onValueChange={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
          {noSpouseMessage}
          {spouseInformationFields}
          {spouseAddressFields}
        </div>
      </fieldset>);
    }

    if (this.props.neverMarried === true) {
      noSpouseMessage = (
        <p>
          <strong>
            You are not required to enter financial information because you
            indicated you've never had a spouse.
          </strong>
        </p>
      );
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
    neverMarried: calculated.neverMarried(state),
    isSectionComplete: state.uiState.sections['/household-information/spouse-information'].complete
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
      if (field === 'sameAddress') {
        dispatch(updateSpouseAddress('spouseAddress', update));
      }
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(SpouseInformationSection);
export { SpouseInformationSection };
