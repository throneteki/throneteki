import { useEffect } from 'react';
import { useDndContext } from '@dnd-kit/core';

// Drop zones are measured when a drag starts, so a zone that is still sliding into place would be hit where it
// used to be. While anything is transitioning during a drag, they are measured again every frame, and once more
// when it stops.
const DropZoneTracker = () => {
    const { active, measureDroppableContainers } = useDndContext();
    const dragging = !!active;

    useEffect(() => {
        if (!dragging) {
            return;
        }

        let frame = 0;
        let wasMoving = true;
        const tick = () => {
            const moving = document.getAnimations().some((a) => a instanceof CSSTransition);
            if (moving || wasMoving) {
                measureDroppableContainers();
            }
            wasMoving = moving;
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [dragging, measureDroppableContainers]);

    return null;
};

export default DropZoneTracker;
