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
              You are ready to apply for healthcare at the VA.
            </p>
            <p>
              Fill out this application with the most accurate information you have—the more accurate it is, the more likely you are to get a rapid response.
            </p>
            <p>
              All of the information you submit is used to determine your eligibility and to help us provide the best service to you.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default IntroductionSection;
