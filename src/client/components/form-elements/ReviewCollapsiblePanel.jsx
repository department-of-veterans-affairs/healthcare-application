import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import ErrorableCheckbox from './ErrorableCheckbox';
import { updateReviewStatus } from '../../actions';


/**
 * A component for the review section to validate information is correct.
 *
 * Required props
 */

class ReviewCollapsiblePanel extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId();
  }

  render() {
    let panelAction;
    let editButton;
    const currentPath = this.props.updatePath;
    const sectionsComplete = this.props.uiData.completedSections[currentPath];


    if (sectionsComplete) {
      panelAction = (<ErrorableCheckbox
          label="I certify that all information above is correct to the best of my knowledge."
          checked={this.props.value}
          onValueChange={(update) => {this.props.onStateChange('vietnamService', update);}}/>);
    } else {
      panelAction = (<button>Save</button>
        );
    }

    editButton = (<ErrorableCheckbox
        label={`${sectionsComplete ? 'Edit' : 'Update'}`}
        checked={sectionsComplete}
        className="edit-checkbox"
        onValueChange={(update) => {this.props.onUIStateChange(currentPath, update);}}/>
    );


    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered">
        <ul className="usa-unstyled-list">
          <li>
            <button className="usa-button-unstyled" aria-expanded="true" aria-controls="collapsible-0">
              {this.props.sectionLabel} {editButton}
            </button>
            <div id="collapsible-0" aria-hidden="false" className="usa-accordion-content">
              {this.props.component}
              {panelAction}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    uiData: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUIStateChange: (path, update) => {
      dispatch(updateReviewStatus(path, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ReviewCollapsiblePanel);
export { ReviewCollapsiblePanel };
