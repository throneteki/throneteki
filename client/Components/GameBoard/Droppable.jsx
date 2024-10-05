import React, { useMemo } from 'react';
import classNames from 'classnames';

import { useDroppable } from '@dnd-kit/core';
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
        'shadows'
    ],
    'plot deck': ['revealed plots', 'out of game'],
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
    shadows: ['dead pile', 'discard pile', 'draw deck', 'hand', 'out of game', 'play area']
};

const Droppable = ({ children, source, size }) => {
    const { isOver, active, setNodeRef } = useDroppable({
        id: source
    });

    const canDrop = useMemo(() => {
        return (
            active &&
            validTargets[active.data.current.source] &&
            validTargets[active.data.current.source].some((target) => target === source)
        );
    }, [active, source]);

    let className = classNames(
        'pointer-events-none absolute top-0 left-0 h-full w-full opacity-50 z-50',
        {
            'bg-success-500': isOver && canDrop,
            'bg-danger-500':
                isOver &&
                active?.data.type === ItemTypes.CARD &&
                !canDrop &&
                source !== active?.data.current.source,
            'bg-warning-500': !isOver && canDrop,
            [source.replace(' ', '-')]: true
        }
    );

    let dropClass = classNames('relative h-full', size, {
        [source.replace(' ', '-')]: source !== 'play area'
    });

    return (
        <div className={dropClass} ref={setNodeRef}>
            <div className={className} />
            {children}
        </div>
    );
};

export default Droppable;
