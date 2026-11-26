import { useCallback, useEffect, useState } from 'react';
import { motionOff } from '../../../flip';

// How much of the view the table's sides keep for what covers them (the desktop's prompt): the width of the columns
// it keeps for it at each side
const insetsOf = (table) => {
    const width = (end) => table.querySelector(`[data-table-cover='${end}']`)?.offsetWidth ?? 0;
    return { left: width('left'), right: width('right') };
};

// The scroll that brings a board wholly into view, moving as little as it can; a board larger than the view shows
// from its start. Nothing when it is in view already.
const scrollFor = (scroller, seat, insets) => {
    const view = scroller.getBoundingClientRect();
    const board = seat.getBoundingClientRect();
    const left = view.left + insets.left;
    const right = view.right - insets.right;
    const along = (start, end, from, to) => {
        if (end - start > to - from || start < from) {
            return start - from;
        }
        return end > to ? end - to : 0;
    };
    return {
        left: along(board.left, board.right, left, right),
        top: along(board.top, board.bottom, view.top, view.bottom)
    };
};

// Melee: scroll the table to whose board matters (target), unless the table has been scrolled by hand since the
// action last moved to a different player (active), or following has been turned off (manual, until turned back on).
// Waits while a card is carried.
const useAutoFollow = ({ boardRef, target, active, enabled, waiting }) => {
    const [scrolled, setScrolled] = useState(false);
    const [manual, setManual] = useState(false);
    const paused = scrolled || manual;

    // The action moving on to someone else picks following back up after scrolling by hand
    useEffect(() => {
        setScrolled(false);
    }, [active]);

    const scrollerOf = useCallback(
        () => boardRef.current?.querySelector('[data-board-scroll] > div > [data-clips]'),
        [boardRef]
    );

    const follow = useCallback(() => {
        const scroller = scrollerOf();
        const table = scroller?.querySelector('[data-melee-table]');
        const seat = target && table?.querySelector(`[data-seat="${CSS.escape(target)}"]`);
        if (!seat) {
            return;
        }
        const by = scrollFor(scroller, seat, insetsOf(table));
        // A board a pixel or two out of view is in view enough, as the table's own scrolling allows
        const left = Math.abs(by.left) > 2 ? by.left : 0;
        const top = Math.abs(by.top) > 2 ? by.top : 0;
        if (!left && !top) {
            return;
        }
        scroller.scrollBy({
            left,
            top,
            behavior: motionOff() ? 'auto' : 'smooth'
        });
    }, [scrollerOf, target]);

    // Followed again as the board changes size (its cards arriving, or the scale fitting), so it stays in view
    useEffect(() => {
        if (!enabled || paused || waiting) {
            return;
        }
        follow();
        const seat =
            target &&
            scrollerOf()?.querySelector(`[data-melee-table] [data-seat="${CSS.escape(target)}"]`);
        if (!seat) {
            return;
        }
        const observer = new ResizeObserver(() => follow());
        observer.observe(seat);
        return () => observer.disconnect();
    }, [enabled, paused, waiting, follow, target, scrollerOf]);

    // Scrolled by hand (a wheel, a swipe or the keys), it stops following
    useEffect(() => {
        const scroller = scrollerOf();
        if (!enabled || !scroller) {
            return;
        }
        const byHand = () => setScrolled(true);
        const keys = (event) => {
            if (
                ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(
                    event.key
                )
            ) {
                byHand();
            }
        };
        scroller.addEventListener('wheel', byHand, { passive: true });
        scroller.addEventListener('touchmove', byHand, { passive: true });
        scroller.addEventListener('keydown', keys);
        return () => {
            scroller.removeEventListener('wheel', byHand);
            scroller.removeEventListener('touchmove', byHand);
            scroller.removeEventListener('keydown', keys);
        };
    }, [enabled, scrollerOf]);

    const resume = useCallback(() => {
        setScrolled(false);
        setManual(false);
        follow();
    }, [follow]);
    const stop = useCallback(() => setManual(true), []);

    return { paused: enabled && paused, resume, stop };
};

export default useAutoFollow;
