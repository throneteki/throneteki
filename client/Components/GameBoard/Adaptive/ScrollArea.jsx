import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { motionOff } from '../../../flip';

const edge = 2;

const hints = {
    start: {
        y: ['inset-x-0 top-0 h-3 bg-gradient-to-b', 'inset-x-0 top-0 h-px'],
        x: ['inset-y-0 left-0 w-3 bg-gradient-to-r', 'inset-y-0 left-0 w-px']
    },
    end: {
        y: ['inset-x-0 bottom-0 h-3 bg-gradient-to-t', 'inset-x-0 bottom-0 h-px'],
        x: ['inset-y-0 right-0 w-3 bg-gradient-to-l', 'inset-y-0 right-0 w-px']
    }
};

// Marks an edge with more past it. choose: a selectable card lies past it, so the edge takes the selection colour.
// The top and bottom edges sit inside anything kept along the view's top and bottom (--board-hint-top/-bottom).
const insetAt = {
    y: {
        start: { top: 'var(--board-hint-top, 0px)' },
        end: { bottom: 'var(--board-hint-bottom, 0px)' }
    },
    x: {
        start: { top: 'var(--board-hint-top, 0px)', bottom: 'var(--board-hint-bottom, 0px)' },
        end: { top: 'var(--board-hint-top, 0px)', bottom: 'var(--board-hint-bottom, 0px)' }
    }
};
const MoreHint = ({ show, choose, end, axis }) => {
    const [place, line] = hints[end][axis];
    const kind = !show ? null : choose ? 'choose' : 'more';
    return (
        <AnimatePresence initial={false}>
            {kind && (
                <motion.div
                    key={kind}
                    aria-hidden
                    data-more-hint={kind}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: motionOff() ? 0 : 0.25, ease: 'easeOut' }}
                    style={insetAt[axis][end]}
                    className={classNames(
                        'pointer-events-none absolute z-[240] to-transparent',
                        kind === 'choose' ? 'from-select/20' : 'from-black/50',
                        place
                    )}
                >
                    <span
                        className={classNames(
                            'absolute',
                            kind === 'choose'
                                ? 'ring-selectable bg-select [--ring-scale:1]'
                                : 'bg-gold shadow-[0_0_6px_1px_rgba(201,164,92,0.7)]',
                            line
                        )}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Whether a card that can be chosen lies past each edge of an element scrolled along both axes: more than half of it
// beyond that edge
const useChoicesPast = (ref, contentRef) => {
    const [past, setPast] = useState({});
    useLayoutEffect(() => {
        const area = ref.current;
        const content = contentRef.current;
        if (!area || !content) {
            return;
        }
        let frame = null;
        const check = () => {
            frame = null;
            const view = area.getBoundingClientRect();
            const next = { left: false, right: false, top: false, bottom: false };
            content.querySelectorAll('.ring-selectable').forEach((card) => {
                const box = card.getBoundingClientRect();
                if (box.width === 0 && box.height === 0) {
                    return;
                }
                const x = box.left + box.width / 2;
                const y = box.top + box.height / 2;
                next.left ||= x < view.left;
                next.right ||= x > view.right;
                next.top ||= y < view.top;
                next.bottom ||= y > view.bottom;
            });
            setPast((current) =>
                Object.keys(next).every((side) => !!current[side] === next[side]) ? current : next
            );
        };
        const soon = () => {
            frame ??= requestAnimationFrame(check);
        };
        check();
        const observer = new ResizeObserver(soon);
        observer.observe(area);
        observer.observe(content);
        const selectable = (classes) => /(^|\s)ring-selectable(\s|$)/.test(classes ?? '');
        const mutations = new MutationObserver((records) => {
            if (
                records.some(
                    (record) =>
                        record.type === 'childList' ||
                        selectable(record.oldValue) !==
                            selectable(record.target.getAttribute('class'))
                )
            ) {
                soon();
            }
        });
        mutations.observe(content, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
            attributeOldValue: true
        });
        area.addEventListener('scroll', soon, { passive: true });
        return () => {
            observer.disconnect();
            mutations.disconnect();
            area.removeEventListener('scroll', soon);
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
        };
    }, [ref, contentRef]);
    return past;
};

const sides = {
    x: { start: 'left', end: 'right' },
    y: { start: 'top', end: 'bottom' }
};

// Whether an element scrolled along an axis has more to see before its start and past its end
const useScrollEdges = (ref, axis, contentRef) => {
    const [more, setMore] = useState({ start: false, end: false });
    useLayoutEffect(() => {
        const area = ref.current;
        if (!area) {
            return;
        }
        const show = () => {
            const at = axis === 'x' ? area.scrollLeft : area.scrollTop;
            const size = axis === 'x' ? area.clientWidth : area.clientHeight;
            const total = axis === 'x' ? area.scrollWidth : area.scrollHeight;
            const start = at > edge;
            const end = at + size < total - edge;
            setMore((current) =>
                current.start === start && current.end === end ? current : { start, end }
            );
        };
        show();
        const observer = new ResizeObserver(show);
        observer.observe(area);
        const content = contentRef?.current;
        [...(content ? [content] : area.children)].forEach((child) => observer.observe(child));
        const mutations = content ? null : new MutationObserver(show);
        mutations?.observe(area, { childList: true, subtree: true });
        area.addEventListener('scroll', show, { passive: true });
        return () => {
            observer.disconnect();
            mutations?.disconnect();
            area.removeEventListener('scroll', show);
        };
    }, [ref, axis, contentRef]);
    return more;
};

// Scrolls on axis 'x', 'y' or 'both', marking edges with more past them. anchor 'end' keeps it scrolled to the end
// as it grows, unless scrolled away. Marked data-clips for flip.js. Sets --scroll-view-width on its content.
const ScrollArea = ({ anchor = 'start', axis = 'y', className, contentClassName, children }) => {
    const ref = useRef(null);
    const contentRef = useRef(null);
    useLayoutEffect(() => {
        const area = ref.current;
        const content = contentRef.current;
        if (!area || !content || axis === 'y') {
            return;
        }
        const measure = () =>
            content.style.setProperty('--scroll-view-width', `${area.clientWidth}px`);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(area);
        return () => observer.disconnect();
    }, [axis]);
    const pinned = useRef(true);
    const sideways = axis === 'x';
    const across = useScrollEdges(ref, 'x', contentRef);
    const down = useScrollEdges(ref, 'y', contentRef);
    const choices = useChoicesPast(ref, contentRef);
    const edges = {
        x: axis === 'y' ? null : across,
        y: axis === 'x' ? null : down
    };

    useLayoutEffect(() => {
        const area = ref.current;
        if (!area || anchor !== 'end') {
            return;
        }
        const along = sideways ? 'scrollLeft' : 'scrollTop';
        // Where it last scrolled itself to. Its scroll event comes later, by when what it holds may have grown, so
        // that event is not taken as being scrolled away from the end: it catches up instead.
        let ownScroll = null;
        // Only when not at the end already: setting it at all would stop a smooth scroll along the other axis
        const keep = () => {
            const end = sideways
                ? area.scrollWidth - area.clientWidth
                : area.scrollHeight - area.clientHeight;
            if (pinned.current && Math.abs(area[along] - end) >= 1) {
                area[along] = end;
                ownScroll = area[along];
            }
        };
        const onScroll = () => {
            const at = area[along];
            if (ownScroll !== null && Math.abs(at - ownScroll) < 1) {
                keep();
                return;
            }
            ownScroll = null;
            const size = sideways ? area.clientWidth : area.clientHeight;
            const total = sideways ? area.scrollWidth : area.scrollHeight;
            pinned.current = at + size >= total - edge;
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
    }, [anchor, sideways]);

    return (
        <div className={classNames('relative min-h-0 min-w-0', className)}>
            <div
                ref={ref}
                data-clips=''
                // Scroll stops at its ends only along the axes it scrolls, so a swipe the other way carries on to the
                // area around it (the board scrolling sideways around a play area that scrolls up and down)
                className={classNames('h-full w-full [scrollbar-width:none]', {
                    'overflow-x-auto overflow-y-hidden overscroll-x-contain': axis === 'x',
                    'overflow-y-auto overflow-x-hidden overscroll-y-contain': axis === 'y',
                    'overflow-auto overscroll-contain': axis === 'both'
                })}
            >
                <div
                    ref={contentRef}
                    className={classNames(
                        'flex',
                        {
                            'h-full w-max min-w-full': axis === 'x',
                            'min-h-full': axis === 'y',
                            'min-h-full w-max min-w-full': axis === 'both'
                        },
                        contentClassName
                    )}
                >
                    {children}
                </div>
            </div>
            {['x', 'y'].map((along) =>
                ['start', 'end'].map((end) => (
                    <MoreHint
                        key={along + end}
                        show={!!edges[along]?.[end]}
                        choose={!!choices[sides[along][end]]}
                        end={end}
                        axis={along}
                    />
                ))
            )}
        </div>
    );
};

export default ScrollArea;
