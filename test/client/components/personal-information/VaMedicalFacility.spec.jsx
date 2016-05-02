import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { assert, expect } from 'chai';

import VaMedicalFacility from '../../../../src/client/components/who-are-you/VaMedicalFacility';
import { makeField } from '../../../../src/client/reducers/fields';

describe('<VaMedicalFacility>', () => {
  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    xit('value is required', () => {
      SkinDeep.shallowRender(<VaMedicalFacility/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `value` was not specified in `VaMedicalFacility`/);
    });

    // TODO(crew): Why in the world does this not work?!?!
    xit('facilityState is required', () => {
      SkinDeep.shallowRender(<VaMedicalFacility/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `facilityState` was not specified in `VaMedicalFacility`/);
    });

    xit('value must be a string', () => {
      SkinDeep.shallowRender(<VaMedicalFacility value/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `VaMedicalFacility`, expected `string`/);
    });

    xit('facilityState must be a string', () => {
      SkinDeep.shallowRender(<VaMedicalFacility facilityState/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `facilityState` of type `boolean` supplied to `VaMedicalFacility`, expected `string`/);
    });

    // TODO(awong): Why in the world does this not work?!?!
    xit('onValueChange is required', () => {
      SkinDeep.shallowRender(<VaMedicalFacility/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `VaMedicalFacility`/);
    });

    xit('onValueChange must be a function', () => {
      SkinDeep.shallowRender(
        <VaMedicalFacility onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `VaMedicalFacility`, expected `function`/);
    });
  });

  xit('has sane looking features', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')}/>
    );
    assert.ok(component, 'Cannot even render component');

    const selects = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'select');
    expect(selects).to.have.length(1);
  });

  // TODO(crew): Once options are refactored to build blank option with data, fix these tests.
  it('has no options if facilityState is NOT specified', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')} facilityState={makeField('')}/>
    );

    const options = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
    expect(options.length).to.equal(1);
  });

  it('has options if facilityState is specified', () => {
    const component = ReactTestUtils.renderIntoDocument(
      <VaMedicalFacility value={makeField('test')} facilityState={makeField('AK')}/>
    );

    const options = ReactTestUtils.scryRenderedDOMComponentsWithTag(component, 'option');
    expect(options.length).to.be.above(1);
  });
});
