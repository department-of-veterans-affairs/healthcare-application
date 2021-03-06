import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import SkinDeep from 'skin-deep';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { default as chai, expect } from 'chai';

import ErrorableSelect from '../../../../src/client/components/form-elements/ErrorableSelect';
import { makeField } from '../../../../src/common/fields';

chai.use(chaiAsPromised);

describe('<ErrorableSelect>', () => {
  const testValue = makeField('');
  const options = [{ value: 1, label: 'first' }, { value: 2, label: 'second' }];

  describe('propTypes', () => {
    let consoleStub;
    beforeEach(() => {
      consoleStub = sinon.stub(console, 'error');
    });

    afterEach(() => {
      consoleStub.restore();
    });

    it('label is required', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect options={options} value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `label` was not specified in `ErrorableSelect`/);
    });

    it('label must be a stringthis.props.', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label options={options} value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `label` of type `boolean` supplied to `ErrorableSelect`, expected `string`./);
    });

    it('onValueChange is required', () => {
      SkinDeep.shallowRender(<ErrorableSelect label="test" options={options} value={testValue}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `onValueChange` was not specified in `ErrorableSelect`/);
    });

    it('onValueChange must be a function', () => {
      SkinDeep.shallowRender(<ErrorableSelect label="test" options={options} value={testValue} onValueChange/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `onValueChange` of type `boolean` supplied to `ErrorableSelect`, expected `function`/);
    });

    it('errorMessage must be a string', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" errorMessage options={options} value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `errorMessage` of type `boolean` supplied to `ErrorableSelect`, expected `string`/);
    });

    it('options is required', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Required prop `options` was not specified in `ErrorableSelect`/);
    });

    it('options must be an object', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `options` of type `boolean` supplied to `ErrorableSelect`, expected an array/);
    });

    it('value must be an object', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options={options} value onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `value` of type `boolean` supplied to `ErrorableSelect`, expected `object`/);
    });

    it('required must be a boolean', () => {
      SkinDeep.shallowRender(
        <ErrorableSelect label="test" options={options} required="hi" value={testValue} onValueChange={(_update) => {}}/>);
      sinon.assert.calledWithMatch(consoleStub, /Invalid prop `required` of type `string` supplied to `ErrorableSelect`, expected `boolean`/);
    });
  });

  it('ensure value changes propagate', () => {
    let errorableSelect;

    const updatePromise = new Promise((resolve, _reject) => {
      errorableSelect = ReactTestUtils.renderIntoDocument(
        <ErrorableSelect label="test" options={options} value={testValue} onValueChange={(update) => { resolve(update); }}/>
      );
    });

    const select = ReactTestUtils.findRenderedDOMComponentWithTag(errorableSelect, 'select');
    select.value = '';
    ReactTestUtils.Simulate.change(select);

    return expect(updatePromise).to.eventually.eql(makeField('', true));
  });

  it('no error styles when errorMessage undefined', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={options} value={testValue} onValueChange={(_update) => {}}/>);

    // No error classes.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-label')).to.have.lengthOf(0);
    expect(tree.everySubTree('.usa-input-error-message')).to.have.lengthOf(0);

    // Ensure no unnecessary class names on label w/o error..
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].props.className).to.be.undefined;

    // No error means no aria-describedby to not confuse screen readers.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props['aria-describedby']).to.be.undefined;
  });

  it('has error styles when errorMessage is set', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={options} errorMessage="error message" value={testValue} onValueChange={(_update) => {}}/>);

    // Ensure all error classes set.
    expect(tree.everySubTree('.usa-input-error')).to.have.lengthOf(1);

    const labels = tree.everySubTree('.usa-input-error-label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    const errorMessages = tree.everySubTree('.usa-input-error-message');
    expect(errorMessages).to.have.lengthOf(1);
    expect(errorMessages[0].text()).to.equal('error message');

    // No error means no aria-describedby to not confuse screen readers.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props['aria-describedby']).to.not.be.undefined;
    expect(selects[0].props['aria-describedby']).to.equal(errorMessages[0].props.id);
  });

  it('required=false does not have required asterisk', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={options} value={testValue} onValueChange={(_update) => {}}/>);

    expect(tree.everySubTree('label')[0].text()).to.equal('my label');
  });

  it('required=true has required asterisk', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={options} required value={testValue} onValueChange={(_update) => {}}/>);

    const label = tree.everySubTree('label');
    expect(label[0].text()).to.equal('my label*');
  });

  it('label attribute propagates', () => {
    const tree = SkinDeep.shallowRender(
      <ErrorableSelect label="my label" options={options} value={testValue} onValueChange={(_update) => {}}/>);

    // Ensure label text is correct.
    const labels = tree.everySubTree('label');
    expect(labels).to.have.lengthOf(1);
    expect(labels[0].text()).to.equal('my label');

    // Ensure label htmlFor is attached to select id.
    const selects = tree.everySubTree('select');
    expect(selects).to.have.lengthOf(1);
    expect(selects[0].props.id).to.not.be.undefined;
    expect(selects[0].props.id).to.equal(labels[0].props.htmlFor);
  });
});
