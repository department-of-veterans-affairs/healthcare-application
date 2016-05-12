import React from 'react';
import Scroll from 'react-scroll';
import _ from 'lodash';

import fetch from 'isomorphic-fetch';

import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';
import ProgressButton from './ProgressButton';
import { ensureFieldsInitialized, updateCompletedStatus, updateSubmissionStatus } from '../actions';

import * as validations from '../utils/validations';

// TODO(awong): Find some way to remove code when in production. It might require System.import()
// and a promise.
import PopulateVeteranButton from './debug/PopulateVeteranButton';
import PerfPanel from './debug/PerfPanel';
import RoutesDropdown from './debug/RoutesDropdown';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class HealthCareApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  getUrl(direction) {
    const routes = this.props.route.childRoutes;
    const panels = [];
    let currentPath = this.props.location.pathname;
    let nextPath = '';

    // TODO(awong): remove the '/' alias for '/introduction' using history.replaceState()
    if (currentPath === '/') {
      currentPath = '/introduction';
    }

    panels.push.apply(panels, routes.map((obj) => { return obj.path; }));

    for (let i = 0; i < panels.length; i++) {
      if (currentPath === panels[i]) {
        if (direction === 'back') {
          nextPath = panels[i - 1];
        } else {
          nextPath = panels[i + 1];
        }
        break;
      }
    }

    return nextPath;
  }

  scrollToTop() {
    scroller.scrollTo('topScrollElement', {
      duration: 500,
      delay: 0,
      smooth: true,
    });
  }

  handleContinue() {
    const path = this.props.location.pathname;
    const formData = this.context.store.getState().veteran;
    const sectionFields = this.context.store.getState().uiState.sections[path].fields;

    this.context.store.dispatch(ensureFieldsInitialized(sectionFields));
    if (validations.isValidSection(path, formData)) {
      this.context.router.push(this.getUrl('next'));
      this.context.store.dispatch(updateCompletedStatus(path));
    }
    this.scrollToTop();
  }

  handleBack() {
    this.context.router.push(this.getUrl('back'));
    this.scrollToTop();
  }

  handleSubmit(e) {
    e.preventDefault();
    const path = this.props.location.pathname;
    const store = this.context.store;
    const veteran = store.getState().veteran;

    // Strip out unnecessary fields that track UI state
    function reducer(i, d) {
      return typeof d.value !== 'undefined' ? d.value : d;
    }
    const json = JSON.stringify(veteran, reducer, 4);
    console.log(json);

    store.dispatch(updateSubmissionStatus('submitPending'));
    store.dispatch(updateCompletedStatus(path));

    // POST data to endpoint
    fetch('/v1/api/VoaServices/submit', {
      method: 'POST',
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000, // 10 seconds
      body: json
    }).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      store.dispatch(updateSubmissionStatus('submitSucceeded', response.json()));
    }).catch(error => {
      store.dispatch(updateSubmissionStatus('submitFailed', error));
    });

    this.scrollToTop();
  }

  render() {
    let children = this.props.children;
    let buttons;
    const path = this.props.location.pathname;

    if (children === null) {
      // This occurs if the root route is hit. Default to IntroductionSection.
      children = <IntroductionSection/>;
    }

    // TODO(crew): Move these buttons into sections.
    const backButton = (
      <ProgressButton
          onButtonClick={this.handleBack}
          buttonText="Back"
          buttonClass="usa-button-outline"
          beforeText="«"/>
    );

    const nextButton = (
      <ProgressButton
          onButtonClick={this.handleContinue}
          buttonText="Continue"
          buttonClass="usa-button-primary"
          afterText="»"/>
    );

    const submitButton = (
      <ProgressButton
          onButtonClick={this.handleSubmit}
          buttonText="Submit Application"
          buttonClass="usa-button-primary"/>
    );

    if (path === '/review-and-submit') {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {backButton}
          </div>
          <div className="small-6 medium-5 end columns">
            {submitButton}
          </div>
        </div>
      );
    } else if (path === '/introduction') {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {nextButton}
          </div>
        </div>
      );
    } else {
      buttons = (
        <div className="row progress-buttons">
          <div className="small-6 medium-5 columns">
            {backButton}
          </div>
          <div className="small-6 medium-5 end columns">
            {nextButton}
          </div>
        </div>
      );
    }
    let devPanel = undefined;
    if (__DEV__) {
      const queryParams = _.fromPairs(
        window.location.search.substring(1).split('&').map((v) => { return v.split('='); }));
      if (queryParams.devPanel === '1') {
        devPanel = (
          <div className="row">
            <RoutesDropdown/>
            <PopulateVeteranButton/>
            <PerfPanel/>
          </div>
        );
      }
    }

    return (
      <div>
        {devPanel}
      <div className="row">
        <Element name="topScrollElement"/>
        <div className="medium-4 columns show-for-medium-up">
          <Nav currentUrl={path}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
          {/* TODO: Figure out why <form> adds fields to url, and change action to reflect actual action for form submission. */}
            <div className={path === '/review-and-submit' ? '' : 'form-panel'}>
              {children}
              {buttons}
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

// TODO(awong): Hack to allow access to the store for now while migrating.
// All uses of this.context.store in this file are WRONG!!!
HealthCareApp.contextTypes = {
  router: React.PropTypes.object.isRequired,
  store: React.PropTypes.object
};

export default HealthCareApp;
