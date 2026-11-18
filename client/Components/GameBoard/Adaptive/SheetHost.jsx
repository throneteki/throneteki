import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { Avatar, Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDragSource } from '../dragStore';
import { motionOff } from '../../../flip';
import { pilesOf, sheetStore, useSheetState } from './sheetStore';

const slideTime = 220;

const chipFade = ({ start, end }) => {
    if (!start && !end) {
        return undefined;
    }
    const mask = `linear-gradient(to right, ${start ? 'transparent' : 'black'} 0, black 1.25rem, black calc(100% - 1.25rem), ${end ? 'transparent' : 'black'} 100%)`;
    return { maskImage: mask, WebkitMaskImage: mask };
};
// Dragging the handle this far away from the divider closes the sheet
const swipeDistance = 50;
const gapRem = 0.375;
// The list's padding on each side
const paddingRem = 0.85;

// The card size that fills the sheet: in a row (phone landscape, where height is short), as tall as the sheet
// allows; otherwise whole columns across it, a few cards on a phone and more on a large screen. Plots are drawn at
// the same size as every other pile's cards, turned on their side.
const fittedScale = ({ width, height }, { row }, rem) => {
    const unit = { w: 4, h: 5.6 };
    const free = width - paddingRem * 2 * rem;
    if (row) {
        // As tall as the room under the header allows; the row scrolls sideways
        return Math.max(0.6, Math.min((height - paddingRem * 2 * rem) / (unit.h * rem), 2));
    }
    const target = 96 * Math.max(1, width / 900);
    const columns = Math.max(3, Math.floor(free / target));
    // The gap between cards grows with them, so it is counted in card units too
    return Math.min(free / ((columns * unit.w + (columns - 1) * gapRem) * rem), 2.4);
};

// Where the sheet sits: over its player's whole half, from the screen's edge to the divider, beside the prompt's
// column where it has one. While a card is carried out of it, only its header shows, at that edge.
const placement = (fromTop, strip) => {
    const sides = { left: 'var(--board-sheet-left, 0px)', right: 'var(--board-sheet-right, 0px)' };
    if (fromTop) {
        return strip
            ? { ...sides, top: 0 }
            : { ...sides, top: 0, bottom: 'calc(100% - var(--board-divider-top, 50%))' };
    }
    return strip
        ? { ...sides, bottom: 0 }
        : { ...sides, top: 'var(--board-divider-bottom, 50%)', bottom: 0 };
};

// Whose piles these are: the avatar alone on a phone, with the name where there is room
const PlayerTag = ({ player }) => (
    <span className='flex min-w-0 shrink-0 items-center gap-1.5' title={player}>
        <Avatar
            src={player ? `/img/avatar/${player}.png` : undefined}
            showFallback
            name={player}
            className='h-5 w-5 text-tiny lg:h-6 lg:w-6'
        />
        <span className='hidden max-w-[10rem] truncate text-sm font-semibold lg:inline'>
            {player}
        </span>
    </span>
);

// The board's one sheet, for looking into a pile: it covers the pile's player's half of the screen, sliding in from
// that edge and away again. The pile draws its cards into it; going to another pile only changes what is inside.
// It closes when tapped away from (unless its cards are being chosen from), swiped towards its edge or closed with
// its button. Picking a card up out of it shrinks it to its header, out of the way, until the card is put down.
const SheetHost = ({ mode }) => {
    const { active, piles } = useSheetState();
    const row = mode === 'short';
    // The sheet drawn: the one shown, or the last one while it slides away
    const [drawn, setDrawn] = useState(null);
    const [visible, setVisible] = useState(false);
    const [strip, setStrip] = useState(false);
    const sheetRef = useRef(null);
    const contentRef = useRef(null);
    const chipsRef = useRef(null);
    const [contentScale, setContentScale] = useState(null);
    // The piles draw into this, so it is handed to the store once, as it comes and goes, not on every render
    const setContent = useCallback((node) => {
        contentRef.current = node;
        sheetStore.setContentNode(node);
    }, []);

    // Slides in when a pile opens and away when it closes; another pile opening while it shows just takes it over
    useLayoutEffect(() => {
        if (active) {
            setDrawn(active);
            if (!visible) {
                const frame = requestAnimationFrame(() => setVisible(true));
                return () => cancelAnimationFrame(frame);
            }
            return;
        }
        setVisible(false);
        setStrip(false);
        const timer = setTimeout(() => setDrawn(null), motionOff() ? 0 : slideTime);
        return () => clearTimeout(timer);
    }, [active, visible]);

    useEffect(() => {
        sheetStore.setLayout({ height: strip ? 'strip' : 'full', row });
    }, [strip, row]);

    const close = () => active?.close();

    // A tap anywhere off the sheet closes it, unless its cards are being chosen from, when the board may be needed
    // too. A tap in a menu or dialog the sheet opened is not off it.
    useEffect(() => {
        if (!active || active.prompting) {
            return;
        }
        const away = (event) => {
            if (
                sheetRef.current &&
                !sheetRef.current.contains(event.target) &&
                !event.target.closest?.('[role="dialog"], [role="menu"]')
            ) {
                active.close();
            }
        };
        document.addEventListener('pointerdown', away, true);
        return () => document.removeEventListener('pointerdown', away, true);
    }, [active]);

    // A card picked up from the sheet is carried over the board, so the sheet gets out of its way
    const pressedInside = useRef(false);
    const dragSource = useDragSource();
    useEffect(() => {
        if (dragSource && pressedInside.current) {
            setStrip(true);
        } else if (!dragSource && pressedInside.current) {
            pressedInside.current = false;
            setStrip(false);
        }
    }, [dragSource]);

    // The cards are sized to fill the sheet
    useLayoutEffect(() => {
        const content = contentRef.current;
        if (!content || strip) {
            return;
        }
        const measure = () => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            setContentScale(
                fittedScale(
                    { width: content.clientWidth, height: content.clientHeight },
                    { row },
                    rem
                )
            );
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(content);
        return () => observer.disconnect();
    }, [strip, row, drawn]);

    // The open pile's chip is brought into view, however far along its player's piles it is
    const drawnId = drawn?.id;
    useLayoutEffect(() => {
        const chips = chipsRef.current;
        const chip = chips?.querySelector('[data-current]');
        if (!chip) {
            return;
        }
        const left = chip.offsetLeft - chips.offsetLeft;
        if (left < chips.scrollLeft) {
            chips.scrollLeft = left;
        } else if (left + chip.offsetWidth > chips.scrollLeft + chips.clientWidth) {
            chips.scrollLeft = left + chip.offsetWidth - chips.clientWidth;
        }
    }, [drawnId, piles]);

    // Which ends of the chips have more past them, to fade out there rather than cut off
    const [chipEdges, setChipEdges] = useState({ start: false, end: false });
    const readChipEdges = useCallback(() => {
        const chips = chipsRef.current;
        const start = !!chips && chips.scrollLeft > 1;
        const end = !!chips && chips.scrollLeft + chips.clientWidth < chips.scrollWidth - 1;
        setChipEdges((current) =>
            current.start === start && current.end === end ? current : { start, end }
        );
    }, []);
    useLayoutEffect(() => {
        const chips = chipsRef.current;
        readChipEdges();
        if (!chips) {
            return;
        }
        const observer = new ResizeObserver(readChipEdges);
        observer.observe(chips);
        return () => observer.disconnect();
    }, [drawnId, piles, readChipEdges]);

    // Swiping the handle towards the sheet's edge closes it; the sheet follows the finger that way
    const swipe = useRef(null);
    const [pull, setPull] = useState(0);
    const fromTop = drawn?.side === 'top';
    const toEdge = (dy) => (fromTop ? -dy : dy);
    const handleProps = {
        onPointerDown: (event) => {
            swipe.current = { y: event.clientY };
            event.currentTarget.setPointerCapture?.(event.pointerId);
        },
        onPointerMove: (event) => {
            if (swipe.current) {
                setPull(event.clientY - swipe.current.y);
            }
        },
        onPointerUp: (event) => {
            const start = swipe.current;
            swipe.current = null;
            setPull(0);
            if (start && toEdge(event.clientY - start.y) > swipeDistance) {
                active?.close();
            }
        },
        onPointerCancel: () => {
            swipe.current = null;
            setPull(0);
        }
    };

    if (!drawn) {
        return null;
    }

    const stopDrag = (event) => event.stopPropagation();
    const playerPiles = drawn.playerName ? pilesOf(piles, drawn.playerName) : [];
    const pulled = Math.max(toEdge(pull), 0) * (fromTop ? -1 : 1);
    const grabber = (
        <div className='hud-zoom shrink-0 cursor-grab touch-none select-none' {...handleProps}>
            <div className='mx-auto my-1 h-1 w-10 rounded-full bg-default-400 lg:h-1.5' />
        </div>
    );
    const chips = playerPiles.length > 0 && (
        <div
            ref={chipsRef}
            className='relative flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] lg:gap-1.5'
            onScroll={readChipEdges}
            style={chipFade(chipEdges)}
        >
            {playerPiles.map((pile) => {
                const current = pile.id === drawn.id;
                return (
                    <button
                        key={pile.id}
                        type='button'
                        data-pile-chip={pile.source}
                        data-current={current ? '' : undefined}
                        className={classNames(
                            'shrink-0 rounded-full border px-2 text-[10px] font-semibold uppercase leading-5 tracking-wide lg:px-2.5 lg:py-0.5 lg:text-[11px]',
                            current
                                ? 'border-amber-400 bg-amber-400/20 text-amber-100'
                                : 'border-default-300/60 text-default-300'
                        )}
                        onClick={() => !current && pile.open()}
                    >
                        {pile.title}
                    </button>
                );
            })}
        </div>
    );

    return createPortal(
        <div
            ref={sheetRef}
            data-popup=''
            data-sheet={drawn.id}
            className={classNames(
                'fixed inset-x-0 z-[310] flex border-default-200 bg-zinc-950/95',
                fromTop
                    ? 'flex-col-reverse rounded-b-xl border-b pt-[var(--safe-top)] shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
                    : 'flex-col rounded-t-xl border-t pb-[var(--safe-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.6)]',
                { 'mx-auto max-w-5xl border-x': mode === 'wide' }
            )}
            style={{
                ...placement(fromTop, strip),
                translate: visible ? `0 ${pulled}px` : fromTop ? '0 -100%' : '0 100%',
                transition: motionOff() || pull ? 'none' : `translate ${slideTime}ms ease-out`
            }}
            onPointerDownCapture={() => {
                pressedInside.current = true;
            }}
            onPointerUpCapture={() => {
                if (!dragSource) {
                    pressedInside.current = false;
                }
            }}
            onClick={(event) => event.stopPropagation()}
        >
            {grabber}
            <div
                className={classNames(
                    'hud-zoom flex min-w-0 shrink-0 select-none items-center gap-1.5 px-2 lg:gap-2 lg:px-3',
                    fromTop ? 'pt-0.5 lg:pt-1' : 'pb-0.5 lg:pb-1'
                )}
                onPointerDown={stopDrag}
            >
                {drawn.playerName && <PlayerTag player={drawn.playerName} />}
                {chips || (
                    <span className='min-w-0 flex-1 truncate text-sm font-bold text-amber-100'>
                        {drawn.title}
                    </span>
                )}
                <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    title='Close'
                    className='h-6 w-6 min-w-6 shrink-0 lg:h-8 lg:w-8 lg:min-w-8'
                    onPress={close}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </Button>
            </div>
            <div
                ref={setContent}
                className={classNames('min-h-0 flex-1 overflow-y-auto overflow-x-hidden', {
                    hidden: strip
                })}
                style={contentScale ? { '--card-scale': String(contentScale) } : undefined}
            />
        </div>,
        document.querySelector('[data-overlay-container="true"]') || document.body
    );
};

export default SheetHost;
