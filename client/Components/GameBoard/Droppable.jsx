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
        'agenda',
        'shadows'
    ],
    'play area': [
        'discard pile',
        'hand',
        'draw deck',
        'dead pile',
        'out of game',
        'agenda',
        'shadows'
    ],
    'discard pile': [
        'dead pile',
        'hand',
        'draw deck',
        'play area',
        'out of game',
        'agenda',
        'shadows'
    ],
    'dead pile': [
        'hand',
        'draw deck',
        'play area',
        'discard pile',
        'out of game',
        'agenda',
        'shadows'
    ],
    'draw deck': [
        'hand',
        'discard pile',
        'dead pile',
        'play area',
        'out of game',
        'agenda',
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
    agenda: [
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

const Droppable = ({ children, onDragDrop, source, size }) => {
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

    let className = classNames(
        'pointer-events-none absolute top-0 left-0 h-full w-full opacity-50 z-50',
        {
            'bg-success-500': isOver && canDrop,
            'bg-danger-500': isOver && !canDrop && source !== itemSource,
            'bg-warning-500': !isOver && canDrop,
            [source.replace(' ', '-')]: true
        }
    );

    let dropClass = classNames('relative', size, {
        [source.replace(' ', '-')]: source !== 'play area'
    });

    return (
        <div className={dropClass} ref={drop}>
            <div className={className} />
            {children}
        </div>
    );
};

export default Droppable;
