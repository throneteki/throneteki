import React, { useCallback } from 'react';
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
    'discard pile': ['dead pile', 'hand', 'draw deck', 'play area', 'out of game']
};

const Droppable = ({ children, onDragDrop, source }) => {
    const handleDrop = useCallback(
        (props, monitor) => {
            let item = monitor.getItem();

            if (onDragDrop) {
                onDragDrop(item.card, source);
            }
        },
        [onDragDrop, source]
    );

    const [{ isOver, canDrop }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: handleDrop,
        canDrop: (item) => validTargets[item.source].includes(source),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop()
        })
    });

    console.info(canDrop, isOver);

    let className = classNames('droppable', {
        'drop-valid': canDrop,
        'drop-target': isOver
    });

    console.info(className);

    return (
        <div ref={drop} className={className}>
            {children}
        </div>
    );
};

export default Droppable;
