import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { AnnualIncomeSection } from '../../../../src/client/components/household-information/AnnualIncomeSection';
import { makeField } from '../../../../src/common/fields';

describe('<AnnualIncomeSection>', () => {
  it('renders the correct spouse income amounts', () => {
    const data = {
      hasChildrenToReport: makeField('N'),
      maritalStatus: makeField('Married'),
      spouseGrossIncome: makeField('1000'),
      spouseNetIncome: makeField('2000'),
      spouseOtherIncome: makeField('3000'),
      veteranGrossIncome: makeField('4000'),
      veteranNetIncome: makeField('5000'),
      veteranOtherIncome: makeField('6000')
    };
    const tree = SkinDeep.shallowRender(<AnnualIncomeSection isSectionComplete reviewSection data={data}/>);
    const reviewTable = tree.everySubTree('.review')[1];
    expect(reviewTable.text()).to.equal('Spouse Gross Annual Income from Employment :1000Spouse Net Income from your Farm, Ranch, Property or Business :2000Spouse Other Income Amount:3000');
  });
});
