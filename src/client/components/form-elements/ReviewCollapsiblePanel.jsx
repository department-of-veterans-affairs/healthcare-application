import React from 'react';

import ErrorableCheckbox from './ErrorableCheckbox';

/**
 * A component for the review section to validate information is correct.
 *
 * Required props
 */

class ReviewCollapsiblePanel extends React.Component {

  render() {
    let panelAction;

    if (this.props.sectionComplete) {
      panelAction = (<ErrorableCheckbox
          label="I certify that all information above is correct to the best of my knowledge."
          checked={this.props.value}
          onValueChange={(update) => {this.props.onStateChange('vietnamService', update);}}/>);
    } else {
      panelAction = (<button>Save</button>
        );
    }

    return (
      <div className="usa-accordion-bordered">
        <ul className="usa-unstyled-list">
          <li>
            <button className="usa-button-unstyled" aria-expanded="true" aria-controls="collapsible-0">
              {this.props.sectionLabel}
            </button>
            <div id="collapsible-0" aria-hidden="false" className="usa-accordion-content">
              {this.props.children}
              {panelAction}
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default ReviewCollapsiblePanel;
