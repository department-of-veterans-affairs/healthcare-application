import React from 'react';
import { connect } from 'react-redux';

import Email from '../questions/Email';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import Phone from '../questions/Phone';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class HowDoWeReachYouPanel2 extends React.Component {

  confirmEmail() {
    if (this.props.data.veteranEmail.value !== this.props.data.veteranEmailConfirmation.value) {
      return 'Please ensure your entries match';
    }

    return undefined;
  }

  render() {
    let content;
    let editButton;

    if (this.props.isSectionComplete && this.props.reviewSection) {
      content = (<table className="review usa-table-borderless">
        <tbody>
          <tr>
            <td>Email Address:</td>
            <td>{this.props.data.veteranEmail.value}</td>
          </tr>
          <tr>
            <td>Re-enter Email address:</td>
            <td>{this.props.data.veteranEmailConfirmation.value}</td>
          </tr>
          <tr>
            <td>Home telephone number:</td>
            <td>{this.props.data.veteranHomePhone.value}</td>
          </tr>
          <tr>
            <td>Mobile telephone number:</td>
            <td>{this.props.data.veteranMobilePhone.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div className="input-section">
        <p>For locations outside the U.S., enter "City,Country" in the City field
            (e.g., "Paris,France"), and select Foreign Country for State.
        </p>

        <Email label="Email address"
            email={this.props.data.veteranEmail}
            onValueChange={(update) => {this.props.onStateChange('veteranEmail', update);}}/>

        <Email error={this.confirmEmail()}
            label="Re-enter Email address"
            email={this.props.data.veteranEmailConfirmation}
            onValueChange={(update) => {this.props.onStateChange('veteranEmailConfirmation', update);}}/>

        <Phone required
            label="Home telephone number"
            value={this.props.data.veteranHomePhone}
            onValueChange={(update) => {this.props.onStateChange('veteranHomePhone', update);}}/>

        <Phone required
            label="Mobile telephone number"
            value={this.props.data.veteranMobilePhone}
            onValueChange={(update) => {this.props.onStateChange('veteranMobilePhone', update);}}/>
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
      <fieldset >
        <div>
          <h4>Permanent Address</h4>
          {editButton}
          {content}
        </div>
      </fieldset>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.veteran,
    isSectionComplete: state.uiState.completedSections['/how-do-we-reach-you/panel2']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/how-do-we-reach-you/panel2'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(HowDoWeReachYouPanel2);
export { HowDoWeReachYouPanel2 };
