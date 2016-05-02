import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import { Provider } from 'react-redux';
import { Router, Route, createMemoryHistory } from 'react-router';
import { createStore } from 'redux';
import sinon from 'sinon';
import { expect } from 'chai';

import Nav from '../../../src/client/components/Nav';
import routes from '../../../src/client/routes';
import reducer from '../../../src/client/reducers';

const store = createStore(reducer);

class Container extends React.Component {
  render() {
    return (<Nav currentUrl={this.props.location.pathname}/>);
  }
}

describe('<Nav>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('currentUrl is required', () => {
      SkinDeep.shallowRender(<Nav store={store}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `currentUrl` was not specified in `Nav`/);
    });

    it('currentUrl must be a string', () => {
      SkinDeep.shallowRender(<Nav store={store} currentUrl/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `currentUrl` of type `boolean` supplied to `Nav`, expected `string`/);
    });
  });

  describe('active sections have section-current or sub-section-current class', () => {
    const history = createMemoryHistory('/');
    let nav;

    before(() => {
      // It's perfectly fine in this test to reuse the rendered component. Do that
      // cause it cuts the test time from 1s down to ~0.1s.
      nav = ReactTestUtils.renderIntoDocument(
        <Provider store={store}>
          <Router history={history}>
            <Route path="/" component={Container}>
              {routes}
            </Route>
          </Router>
        </Provider>
      );
    });

    afterEach(() => {
      // Ensure navigations do not leak from one test case to another.
      history.replace('/');
    });

    const expectActiveSection = (component, path) => {
      history.replace(path);
      const activeSection = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'section-current');
      expect(activeSection).to.have.lengthOf(1);
    };

    const expectActiveSectionForNavAndSubNav = (component, path) => {
      history.replace(path);
      const activeSubSection = ReactTestUtils.scryRenderedDOMComponentsWithClass(component, 'sub-section-current');
      expect(activeSubSection).to.have.lengthOf(1);
    };

    it('/introduction', () => {
      expectActiveSection(nav, '/introduction');
    });

    it('/who-are-you/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/who-are-you/panel1');
    });

    it('/who-are-you/panel2', () => {
      expectActiveSectionForNavAndSubNav(nav, '/who-are-you/panel2');
    });

    it('/who-are-you/panel3', () => {
      expectActiveSectionForNavAndSubNav(nav, '/who-are-you/panel3');
    });

    it('/how-do-we-reach-you/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/how-do-we-reach-you/panel1');
    });

    it('/how-do-we-reach-you/panel2', () => {
      expectActiveSectionForNavAndSubNav(nav, '/how-do-we-reach-you/panel2');
    });

    it('/other-insurance/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/other-insurance/panel1');
    });

    it('/other-insurance/panel2', () => {
      expectActiveSectionForNavAndSubNav(nav, '/other-insurance/panel2');
    });

    it('/military-service/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/panel1');
    });

    it('/military-service/panel2', () => {
      expectActiveSectionForNavAndSubNav(nav, '/military-service/panel2');
    });

    it('/va-service-connected/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/va-service-connected/panel1');
    });

    it('/financial-assessment/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/panel1');
    });

    it('/financial-assessment/panel2', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/panel2');
    });

    it('/financial-assessment/panel3', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/panel3');
    });

    it('/financial-assessment/panel4', () => {
      expectActiveSectionForNavAndSubNav(nav, '/financial-assessment/panel4');
    });

    it('/other-info/panel1', () => {
      expectActiveSectionForNavAndSubNav(nav, '/other-info/panel1');
    });

    it('/review-and-submit', () => {
      expectActiveSection(nav, '/review-and-submit');
    });
  });
});

