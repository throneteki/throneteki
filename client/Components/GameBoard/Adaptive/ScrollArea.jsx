import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const edge = 2;

// Shows that there is more to see past this edge: a fade over the cards and a small marker
const MoreHint = ({ side }) => (
    <div
        aria-hidden
        className={classNames(
            'pointer-events-none absolute inset-x-0 z-[240] flex h-7 justify-center from-black/70 to-transparent',
            side === 'top'
                ? 'top-0 items-start bg-gradient-to-b'
                : 'bottom-0 items-end bg-gradient-to-t'
        )}
    >
        <span className='hud-zoom flex items-center gap-1 rounded-full bg-black/80 px-2 text-tiny text-default-300'>
            <FontAwesomeIcon icon={side === 'top' ? faChevronUp : faChevronDown} />
            more
        </span>
    </div>
);

// An area that scrolls up and down when what it holds is taller than it, marking the edges with more past them.
// Anchored to the end, it stays scrolled to the end as it grows, unless it has been scrolled away from there.
// It cuts off what spills past it, so it is marked for cards to fly into it above the page (data-clips).
const ScrollArea = ({ anchor = 'start', className, children }) => {
    const ref = useRef(null);
    const contentRef = useRef(null);
    const pinned = useRef(true);
    const [more, setMore] = useState({ top: false, bottom: false });

    useLayoutEffect(() => {
        const area = ref.current;
        if (!area) {
            return;
        }
        const show = () => {
            const top = area.scrollTop > edge;
            const bottom = area.scrollTop + area.clientHeight < area.scrollHeight - edge;
            setMore((current) =>
                current.top === top && current.bottom === bottom ? current : { top, bottom }
            );
        };
        const keep = () => {
            if (anchor === 'end' && pinned.current) {
                area.scrollTop = area.scrollHeight;
            }
            show();
        };
        const onScroll = () => {
            pinned.current =
                anchor === 'end'
                    ? area.scrollTop + area.clientHeight >= area.scrollHeight - edge
                    : area.scrollTop <= edge;
            show();
        };
        keep();
        const observer = new ResizeObserver(keep);
        observer.observe(area);
        if (contentRef.current) {
            observer.observe(contentRef.current);
        }
        area.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            observer.disconnect();
            area.removeEventListener('scroll', onScroll);
        };
    }, [anchor]);

    return (
        <div className={classNames('relative min-h-0 min-w-0', className)}>
            <div
                ref={ref}
                data-clips=''
                className='h-full w-full overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none]'
            >
                <div ref={contentRef} className='flex min-h-full'>
                    {children}
                </div>
            </div>
            {more.top && <MoreHint side='top' />}
            {more.bottom && <MoreHint side='bottom' />}
        </div>
    );
};

export default ScrollArea;
