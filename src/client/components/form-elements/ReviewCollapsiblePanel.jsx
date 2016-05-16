import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import ErrorableCheckbox from './ErrorableCheckbox';
import { updateIncompleteStatus, updateVerifiedStatus, updateCompletedStatus } from '../../actions';


/**
 * A component for the review section to validate information is correct.
 *
 * Required props
 */


class ReviewCollapsiblePanel extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId();
  }

  handleSave() {
    const currentPath = this.props.updatePath;
    this.props.onUpdateSaveStatus(currentPath);
  }

  handleEdit() {
    const currentPath = this.props.updatePath;
    this.props.onUpdateEditStatus(currentPath);
    this.props.onUpdateVerifiedStatus(currentPath, false);
  }

  render() {
    let panelAction;
    let editButton;
    let verifiedLabel;
    let hiddenSection;
    const currentPath = this.props.updatePath;
    const sectionsComplete = this.props.uiData.sections[currentPath].complete;
    const sectionsVerified = this.props.uiData.sections[currentPath].verified;


    if (sectionsComplete) {
      panelAction = (<ErrorableCheckbox
          label="I certify that all information above is correct to the best of my knowledge."
          checked={this.props.value}
          onValueChange={(update) => {this.props.onUpdateVerifiedStatus(currentPath, update);}}/>);

      editButton = (<button
          className="edit-btn"
          onClick={this.handleEdit}>Edit Section</button>
      );
    } else {
      panelAction = (<button
          className="usa-button-outline"
          onClick={this.handleSave}>Update Section</button>
        );
    }

    if (sectionsVerified) {
      verifiedLabel = (
        <div className="verify-label">
          <span className="usa-label">&#10004; I have reviewed</span>
        </div>);
    }

    const allSections = Object.keys(this.props.uiData.sections);
    const sectionIndexes = allSections.indexOf(currentPath);
    const prevPath = allSections[sectionIndexes - 1];

    if (sectionsVerified) {
      hiddenSection = (<div></div>);
    } else {
      if (this.props.uiData.sections[prevPath].verified || currentPath === '/veteran-information/personal-information') {
        hiddenSection = (
          <div id={`collapsible-${this.id}`} className="usa-accordion-content">
              {this.props.component}
              {panelAction}
          </div>
        );
      } else {
        hiddenSection = (<div></div>);
      }
    }


    return (
      <div id={`${this.id}-collapsiblePanel`} className="usa-accordion-bordered hca-review-panel">
        <ul className="usa-unstyled-list">
          <li>
            <div className="accordion-header" aria-expanded="true" aria-controls={`collapsible-${this.id}`}>
              <div className="medium-7 columns">
                {this.props.sectionLabel} {verifiedLabel}
              </div>
              <div className="medium-5 columns">
                {editButton}
              </div>
            </div>
            {hiddenSection}
          </li>
        </ul>
      </div>
    );
  }
}

ReviewCollapsiblePanel.propTypes = {
  sectionLabel: React.PropTypes.string.isRequired,
  updatePath: React.PropTypes.string.isRequired,
  component: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    uiData: state.uiState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateEditStatus: (path) => {
      dispatch(updateIncompleteStatus(path));
    },
    onUpdateSaveStatus: (path) => {
      dispatch(updateCompletedStatus(path));
    },
    onUpdateVerifiedStatus: (path, update) => {
      dispatch(updateVerifiedStatus(path, update));
    }
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps, mapDispatchToProps, undefined, { pure: false })(ReviewCollapsiblePanel);
export { ReviewCollapsiblePanel };
