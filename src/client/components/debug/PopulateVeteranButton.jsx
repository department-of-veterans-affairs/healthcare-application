import React from 'react';
import { connect } from 'react-redux';
import { completeVeteran } from '../../reducers/veteran';

import { veteranOverwrite } from '../../actions';

/**
 * Button to auto-populate every field in the model with valid data.
 */
class PopulateVeteranButton extends React.Component {
  render() {
    return (
      <button
          className="usa-button-primary"
          onClick={this.props.onClick}>Populate Veteran</button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: () => {
      dispatch(veteranOverwrite(completeVeteran));
    }
  };
}

export default connect(undefined, mapDispatchToProps)(PopulateVeteranButton);
