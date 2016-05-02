import React from 'react';
import { connect } from 'react-redux';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import Gender from '../questions/Gender';
import MothersMaidenName from './MothersMaidenName';
import { maritalStatuses, states } from '../../utils/options-for-select.js';
import { isNotBlank, validateIfDirty } from '../../utils/validations';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class WhoAreYouPanel2 extends React.Component {
  render() {
    let content;
    let editButton;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Veteran Name:</td>
            <td>{this.props.data.fullName.first.value} {this.props.data.fullName.middle.value} {this.props.data.fullName.last.value} {this.props.data.fullName.suffix.value}</td>
          </tr>
          <tr>
            <td>Date of Birth:</td>
            <td>{this.props.data.dateOfBirth.month.value}/{this.props.data.dateOfBirth.day.value}/{this.props.data.dateOfBirth.year.value}</td>
          </tr>
          <tr>
            <td>Social Security Number:</td>
            <td>{this.props.data.socialSecurityNumber}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div>
        <div className="input-section">
          <Gender required
              value={this.props.data.gender}
              onUserInput={(update) => {this.props.onStateChange('gender', update);}}/>
          <ErrorableSelect
              errorMessage={validateIfDirty(this.props.data.maritalStatus, isNotBlank) ? undefined : 'Please select a marital status'}
              label="Current Marital Status"
              options={maritalStatuses}
              required
              value={this.props.data.maritalStatus}
              onValueChange={(update) => {this.props.onStateChange('maritalStatus', update);}}/>
          <MothersMaidenName value={this.props.data.mothersMaidenName}
              onUserInput={(update) => {this.props.onStateChange('mothersMaidenName', update);}}/>
          <h4>Place of Birth</h4>
          <ErrorableTextInput label="City"
              field={this.props.data.cityOfBirth}
              onValueChange={(update) => {this.props.onStateChange('cityOfBirth', update);}}/>
          <ErrorableSelect label="State"
              options={states.USA}
              value={this.props.data.stateOfBirth}
              onValueChange={(update) => {this.props.onStateChange('stateOfBirth', update);}}/>
        </div>
      </div>);
    }

    if (this.props.reviewSection) {
      editButton = (<ErrorableCheckbox
          label={`${this.props.isSectionComplete ? 'Edit' : 'Update'}`}
          checked={this.props.isSectionComplete}
          className="edit-checkbox"
          onValueChange={(update) => {this.props.onUIStateChange(update);}}/>
      );
    }

    return (
      <fieldset>
        <h4>Veteran's Name</h4>
        {editButton}
        {content}
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.completedSections['/who-are-you/panel2']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/who-are-you/panel2'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(WhoAreYouPanel2);
export { WhoAreYouPanel2 };
