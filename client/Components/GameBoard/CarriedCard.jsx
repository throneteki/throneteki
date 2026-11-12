import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CardImage from '../Images/CardImage';

// The card follows the pointer straight from pointer events, so layout changes while dragging cannot offset it
const CarriedCard = ({ code, orientation, start, grab, rectRef }) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const element = ref.current;
        const place = (x, y) => {
            const left = x - grab.x;
            const top = y - grab.y;
            element.style.transform = `translate(${left}px, ${top}px)`;
            rectRef.current = { left, top, width: grab.width, height: grab.height };
        };

        place(start.x, start.y);
        const onMove = (event) => place(event.clientX, event.clientY);
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [grab, rectRef, start]);

    return createPortal(
        <div ref={ref} data-carried='' className='fixed left-0 top-0 z-[400] pointer-events-none'>
            <CardImage
                code={code}
                orientation={orientation}
                className='scale-105 shadow-[0_14px_22px_rgba(0,0,0,0.5)]'
            />
        </div>,
        document.querySelector('[data-overlay-container="true"]') || document.body
    );
};

export default CarriedCard;
