import React from 'react';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';

import { ItemTypes } from '../../constants';

const validTargets = {
    hand: [
        'play area',
        'discard pile',
        'draw deck',
        'dead pile',
        'out of game',
        'conclave',
        'shadows'
    ],
    'play area': [
        'discard pile',
        'hand',
        'draw deck',
        'dead pile',
        'out of game',
        'conclave',
        'shadows'
    ],
    'discard pile': [
        'dead pile',
        'hand',
        'draw deck',
        'play area',
        'out of game',
        'conclave',
        'shadows'
    ],
    'dead pile': [
        'hand',
        'draw deck',
        'play area',
        'discard pile',
        'out of game',
        'conclave',
        'shadows'
    ],
    'draw deck': [
        'hand',
        'discard pile',
        'dead pile',
        'play area',
        'out of game',
        'conclave',
        'rookery',
        'shadows'
    ],
    'plot deck': ['revealed plots', 'out of game', 'rookery'],
    'revealed plots': ['plot deck', 'out of game'],
    'out of game': [
        'plot deck',
        'revealed plots',
        'draw deck',
        'play area',
        'discard pile',
        'hand',
        'dead pile',
        'shadows'
    ],
    conclave: [
        'hand',
        'play area',
        'draw deck',
        'discard pile',
        'dead pile',
        'out of game',
        'shadows'
    ],
    shadows: ['dead pile', 'discard pile', 'draw deck', 'hand', 'out of game', 'play area'],
    'full deck': ['rookery'],
    rookery: ['full deck']
};

const Droppable = ({ children, onDragDrop, source }) => {
    const [{ canDrop, isOver, itemSource }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (_, monitor) => {
            let item = monitor.getItem();

            onDragDrop && onDragDrop(item.card, item.source, source);
        },
        canDrop: (item) =>
            validTargets[item.source] &&
            validTargets[item.source].some((target) => target === source),
        collect: (monitor) => {
            let item = monitor.getItem();

            return {
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                itemSource: item && item.source
            };
        }
    });

    let className = classNames('overlay', {
        'drop-ok': isOver && canDrop,
        'no-drop': isOver && !canDrop && source !== itemSource,
        'can-drop': !isOver && canDrop,
        [source]: true
    });

    let dropClass = classNames('drop-target', {
        [source]: source !== 'play area'
    });

    return (
        <div className={dropClass} ref={drop}>
            <div className={className} />
            {children}
        </div>
    );
};

export default Droppable;
