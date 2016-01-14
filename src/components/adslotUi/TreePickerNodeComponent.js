import _ from 'lodash';
import Button from 'react-bootstrap/lib/Button';
import React, { PropTypes } from 'react';
import { GridCell, GridRow } from 'alexandria-adslot';

require('styles/adslotUi/TreePickerNode.scss');

const TreePickerNodeComponent = ({
  expandNode,
  includeNode,
  node,
  removeNode,
  selected,
  valueFormatter,
}) => {
  const pathElement = (!_.isEmpty(node.path)) ?
    <span className="treepickernode-component-path">
      {node.path.reverse().join(', ')}
    </span> :
    null;

  const includeNodeBound = includeNode.bind(null, node);
  const removeNodeBound = removeNode.bind(null, node);

  let expanderElement;
  if (expandNode && node.isExpandable) {
    const expandNodeBound = expandNode.bind(null, node);
    expanderElement = <span className="treepickernode-component-expander" onClick={expandNodeBound} />;
  }

  return (
    <div className="treepickernode-component">
      <GridRow>
        {(selected) ?
          <GridCell classSuffixes={['button']}>
            <Button block bsSize="xsmall" bsStyle="danger" className="btn-inverse" onClick={removeNodeBound}>
              Remove
            </Button>
          </GridCell>
        : null}
        <GridCell stretch>
          <span>{node.label}</span>
          <span className="treepickernode-component-metadata"> ({node.type} in {pathElement})</span>
          {expanderElement}
        </GridCell>
        <GridCell>
          {valueFormatter(node.value)}
        </GridCell>
        {(!selected) ?
          <GridCell classSuffixes={['button']}>
            <Button block bsSize="xsmall" bsStyle="primary" className="btn-inverse" onClick={includeNodeBound}>
              Include
            </Button>
          </GridCell>
        : null}
      </GridRow>
    </div>
  );
};

TreePickerNodeComponent.displayName = 'AdslotUiTreePickerNodeComponent';

const nodePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isExpandable: PropTypes.bool,
});

TreePickerNodeComponent.propTypes = {
  selected: PropTypes.bool.isRequired,
  includeNode: PropTypes.func.isRequired,
  node: nodePropType.isRequired,
  removeNode: PropTypes.func.isRequired,
  valueFormatter: PropTypes.func.isRequired,
};

TreePickerNodeComponent.defaultProps = {
  selected: false,
  includeNode: (node) => {throw new Error(`AdslotUi TreePickerNode needs an includeNode handler for ${node}`);},

  removeNode: (node) => {throw new Error(`AdslotUi TreePickerNode needs a removeNode handler for ${node}`);},

  valueFormatter: (value) => value,
};

export default TreePickerNodeComponent;