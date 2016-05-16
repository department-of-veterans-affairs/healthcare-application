import React from 'react';
import { connect } from 'react-redux';

class ReviewAndSubmitSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Submit Message</h4>
        <p>Please ensure all of your information is correct before submitting your application.</p>
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
export default connect(mapStateToProps)(ReviewAndSubmitSection);
export { ReviewAndSubmitSection };
