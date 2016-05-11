import React from 'react';
import Scroll from 'react-scroll';
import { hashHistory } from 'react-router';

import fetch from 'isomorphic-fetch';

import IntroductionSection from './IntroductionSection.jsx';
import Nav from './Nav.jsx';
import ProgressButton from './ProgressButton';
import { ensureFieldsInitialized, updateCompletedStatus, updateSubmissionStatus } from '../actions';

import * as validations from '../utils/validations';

const Element = Scroll.Element;
const scroller = Scroll.scroller;

class HealthCareApp extends React.Component {
  constructor() {
    super();
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
      hashHistory.push(this.getUrl('next'));
      this.context.store.dispatch(updateCompletedStatus(path));
    }
    this.scrollToTop();
  }

  handleBack() {
    hashHistory.push(this.getUrl('back'));
    this.scrollToTop();
  }

  handleSubmit(e){
    e.preventDefault();
    const path = this.props.location.pathname;

    this.context.store.dispatch(updateSubmissionStatus('applicationSubmitted'));
    this.context.store.dispatch(updateCompletedStatus(path));
    this.scrollToTop();
  }

  render() {
    let children = this.props.children;
    let buttons;

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

    if (this.props.location.pathname === '/review-and-submit') {
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
    } else if (this.props.location.pathname === '/introduction') {
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

    return (
      <div className="row">
        <Element name="topScrollElement"/>
        <div className="medium-4 columns show-for-medium-up">
          <Nav currentUrl={this.props.location.pathname}/>
        </div>
        <div className="medium-8 columns">
          <div className="progress-box">
          {/* TODO: Change action to reflect actual action for form submission. */}
            <form className="form-panel">
              {children}
              {buttons}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// TODO(awong): Hack to allow access to the store for now while migrating.
// All uses of this.context.store in this file are WRONG!!!
HealthCareApp.contextTypes = { store: React.PropTypes.object };

export default HealthCareApp;
