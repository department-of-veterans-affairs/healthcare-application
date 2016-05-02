import React from 'react';
import { connect } from 'react-redux';

/**
 * Component for navigation, with links to each section of the form.
 * Parent links redirect to first section link within topic.
 *
 * Props:
 * `currentUrl` - String. Specifies the current url.
 * `completedSections` - boolean. Section has been validated and completed.
 */
class Nav extends React.Component {

  render() {
    const subnavStyles = 'step one wow fadeIn animated';
    const completedSections = this.props.data.completedSections;
    const currentUrl = this.props.currentUrl;

    function determinePanelStyles(currentPath, completePath) {
      let classes = '';
      if (currentUrl.startsWith(currentPath)) {
        classes += ' section-current';
      }
      if (completedSections[completePath] === true) {
        classes += ' section-complete';
      }
      return classes;
    }

    function determineSectionStyles(currentPath) {
      let classes = '';
      if (currentUrl === currentPath) {
        classes += ' sub-section-current';
      }
      return classes;
    }

    // TODO(akainic): change this check once the alias for introduction has been changed
    return (
      <ol className="process hca-process">
        <li className={`one ${subnavStyles}
         ${determinePanelStyles('/introduction', '/introduction')}`}>
          <div>
            <h5>Introduction</h5>
          </div>
        </li>
        <li role="presentation" className={`two ${subnavStyles}
         ${determinePanelStyles('/who-are-you', '/who-are-you/panel3')}`}>
          <div>
            <h5>WHO ARE YOU?</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/who-are-you/panel1')}`}>
                Panel 1
              </li>
              <li className={`${determineSectionStyles('/who-are-you/panel2')}`}>
                Panel 2
              </li>
              <li className={`${determineSectionStyles('/who-are-you/panel3')}`}>
                Panel 3
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`three ${subnavStyles}
         ${determinePanelStyles('/how-do-we-reach-you', '/how-do-we-reach-you/panel2')}`}>
          <div>
            <h5>HOW DO WE REACH YOU?</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/how-do-we-reach-you/panel1')}`}>
                Panel 1
              </li>
              <li className={`${determineSectionStyles('/how-do-we-reach-you/panel2')}`}>
                Panel 2
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`four ${subnavStyles}
         ${determinePanelStyles('/other-insurance', '/other-insurance/panel2')}`}>
          <div>
            <h5>OTHER INSURANCE</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/other-insurance/panel1')}`}>
                Panel 1
              </li>
              <li className={`${determineSectionStyles('/other-insurance/panel2')}`}>
                Panel 2
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`five ${subnavStyles}
         ${determinePanelStyles('/financial-assessment', '/financial-assessment/deductible-expenses')}`}>
          <div>
            <h5>Financial Assessment</h5>
            <ul className="usa-unstyled-list">
              <li className={`${determineSectionStyles('/financial-assessment/financial-disclosure')}`}>
                Financial Disclosure
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/spouse-information')}`}>
                Spouse
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/child-information')}`}>
                Child
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/annual-income')}`}>
                Annual Income
              </li>
              <li className={`${determineSectionStyles('/financial-assessment/deductible-expenses')}`}>
                Deductible Expenses
              </li>
            </ul>
          </div>
        </li>
        <li role="presentation" className={`six last ${subnavStyles}
         ${determinePanelStyles('/review-and-submit', '/review-and-submit')}`}>
          <div>
            <h5>Review and Submit</h5>
          </div>
        </li>
      </ol>
    );
  }
}

Nav.propTypes = {
  currentUrl: React.PropTypes.string.isRequired
};

function mapStateToProps(state) {
  return {
    data: state.uiState
  };
}

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(Nav);
export { Nav };
