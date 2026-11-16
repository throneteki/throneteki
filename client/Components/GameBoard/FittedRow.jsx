import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { pressedByTouch } from '../../lastPointer';

// However crowded the row, every card keeps this much of its width showing
const minShowing = 0.4;

const itemOf = (row, target) => {
    let item = target;
    while (item && item.parentElement !== row) {
        item = item.parentElement;
    }
    return item;
};

// A row of cards that overlaps them, each covering the right of the one before so its left edge (cost, strength
// and icons) still shows, when they do not fit side by side. Past the most they can overlap, the row scrolls
// (or, with scroll off, is cut off at its edge).
// While they overlap, a tap on a touch screen brings a card to the front and a second tap uses it, as in the hand.
// Every card in the row works that way, covered or not, so the same tap always does the same thing.
const FittedRow = ({ className, children, scroll = true }) => {
    const ref = useRef(null);
    const [overlap, setOverlap] = useState(0);
    const [raised, setRaised] = useState(null);

    useLayoutEffect(() => {
        const row = ref.current;
        if (!row) {
            return;
        }
        const measure = () => {
            const items = [...row.children];
            if (items.length < 2) {
                setOverlap(0);
                return;
            }
            const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
            const natural =
                items.reduce((sum, item) => sum + item.offsetWidth, 0) + gap * (items.length - 1);
            const excess = natural - row.clientWidth;
            const narrowest = Math.min(...items.map((item) => item.offsetWidth));
            const most = narrowest * (1 - minShowing) + gap;
            const next = excess > 0 ? Math.min(excess / (items.length - 1), most) : 0;
            setOverlap((current) => (Math.abs(current - next) < 0.5 ? current : next));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(row);
        [...row.children].forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    });

    const squished = overlap > 0;
    useEffect(() => {
        if (!raised) {
            return;
        }
        if (!squished || !raised.isConnected) {
            setRaised(null);
            return;
        }
        raised.dataset.raised = '';
        const lower = (event) => {
            if (!raised.contains(event.target)) {
                setRaised(null);
            }
        };
        document.addEventListener('pointerdown', lower, true);
        return () => {
            delete raised.dataset.raised;
            document.removeEventListener('pointerdown', lower, true);
        };
    }, [raised, squished]);

    const onClickCapture = (event) => {
        if (!squished || !pressedByTouch()) {
            return;
        }
        const item = itemOf(ref.current, event.target);
        if (item && item !== raised) {
            event.stopPropagation();
            event.preventDefault();
            setRaised(item);
        }
    };

    return (
        <div
            ref={ref}
            className={classNames(
                'min-w-0 [&>*]:shrink-0 [&>*+*]:ml-[calc(-1*var(--row-overlap,0px))] [&>[data-raised]]:relative [&>[data-raised]]:z-[220]',
                scroll
                    ? 'overflow-x-auto overflow-y-hidden snap-x [scrollbar-width:none] [&>*]:snap-start'
                    : 'overflow-hidden',
                className
            )}
            style={{ '--row-overlap': `${overlap}px` }}
            onClickCapture={onClickCapture}
        >
            {children}
        </div>
    );
};

export default FittedRow;
