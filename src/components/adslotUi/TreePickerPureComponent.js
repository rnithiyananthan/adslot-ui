import _ from 'lodash';
import SplitPane from 'components/adslotUi/SplitPaneComponent';
import TreePickerNav from 'components/adslotUi/TreePickerNavComponent';
import TreePickerNode from 'components/adslotUi/TreePickerNodeComponent';
import TreePickerPropTypes from 'helpers/propTypes/TreePickerPropTypes';
import TreePickerSelected from 'components/adslotUi/TreePickerSelectedComponent';
import React, { PropTypes } from 'react';
import { Empty, FlexSpacer, Grid, SvgSymbol } from 'alexandria-adslot';

require('styles/adslotUi/TreePickerPure.scss');

const TreePickerPureComponent = ({
  activeRootTypeId,
  averageWithinRootType,
  baseItem,
  breadcrumbNodes,
  breadcrumbOnClick,
  changeRootType,
  emptyIcon,
  emptySvgSymbol,
  expandNode,
  helpText,
  includeNode,
  removeNode,
  rootTypes,
  searchOnChange,
  searchOnClear,
  searchPlaceholder,
  searchValue,
  selectedLabel,
  selectedNodesByRootType,
  subtree,
  totalsSuffix,
  valueFormatter,
  warnOnRequired,
}) => {
  const changeRootTypeBound = (rootType) => {
    if (rootType.id !== activeRootTypeId) {
      return changeRootType.bind(null, rootType.id);
    }

    return () => null;
  };

  const selectedIds = _.map(selectedNodesByRootType[activeRootTypeId], 'id');
  const filteredSubtree = _(subtree)
    .filter(({ id }) => !_.includes(selectedIds, id))
    .sortBy('label')
    .value();

  return (
    <div className="treepickerpure-component">

      <SplitPane>

        <ul className="nav nav-tabs">
          {rootTypes.length ? _.map(rootTypes, (rootType) =>
            <li className={(rootType.id === activeRootTypeId) ? 'active' : ''} key={rootType.id}>
              <a onClick={changeRootTypeBound(rootType)}>
                <img className="icon" src={rootType.icon} />
                {rootType.label}
              </a>
            </li>)
          : <li><a>Loading</a></li>}
        </ul>

        <TreePickerNav
          breadcrumbNodes={breadcrumbNodes}
          breadcrumbOnClick={breadcrumbOnClick}
          searchOnChange={searchOnChange}
          searchOnClear={searchOnClear}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
        />

        <Grid>
          {_.map(filteredSubtree, (node) =>
            <TreePickerNode
              expandNode={expandNode}
              includeNode={includeNode}
              key={node.id}
              node={node}
              valueFormatter={valueFormatter}
            />
          )}
          <Empty collection={filteredSubtree} icon={emptyIcon} svgSymbol={emptySvgSymbol} text="No items to select." />
        </Grid>

        <FlexSpacer />
      </SplitPane>

      <SplitPane>

        <TreePickerSelected
          averageWithinRootType={averageWithinRootType}
          baseItem={baseItem}
          emptyIcon={emptyIcon}
          emptySvgSymbol={emptySvgSymbol}
          helpText={helpText}
          removeNode={removeNode}
          rootTypes={rootTypes}
          selectedLabel={selectedLabel}
          selectedNodesByRootType={selectedNodesByRootType}
          totalsSuffix={totalsSuffix}
          valueFormatter={valueFormatter}
          warnOnRequired={warnOnRequired}
        />

      </SplitPane>

    </div>
  );
};

TreePickerPureComponent.displayName = 'AdslotUiTreePickerPureComponent';

const baseItemPropType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
});

const breadCrumbNode = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
});

const rootType = PropTypes.shape({
  emptyIcon: PropTypes.string,
  emptySvgSymbol: PropTypes.shape(SvgSymbol.propTypes),
  icon: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
});

TreePickerPureComponent.propTypes = {
  activeRootTypeId: PropTypes.string,
  averageWithinRootType: PropTypes.bool.isRequired,
  baseItem: baseItemPropType,
  breadcrumbNodes: PropTypes.arrayOf(breadCrumbNode),
  breadcrumbOnClick: PropTypes.func,
  changeRootType: PropTypes.func.isRequired,
  emptyIcon: PropTypes.string,
  emptySvgSymbol: PropTypes.shape(SvgSymbol.propTypes),
  expandNode: PropTypes.func,
  helpText: PropTypes.shape({
    average: PropTypes.string,
    sum: PropTypes.string,
  }),
  includeNode: PropTypes.func,
  removeNode: PropTypes.func,
  rootTypes: PropTypes.arrayOf(rootType).isRequired,
  searchOnChange: PropTypes.func,
  searchOnClear: PropTypes.func,
  searchValue: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  selectedLabel: PropTypes.string,
  selectedNodesByRootType: PropTypes.shape(),
  subtree: PropTypes.arrayOf(TreePickerPropTypes.node).isRequired,
  totalsSuffix: PropTypes.string,
  valueFormatter: PropTypes.func,
  warnOnRequired: PropTypes.bool,
};

TreePickerPureComponent.defaultProps = {
  averageWithinRootType: false,
  rootTypes: [],
  selectedNodesByRootType: {},
  subtree: [],
};

export default TreePickerPureComponent;
