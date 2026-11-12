import React, { useMemo } from 'react';
import classNames from 'classnames';

import { useDroppable } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';
import { useUniqueId } from '@dnd-kit/utilities';
import { useDragSource, useDragType } from './dragStore';
import { canDrop as canDropOn } from './dropTargets';

// A pile that stands above the table (rise) has a zone that reaches up to its top, without moving the pile.
// A zone drawn under the cards (underCards) leaves the tops of piles that stand up into it uncovered.
const Droppable = ({ className, children, source, rise, underCards = false }) => {
    const { isOver, active, setNodeRef } = useDroppable({
        id: useUniqueId(source),
        data: {
            source: source
        }
    });

    const dragSource = useDragSource();
    const dragType = useDragType();

    const canDrop = useMemo(() => {
        return active && canDropOn(dragSource, source, dragType);
    }, [active, dragSource, dragType, source]);

    const innerClass = classNames(
        'pointer-events-none absolute top-0 left-0 h-full w-full rounded-md opacity-50',
        underCards ? 'z-[199]' : 'z-[240]',
        {
            'bg-success-500': isOver && canDrop,
            'bg-danger-500':
                isOver && active?.data.type === ItemTypes.CARD && !canDrop && source !== dragSource,
            'bg-warning-500': !isOver && canDrop
        }
    );

    const dropClass = classNames(className, 'relative', { 'shift-smooth': rise });
    const style = useMemo(
        () => rise && { paddingTop: rise, marginTop: `calc(-1 * ${rise})` },
        [rise]
    );

    return (
        <div className={dropClass} style={style || undefined} ref={setNodeRef}>
            <div className={innerClass} />
            {children}
        </div>
    );
};

export default Droppable;
