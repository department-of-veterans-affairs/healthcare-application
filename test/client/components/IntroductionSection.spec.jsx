import React from 'react';
import SkinDeep from 'skin-deep';

import IntroductionSection from '../../../src/client/components/IntroductionSection';

describe('<IntroductionSection>', () => {
  it('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<IntroductionSection/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});
