import React from 'react';
import { connect } from 'react-redux';

import Address from '../questions/Address';
import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { updateReviewStatus, veteranUpdateField } from '../../actions';

/**
 * Props:
 * `isSectionComplete` - Boolean. Marks the section as completed. Provides styles for completed sections.
 * `reviewSection` - Boolean. Hides components that are only needed for ReviewAndSubmitSection.
 */
class HowDoWeReachYouPanel1 extends React.Component {
  constructor() {
    super();
    this.confirmEmail = this.confirmEmail.bind(this);
  }

  confirmEmail() {
    if (this.props.data.email.value !== this.props.data.emailConfirmation.value) {
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
            <td>Street:</td>
            <td>{this.props.data.veteranAddress.street.value}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{this.props.data.veteranAddress.city.value}</td>
          </tr>
          <tr>
            <td>Country:</td>
            <td>{this.props.data.veteranAddress.country.value}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{this.props.data.veteranAddress.state.value}</td>
          </tr>
          <tr>
            <td>ZIP Code:</td>
            <td>{this.props.data.veteranAddress.zipcode.value}</td>
          </tr>
          <tr>
            <td>County:</td>
            <td>{this.props.data.veteranCounty.value}</td>
          </tr>
        </tbody>
      </table>);
    } else {
      content = (<div className="input-section">
        <p>How can we contact you?
         This will help ensure that we can reach you with the information that matters to you most.
        </p>

        <Address value={this.props.data.veteranAddress}
            onUserInput={(update) => {this.props.onStateChange('veteranAddress', update);}}/>

        <ErrorableTextInput label="County"
            field={this.props.data.veteranCounty}
            onValueChange={(update) => {this.props.onStateChange('veteranCounty', update);}}/>
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
    isSectionComplete: state.uiState.completedSections['/how-do-we-reach-you/panel1']
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onStateChange: (field, update) => {
      dispatch(veteranUpdateField(field, update));
    },
    onUIStateChange: (update) => {
      dispatch(updateReviewStatus(['/how-do-we-reach-you/panel1'], update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(HowDoWeReachYouPanel1);
export { HowDoWeReachYouPanel1 };
