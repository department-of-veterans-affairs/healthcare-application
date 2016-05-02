import React from 'react';
import { connect } from 'react-redux';

import DateInput from '../form-elements/DateInput';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import FullName from '../questions/FullName';
import SocialSecurityNumber from '../questions/SocialSecurityNumber';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class WhoAreYouPanel1 extends React.Component {
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
          <FullName required
              name={this.props.data.fullName}
              onUserInput={(update) => {this.props.onStateChange('fullName', update);}}/>
          <SocialSecurityNumber required
              ssn={this.props.data.socialSecurityNumber}
              onValueChange={(update) => {this.props.onStateChange('socialSecurityNumber', update);}}/>
          <DateInput required
              day={this.props.data.dateOfBirth.day}
              month={this.props.data.dateOfBirth.month}
              year={this.props.data.dateOfBirth.year}
              onValueChange={(update) => {this.props.onStateChange('dateOfBirth', update);}}/>
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
    isSectionComplete: state.uiState.completedSections['/who-are-you/panel1']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/who-are-you/panel1'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(WhoAreYouPanel1);
export { WhoAreYouPanel1 };
