import React, { useMemo } from 'react';
import classNames from 'classnames';

import { useDroppable } from '@dnd-kit/core';
import { ItemTypes } from '../../constants';
import { useUniqueId } from '@dnd-kit/utilities';
import { useDragSource } from './dragStore';
import { validTargets } from './dropTargets';

const Droppable = ({ className, children, source }) => {
    const { isOver, active, setNodeRef } = useDroppable({
        id: useUniqueId(source),
        data: {
            source: source
        }
    });

    const dragSource = useDragSource();

    const canDrop = useMemo(() => {
        return (
            active &&
            validTargets[dragSource] &&
            validTargets[dragSource].some((target) => target === source)
        );
    }, [active, dragSource, source]);

    const innerClass = classNames(
        'pointer-events-none absolute top-0 left-0 h-full w-full rounded-md opacity-50 z-[240]',
        {
            'bg-success-500': isOver && canDrop,
            'bg-danger-500':
                isOver && active?.data.type === ItemTypes.CARD && !canDrop && source !== dragSource,
            'bg-warning-500': !isOver && canDrop
        }
    );

    let dropClass = classNames(className, 'relative');

    return (
        <div className={dropClass} ref={setNodeRef}>
            <div className={innerClass} />
            {children}
        </div>
    );
};

export default Droppable;
