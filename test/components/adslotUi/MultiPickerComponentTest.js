/* eslint-env node, mocha */
/* global expect */

import createComponent from 'helpers/shallowRenderHelper';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import React from 'react';
import MultiPickerComponent from 'components/adslotUi/MultiPickerComponent';

describe('MultiPickerComponent', () => {
  const labelFormatter = (item) => `${item.givenName} ${item.surname}`;

  const teamMember1 = { givenName: 'John', id: 1, surname: 'Smith' };

  const teamMember2 = { givenName: 'Jane', id: 2, surname: 'Doe' };

  const teamMember3 = { givenName: 'Jack', id: 3, surname: 'White' };

  const itemHeaders = { left: 'Team', right: 'Member' };

  const items = [teamMember1, teamMember2, teamMember3];

  const initialSelection = () => [teamMember2];

  const getMultiPickerPureElement = (rootComponent) => {
    const modalBodyElement = rootComponent.props.children[1];
    return modalBodyElement.props.children[1];
  };

  it('should render with defaults', () => {
    const component = createComponent(MultiPickerComponent);
    expect(component.props.className).to.equal('multipicker-component');
    expect(component.type).to.equal((<Modal />).type);
    expect(component.props.show).to.equal(false);
    expect(component.props.bsSize).to.equal('large');
    expect(component.props.keyboard).to.equal(false);

    const modalHeaderElement = component.props.children[0];
    expect(modalHeaderElement.type).to.equal((<Modal.Header />).type);
    const modalTitleElement = modalHeaderElement.props.children;
    expect(modalTitleElement.type).to.equal((<Modal.Title />).type);
    const modalTitleText = modalTitleElement.props.children;
    expect(modalTitleText).to.equal('Select Items');

    const modalBodyElement = component.props.children[1];
    expect(modalBodyElement.type).to.equal((<Modal.Body />).type);

    const modalDescriptionElement = modalBodyElement.props.children[0];
    expect(modalDescriptionElement.type).to.equal('p');
    const modalDescriptionText = modalDescriptionElement.props.children;
    expect(modalDescriptionText).to.equal('Select items.');

    const multiPickerPureElement = modalBodyElement.props.children[1];
    expect(multiPickerPureElement.type.name).to.equal('MultiPickerPureComponent');

    expect(multiPickerPureElement.props.deselectItem).to.be.a('function');
    expect(multiPickerPureElement.props.labelFormatter).to.be.a('function');
    expect(multiPickerPureElement.props.itemHeaders).to.be.an('undefined');
    expect(multiPickerPureElement.props.items).to.deep.equal([]);
    expect(multiPickerPureElement.props.selectItem).to.be.a('function');
    expect(multiPickerPureElement.props.selectedItems).to.deep.equal([]);

    const modalFooterElement = component.props.children[2];
    expect(modalFooterElement.type).to.equal((<Modal.Footer />).type);

    const cancelButtonElement = modalFooterElement.props.children[0];
    expect(cancelButtonElement.type).to.equal((<Button />).type);
    expect(cancelButtonElement.props.className).to.equal('btn-inverse');
    expect(cancelButtonElement.props.onClick).to.be.a('function');
    expect(cancelButtonElement.props.children).to.equal('Cancel');

    const applyButtonElement = modalFooterElement.props.children[1];
    expect(applyButtonElement.type).to.equal((<Button />).type);
    expect(applyButtonElement.props.bsStyle).to.equal('primary');
    expect(applyButtonElement.props.onClick).to.be.a('function');
    expect(applyButtonElement.props.children).to.equal('Apply');
  });

  it('should render with props', () => {
    const component = createComponent(MultiPickerComponent, {
      initialSelection: initialSelection(),
      itemHeaders,
      items,
      labelFormatter,
      modalDescription: 'Select users.',
      modalTitle: 'Select Users',
    });
    expect(component.props.className).to.equal('multipicker-component');

    const modalHeaderElement = component.props.children[0];
    const modalTitleElement = modalHeaderElement.props.children;
    const modalTitleText = modalTitleElement.props.children;
    expect(modalTitleText).to.equal('Select Users');

    const modalBodyElement = component.props.children[1];
    const modalDescriptionElement = modalBodyElement.props.children[0];
    const modalDescriptionText = modalDescriptionElement.props.children;
    expect(modalDescriptionText).to.equal('Select users.');

    const multiPickerPureElement = getMultiPickerPureElement(component);
    expect(multiPickerPureElement.type.name).to.equal('MultiPickerPureComponent');

    expect(multiPickerPureElement.props.deselectItem).to.be.a('function');
    expect(multiPickerPureElement.props.labelFormatter).to.be.a('function');
    expect(multiPickerPureElement.props.itemHeaders).to.deep.equal(itemHeaders);
    expect(multiPickerPureElement.props.items).to.deep.equal(items);
    expect(multiPickerPureElement.props.selectItem).to.be.a('function');
    expect(multiPickerPureElement.props.selectedItems).to.deep.equal([teamMember2]);
  });

  it('should change `selectedItems` state after a `selectItem` action', () => {
    const component = createComponent(MultiPickerComponent, {
      initialSelection: initialSelection(),
      items,
    });
    const multiPickerPureElement = getMultiPickerPureElement(component);
    multiPickerPureElement.props.selectItem(teamMember1);

    expect(multiPickerPureElement.props.selectedItems).to.deep.equal([teamMember2, teamMember1]);
  });

  it('should change `selectedItems` state after a `deselectItem` action', () => {
    const component = createComponent(MultiPickerComponent, {
      initialSelection: initialSelection(),
      items,
    });
    const multiPickerPureElement = getMultiPickerPureElement(component);
    multiPickerPureElement.props.deselectItem(teamMember2);

    expect(multiPickerPureElement.props.selectedItems).to.deep.equal([]);
  });

  it('should show modal when `show` is true', () => {
    const component = createComponent(MultiPickerComponent, { show: true });
    expect(component.props.show).to.equal(true);
  });

  it('should hide modal when `show` is false', () => {
    const component = createComponent(MultiPickerComponent, { show: false });
    expect(component.props.show).to.equal(false);
  });

  it('should call `modalApply` and `modalClose` when we click Apply', () => {
    let applyCalls = null;
    let closeCalls = 0;
    const applyMock = (selectedItems) => applyCalls = selectedItems;
    const closeMock = () => closeCalls += 1;
    const component = createComponent(MultiPickerComponent, {
      initialSelection: initialSelection(),
      modalApply: applyMock,
      modalClose: closeMock,
    });

    const modalFooterElement = component.props.children[2];
    const applyButtonElement = modalFooterElement.props.children[1];
    applyButtonElement.props.onClick();

    expect(applyCalls).to.deep.equal([teamMember2]);
    expect(closeCalls).to.equal(1);
  });

  it('should throw when we click Apply without a handler', () => {
    const component = createComponent(MultiPickerComponent, { initialSelection });

    const modalFooterElement = component.props.children[2];
    const applyButtonElement = modalFooterElement.props.children[1];
    expect(applyButtonElement.props.onClick).to.throw('AdslotUi MultiPicker needs a modalApply handler');
  });

  it('should call `modalClose` when we click Cancel', () => {
    let closeCalls = 0;
    const closeMock = () => closeCalls += 1;

    const component = createComponent(MultiPickerComponent, {
      modalClose: closeMock,
    });

    const modalFooterElement = component.props.children[2];
    const cancelButtonElement = modalFooterElement.props.children[0];

    cancelButtonElement.props.onClick();

    expect(closeCalls).to.equal(1);
  });

  it('should throw when we click Close without a handler', () => {
    const component = createComponent(MultiPickerComponent);

    const modalFooterElement = component.props.children[2];
    const cancelButtonElement = modalFooterElement.props.children[0];
    expect(cancelButtonElement.props.onClick).to.throw('AdslotUi MultiPicker needs a modalClose handler');
  });
});