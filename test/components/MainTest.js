/* eslint-env node, mocha */
/* global expect */

import createComponent from 'helpers/shallowRenderHelper';
import Main from 'components/Main';
import React from 'react';
import { isElementOfType, createRenderer } from 'react-addons-test-utils';

import {
  Checkbox,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Toggle,
  TreePicker,
} from '../../src/components/distributionEntry';

describe('MainComponent', () => {
  let MainComponent;
  const componentsHash = {
    modalButton: 7,
    modal: 8,
    checkbox: 10,
    radio: 18,
    toggle: 24,
    select: 28,
    selectMulti: 30,
    treePickerButton: 32,
    treePicker: 33,
  };

  beforeEach(() => {
    MainComponent = createComponent(Main);
  });

  it('should have its component name as default className', () => {
    expect(MainComponent.props.className).to.equal('index');
  });

  it('should have a modal component', () => {
    const modalComponent = MainComponent.props.children[componentsHash.modal];
    expect(isElementOfType(modalComponent, Modal)).to.equal(true);
    expect(modalComponent.props.bsSize).to.equal('small');
    expect(modalComponent.props.keyboard).to.equal(false);
    expect(modalComponent.props.backdrop).to.equal(true);
  });

  it('should open the modal when the button is clicked', () => {
    const renderer = createRenderer();
    renderer.render(<Main />);
    let componentRenderOutput = renderer.getRenderOutput();

    const modalButtonComponent = componentRenderOutput.props.children[componentsHash.modalButton];
    let modalComponent = componentRenderOutput.props.children[componentsHash.modal];
    expect(modalComponent.props.show).to.equal(false);

    modalButtonComponent.props.onClick();

    componentRenderOutput = renderer.getRenderOutput();
    modalComponent = componentRenderOutput.props.children[componentsHash.modal];
    expect(modalComponent.props.show).to.equal(true);
  });

  it('should have a checkbox component', () => {
    const checkboxComponent = MainComponent.props.children[componentsHash.checkbox];
    expect(isElementOfType(checkboxComponent, Checkbox)).to.equal(true);
    expect(checkboxComponent.props.label).to.equal('Unchecked');
  });

  it('should have a radio button component', () => {
    const radioGroupComponent = MainComponent.props.children[componentsHash.radio];
    expect(isElementOfType(radioGroupComponent, RadioGroup)).to.equal(true);
    const radioComponent = radioGroupComponent.props.children[0];
    expect(isElementOfType(radioComponent, Radio)).to.equal(true);
    expect(radioComponent.props.label).to.equal('Unchecked');
  });

  it('should have a toggle component', () => {
    const toggleComponent = MainComponent.props.children[componentsHash.toggle];
    expect(isElementOfType(toggleComponent, Toggle)).to.equal(true);
  });

  it('should set and change values for single select', () => {
    const getRenderOutputAndCheck = ({ renderer, expectedValue }) => {
      const componentRenderOutput = renderer.getRenderOutput();

      const selectComponent = componentRenderOutput.props.children[componentsHash.select];
      expect(isElementOfType(selectComponent, Select)).to.equal(true);
      expect(selectComponent.props.value).to.equal(expectedValue);

      return { selectComponent };
    };

    const renderer = createRenderer();
    renderer.render(<Main />);

    const { selectComponent } = getRenderOutputAndCheck({
      renderer,
      expectedValue: 'au',
    });

    selectComponent.props.onChange({ value: 'uk' });

    getRenderOutputAndCheck({
      renderer,
      expectedValue: 'uk',
    });
  });

  it('should set and change values for multi select', () => {
    const getRenderOutputAndCheck = ({ renderer, expectedValue }) => {
      const componentRenderOutput = renderer.getRenderOutput();

      const selectComponent = componentRenderOutput.props.children[componentsHash.selectMulti];
      expect(isElementOfType(selectComponent, Select)).to.equal(true);
      expect(selectComponent.props.value).to.eql(expectedValue);

      return { selectComponent };
    };

    const renderer = createRenderer();
    renderer.render(<Main />);

    const { selectComponent } = getRenderOutputAndCheck({
      renderer,
      expectedValue: 'vanilla',
    });

    selectComponent.props.onChange('vanilla,chocolate');

    getRenderOutputAndCheck({
      renderer,
      expectedValue: 'vanilla,chocolate',
    });
  });

  it('should toggle `showTreePickerModal` on `Open Treepicker` click', () => {
    const renderer = createRenderer();
    renderer.render(<Main />);
    let componentRenderOutput = renderer.getRenderOutput();

    const treePickerButtonElement = componentRenderOutput.props.children[componentsHash.treePickerButton];
    treePickerButtonElement.props.onClick();

    componentRenderOutput = renderer.getRenderOutput();
    const treePickerElement = componentRenderOutput.props.children[componentsHash.treePicker];
    expect(treePickerElement.props.show).to.equal(true);
  });

  it('should pass a custom valueFormatter into the TreePicker', () => {
    const treePickerElement = MainComponent.props.children[componentsHash.treePicker];
    expect(isElementOfType(treePickerElement, TreePicker)).to.equal(true);
    expect(treePickerElement.props.valueFormatter(155)).to.equal('$1.55');
  });

  it('should pass a custom getSelected into the TreePicker', () => {
    const treePickerElement = MainComponent.props.children[componentsHash.treePicker];
    expect(isElementOfType(treePickerElement, TreePicker)).to.equal(true);
    expect(treePickerElement.props.getSelected()).to.have.length(2);
  });

  it('should pass a custom getSubtree into the TreePicker', () => {
    const treePickerElement = MainComponent.props.children[componentsHash.treePicker];
    expect(isElementOfType(treePickerElement, TreePicker)).to.equal(true);
    expect(treePickerElement.props.getSubtree()).to.have.length(0);
    expect(treePickerElement.props.getSubtree('0', '')).to.have.length(4);
  });
});
