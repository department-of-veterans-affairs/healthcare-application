import React from 'react';
import { connect } from 'react-redux';

class SubmitMessage extends React.Component {
  render() {
    return (
      <div>
        <div className="medium-2 columns">
          <i className="fa fa-check-circle hca-success-icon"></i>
        </div>
        <div className="medium-10 columns">
          <h4 className="success-copy">You have successfully submitted your application for health care!</h4>
        </div>
        <div>
          <p>We are processing your application. You should receive a phone call from the VA in the next week.</p>
          <div className="success-alert-box">
            <p className="success-copy">Your Form Submission ID: 3623515904</p>
            <p className="success-copy">Form Submitted At: 05/09/2016 10:11am</p>
          </div>
          <p>Please print this page for your records.</p>
          <p>If you do not receive a call from the VA within a week, or you have questions, call 1-877-222-VETS (8387).</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isApplicationSubmitted: state.uiState.applicationSubmitted,
  };
}
// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(SubmitMessage);
export { SubmitMessage };
