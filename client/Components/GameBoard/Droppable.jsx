import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import classNames from 'classnames';

import { ItemTypes } from '../../constants';

const validTargets = {
    hand: [
        'play area',
        'discard pile',
        'draw deck',
        'dead pile',
        'out of game',
        'conclave'
    ],
    'play area': [
        'discard pile',
        'hand',
        'draw deck',
        'dead pile',
        'out of game',
        'conclave'
    ],
    'discard pile': [
        'dead pile',
        'hand',
        'draw deck',
        'play area',
        'out of game',
        'conclave'
    ],
    'dead pile': [
        'hand',
        'draw deck',
        'play area',
        'discard pile',
        'out of game',
        'conclave'
    ],
    'draw deck': [
        'hand',
        'discard pile',
        'dead pile',
        'play area',
        'out of game',
        'conclave'
    ],
    'plot deck': [
        'revealed plots',
        'scheme plots',
        'out of game'
    ],
    'revealed plots': [
        'plot deck',
        'scheme plots',
        'out of game'
    ],
    'out of game': [
        'plot deck',
        'revealed plots',
        'scheme plots',
        'draw deck',
        'play area',
        'discard pile',
        'hand',
        'dead pile'
    ],
    'conclave': [
        'hand',
        'play area',
        'draw deck',
        'discard pile',
        'dead pile',
        'out of game'
    ]
};

const dropTarget = {
    canDrop(props, monitor) {
        let item = monitor.getItem();

        return validTargets[item.source] && validTargets[item.source].some(target => target === props.source);
    },
    drop(props, monitor) {
        let item = monitor.getItem();

        props.onDragDrop(item.card, item.source, props.source);
    }
};

function collect(connect, monitor) {
    let item = monitor.getItem();

    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        itemSource: item && item.source
    };
}

class Droppable extends React.Component {
    render() {
        let className = classNames('overlay', {
            'drop-ok': this.props.isOver && this.props.canDrop,
            'no-drop': this.props.isOver && !this.props.canDrop && this.props.source !== this.props.itemSource,
            'can-drop': !this.props.isOver && this.props.canDrop
        });

        return this.props.connectDropTarget(
            <div className='drop-target'>
                <div className={ className } />
                { this.props.children }
            </div>);
    }
}

Droppable.propTypes = {
    canDrop: PropTypes.bool,
    children: PropTypes.node,
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    itemSource: PropTypes.string,
    onDragDrop: PropTypes.func,
    source: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.CARD, dropTarget, collect)(Droppable);
