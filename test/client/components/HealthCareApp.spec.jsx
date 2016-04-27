import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import HealthCareApp from '../../../src/client/components/HealthCareApp';

describe('<HealthCareApp>', () => {
  it('Sanity check the component renders', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<HealthCareApp location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
