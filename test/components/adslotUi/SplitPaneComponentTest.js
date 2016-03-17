import React from 'react';
import SplitPaneComponent from 'components/adslotUi/SplitPaneComponent';
import { shallow } from 'enzyme';

describe('SplitPaneComponent', () => {
  it('should have its component name as default className and no data-test-selector', () => {
    const component = shallow(<SplitPaneComponent />);
    expect(component.prop('className')).to.equal('splitpane-component');
    expect(component.prop('data-test-selector')).to.be.an('undefined');
  });

  it('should transclude children', () => {
    const component = shallow(<SplitPaneComponent><div /></SplitPaneComponent>);
    expect(component.prop('className')).to.equal('splitpane-component');
    expect(component.children().type()).to.equal('div');
  });

  it('should set data-test-selector', () => {
    const component = shallow(<SplitPaneComponent dts="please-select-me" />);
    expect(component.prop('data-test-selector')).to.equal('please-select-me');
  });
});
