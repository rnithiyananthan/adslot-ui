import _ from 'lodash';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import ListPickerPure from 'components/adslotUi/ListPickerPureComponent';
import React, { PropTypes } from 'react';

require('styles/adslotUi/ListPicker.scss');

class ListPickerComponent extends React.Component {
  constructor(props) {
    super(props);
    for (const methodName of [
      'applyAction',
      'cancelAction',
      'deselectItem',
      'getApplyButtonState',
      'loadData',
      'selectItem',
    ]) {this[methodName] = this[methodName].bind(this);}

    this.state = {};
  }

  componentDidMount() {this.loadData();}

  getApplyButtonState(selectedItems) {
    if (this.props.allowEmptySelection) {return false;}

    return _.isEmpty(selectedItems);
  }

  loadData() {
    const selectedItems = _.clone(this.props.initialSelection);
    this.setState({
      selectedItems,
      disableApplyButton: this.getApplyButtonState(selectedItems),
    });
  }

  selectItem(item) {
    const { selectedItems } = this.state;
    if (!this.props.allowMultiSelection) {selectedItems.length = 0;}

    selectedItems.push(item);
    this.setState({
      selectedItems,
      disableApplyButton: this.getApplyButtonState(selectedItems),
    });
  }

  deselectItem(item) {
    const { selectedItems } = this.state;
    _.remove(selectedItems, { id: item.id });
    this.setState({
      selectedItems,
      disableApplyButton: this.getApplyButtonState(selectedItems),
    });
  }

  cancelAction() {
    this.props.modalClose();
    this.loadData();
  }

  applyAction() {
    this.props.modalApply(this.state.selectedItems);
    this.props.modalClose();
  }

  render() {
    const { state, props } = this;

    return (
      <Modal className={props.modalClassName} show={props.show} bsSize="large" keyboard={false}>
        <Modal.Header>
          <Modal.Title>{props.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{props.modalDescription}</p>
          <ListPickerPure
            allowMultiSelection={props.allowMultiSelection}
            emptyIcon={props.emptyIcon}
            emptyMessage={props.emptyMessage}
            deselectItem={this.deselectItem}
            labelFormatter={props.labelFormatter}
            itemHeaders={props.itemHeaders}
            items={props.items}
            selectItem={this.selectItem}
            selectedItems={state.selectedItems}
          />
          {props.modalFootnote ? <div className="listpicker-component-footnote">{props.modalFootnote}</div> : null}
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-inverse" onClick={this.cancelAction}>
            Cancel
          </Button>
          <Button bsStyle="primary" onClick={this.applyAction} disabled={state.disableApplyButton}>
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ListPickerComponent.displayName = 'AdslotUiListPickerComponent';

const itemType = PropTypes.shape({
  id: PropTypes.number.isRequired,
});

ListPickerComponent.propTypes = {
  allowEmptySelection: PropTypes.bool.isRequired,
  allowMultiSelection: PropTypes.bool.isRequired,
  emptyIcon: PropTypes.string,
  emptyMessage: PropTypes.string,
  initialSelection: PropTypes.arrayOf(itemType).isRequired,
  itemHeaders: PropTypes.shape({
    left: PropTypes.string,
    right: PropTypes.string,
  }),
  items: PropTypes.arrayOf(itemType).isRequired,
  labelFormatter: PropTypes.func,
  modalApply: PropTypes.func.isRequired,
  modalDescription: PropTypes.string,
  modalClassName: PropTypes.string,
  modalClose: PropTypes.func.isRequired,
  modalFootnote: PropTypes.string,
  modalTitle: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
};

ListPickerComponent.defaultProps = {
  allowEmptySelection: true,
  allowMultiSelection: true,
  initialSelection: [],
  items: [],
  modalApply: () => {throw new Error('AdslotUi ListPicker needs a modalApply handler');},

  modalClassName: 'listpicker-component',
  modalClose: () => {throw new Error('AdslotUi ListPicker needs a modalClose handler');},

  modalDescription: 'Select items.',
  modalTitle: 'Select Items',
  show: false,
};

export default ListPickerComponent;