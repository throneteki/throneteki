import React, { useMemo } from 'react';
import classNames from 'classnames';

import { useDroppable } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';
import { useUniqueId } from '@dnd-kit/utilities';
import { useDragSource, useDragType, useUnderTarget } from './dragStore';
import { canDrop as canDropOn } from './dropTargets';

// A pile that stands above the table (rise) has a zone that reaches up to its top, without moving the pile.
// A zone drawn under the cards (underCards) leaves the tops of piles that stand up into it uncovered.
// A zone for the cards underneath a card (parentUuid) places the dropped card underneath that card.
// A card dropped in a zone inside a popup (popup) lands in the popup rather than on the board.
const Droppable = ({
    className,
    children,
    source,
    rise,
    underCards = false,
    parentUuid,
    popup = false
}) => {
    const {
        isOver: isOverArea,
        active,
        setNodeRef
    } = useDroppable({
        id: useUniqueId(source),
        data: {
            source: source,
            parentUuid,
            popup
        }
    });

    const dragSource = useDragSource();
    const dragType = useDragType();
    // Armed to go under a card, the card is no longer dropped into the area itself
    const underTarget = useUnderTarget();
    const isOver = isOverArea && !underTarget;

    const canDrop = useMemo(() => {
        return active && canDropOn(dragSource, source, dragType);
    }, [active, dragSource, dragType, source]);

    const innerClass = classNames(
        'pointer-events-none absolute top-0 left-0 h-full w-full rounded-md opacity-50',
        underCards ? 'z-[199]' : 'z-[240]',
        {
            'bg-success': isOver && canDrop,
            'bg-danger':
                isOver && active?.data.type === ItemTypes.CARD && !canDrop && source !== dragSource,
            'bg-warning': !isOver && canDrop
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
