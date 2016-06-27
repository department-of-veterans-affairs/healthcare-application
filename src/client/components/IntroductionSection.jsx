import React from 'react';

class IntroductionSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Apply online for health care with the 1010ez</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <p>
              Fill out this application with the most accurate information you have—the more accurate it is, the more likely you are to get a rapid response.
            </p>
            <p>
              All of the information you submit is used to determine your eligibility and to help us provide the best service to you.
            </p>
            <p>
              Federal law provides criminal penalties, including a fine and/or imprisonment for up to 5 years, for concealing a material fact or making a materially false statement. (See <a href="https://www.justice.gov/usam/criminal-resource-manual-903-false-statements-concealment-18-usc-1001" target="_blank">18 U.S.C. 1001</a>)</p>
            <div className="usa-alert usa-alert-info">
              <strong>
                Note: You will not be able to save your progress once you have started the form.
              </strong>
            </div>
          </div>
        </div>
        <br/>
      </div>
    );
  }
}

export default IntroductionSection;
