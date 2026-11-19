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
// Dragging the handle this far towards the sheet's edge closes it
const swipeDistance = 50;
// Card sizes, in rem at a scale of 1, as CardTiledList lays them out
const unit = { w: 4, h: 5.6, gap: 0.375 };
// The list's padding on each side
const paddingRem = 0.75;
// Room kept between a sheet and its board's edges
const margin = 8;
// The header's height, near enough, for sizing the cards to what is left
const headerPx = 36;

// The cards' size and how many fit across the room a sheet may take: in phone landscape, where height is short, one
// row as tall as the room allows, scrolling sideways; elsewhere at a size that reads well, as many to a row as fit
const sizeFor = ({ width, height }, row, rem) => {
    const free = width - paddingRem * 2 * rem;
    if (row) {
        const scale = Math.max(
            0.6,
            Math.min((height - headerPx - paddingRem * 2 * rem) / (unit.h * rem), 2)
        );
        return { scale, columns: null, plotColumns: null };
    }
    const target = Math.min(96, Math.max(72, window.innerWidth / 5));
    const scale = target / (unit.w * rem);
    const across = (cell) =>
        Math.max(
            1,
            Math.floor((free + unit.gap * scale * rem) / ((cell + unit.gap) * scale * rem))
        );
    return { scale, columns: across(unit.w), plotColumns: across(unit.h) };
};

const boardOf = (sheet) =>
    sheet.playerName
        ? document.querySelector(`[data-side][data-player="${CSS.escape(sheet.playerName)}"]`)
        : document.querySelector(`[data-side="${sheet.side}"]`);

// What of the board can be seen: the board's view, less the prompt's column in phone landscape
const viewRect = () => {
    const scroll = document.querySelector('[data-board-scroll]');
    const view = scroll
        ? scroll.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const box = { left: view.left, right: view.right, top: view.top, bottom: view.bottom };
    const column = document.querySelector('[data-region="prompt-column"]')?.getBoundingClientRect();
    if (column && column.width > 0) {
        if (column.left <= box.left + 1) {
            box.left = Math.max(box.left, column.right);
        } else {
            box.right = Math.min(box.right, column.left);
        }
    }
    return box;
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

// A player's sheet, for looking into one of their piles: it slides out from their board's outer edge in view (the
// top of a board in the top row, the bottom of one in the bottom row), as big as its cards need, up to the room the
// board has in view, and across the middle of what of the board is in view. It keeps to its board as the table
// scrolls, leaving the screen with it, cut off where the board's view ends, never over the site's own bar above it.
// The pile draws its cards into it; going to another of the player's piles only changes what is inside. It closes
// with its button, by tapping its pile again, or (on a phone) by swiping its handle towards its edge. Picking a card
// up out of it shrinks it to its header, out of the way, until the card is put down.
const SheetFrame = ({ sheetKey, sheet, open, mode, piles }) => {
    const row = mode === 'short';
    const phone = mode !== 'wide';
    const [visible, setVisible] = useState(false);
    const [strip, setStrip] = useState(false);
    const frameRef = useRef(null);
    const boxRef = useRef(null);
    const fromTop = sheet.side === 'top';
    const chipsRef = useRef(null);
    const [size, setSize] = useState(null);
    const setContent = useCallback((node) => sheetStore.setContentNode(sheetKey, node), [sheetKey]);

    useLayoutEffect(() => {
        if (!open) {
            setVisible(false);
            setStrip(false);
            return;
        }
        const frame = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(frame);
    }, [open]);

    useEffect(() => {
        sheetStore.setLayout(sheetKey, {
            height: strip ? 'strip' : 'full',
            row,
            columns: size?.columns ?? null,
            plotColumns: size?.plotColumns ?? null
        });
    }, [sheetKey, strip, row, size]);

    // Kept over its board as the board moves, without drawing again: only its place and size change. The box it
    // slides out of spans the board, and what of it is in view up and down; the sheet keeps across the middle of
    // what of the board is in view.
    const place = useCallback(() => {
        const frame = frameRef.current;
        const box = boxRef.current;
        const boardElement = boardOf(sheet);
        if (!frame || !box) {
            return;
        }
        const view = viewRect();
        const board = boardElement
            ? boardElement.getBoundingClientRect()
            : {
                  ...view,
                  top: fromTop ? view.top : (view.top + view.bottom) / 2,
                  bottom: fromTop ? (view.top + view.bottom) / 2 : view.bottom
              };
        const top = Math.max(board.top, view.top);
        const height = Math.max(0, Math.min(board.bottom, view.bottom) - top);
        const boardWidth = board.right - board.left;
        box.style.left = `${board.left}px`;
        box.style.width = `${boardWidth}px`;
        box.style.top = `${top}px`;
        box.style.height = `${height}px`;
        box.style.clipPath = `inset(0 ${Math.max(0, board.right - view.right)}px 0 ${Math.max(0, view.left - board.left)}px)`;
        const room = {
            width: Math.max(160, Math.min(boardWidth, view.right - view.left) - margin * 2),
            height: Math.max(0, height - margin)
        };
        frame.style.maxWidth = `${room.width}px`;
        frame.style.maxHeight = `${room.height}px`;
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const next = sizeFor(room, row, rem);
        setSize((current) =>
            current &&
            Math.abs(current.scale - next.scale) < 0.01 &&
            current.columns === next.columns &&
            current.plotColumns === next.plotColumns
                ? current
                : next
        );
        const width = frame.offsetWidth;
        const seenLeft = Math.max(board.left, view.left);
        const seenRight = Math.min(board.right, view.right);
        const middle =
            seenRight > seenLeft ? (seenLeft + seenRight) / 2 : (board.left + board.right) / 2;
        const left =
            boardWidth < width + margin * 2
                ? (boardWidth - width) / 2
                : Math.min(
                      Math.max(middle - board.left - width / 2, margin),
                      boardWidth - margin - width
                  );
        frame.style.left = `${left}px`;
    }, [sheet, row, fromTop]);

    useLayoutEffect(() => {
        place();
    });
    useLayoutEffect(() => {
        place();
    });
    useEffect(() => {
        let frame = null;
        const soon = () => {
            frame ??= requestAnimationFrame(() => {
                frame = null;
                place();
            });
        };
        const observer = new ResizeObserver(soon);
        if (frameRef.current) {
            observer.observe(frameRef.current);
        }
        const board = boardOf(sheet);
        if (board) {
            observer.observe(board);
        }
        document.addEventListener('scroll', place, { capture: true, passive: true });
        window.addEventListener('resize', soon);
        return () => {
            observer.disconnect();
            document.removeEventListener('scroll', place, { capture: true });
            window.removeEventListener('resize', soon);
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
        };
    }, [place, sheet]);

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

    // The open pile's chip is brought into view, however far along its player's piles it is
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
    }, [sheet.id, piles]);

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
    }, [sheet.id, piles, readChipEdges]);

    // On a phone, swiping the handle towards the sheet's edge closes it; the sheet follows the finger that way
    const swipe = useRef(null);
    const [pull, setPull] = useState(0);
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
                sheet.close();
            }
        },
        onPointerCancel: () => {
            swipe.current = null;
            setPull(0);
        }
    };

    const stopDrag = (event) => event.stopPropagation();
    const playerPiles = sheet.playerName ? pilesOf(piles, sheet.playerName) : [];
    const chips = playerPiles.length > 0 && (
        <div
            ref={chipsRef}
            className='relative flex min-w-0 flex-1 gap-1 overflow-x-auto py-1 [scrollbar-width:none] lg:gap-1.5'
            onScroll={readChipEdges}
            style={chipFade(chipEdges)}
        >
            {playerPiles.map((pile) => {
                const current = pile.id === sheet.id;
                const choose = pile.selectable && !current;
                return (
                    <button
                        key={pile.id}
                        type='button'
                        data-pile-chip={pile.source}
                        data-current={current ? '' : undefined}
                        data-choose={choose ? '' : undefined}
                        title={choose ? `${pile.title}: has cards to choose` : pile.title}
                        className={classNames(
                            'shrink-0 rounded-full border px-2 text-[10px] font-semibold uppercase leading-5 tracking-wide lg:px-2.5 lg:py-0.5 lg:text-[11px]',
                            current
                                ? 'border-amber-400 bg-amber-400/20 text-amber-100'
                                : choose
                                  ? 'ring-selectable border-[rgb(var(--select-ring))] bg-[rgb(var(--select-ring)/0.15)] text-white'
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

    const shown = visible && open;
    const pulled = Math.max(toEdge(pull), 0) * (fromTop ? -1 : 1);
    const grabber = phone && (
        <div className='hud-zoom shrink-0 cursor-grab touch-none select-none' {...handleProps}>
            <div className='mx-auto my-1 h-1 w-10 rounded-full bg-default-400' />
        </div>
    );
    return createPortal(
        <div ref={boxRef} className='pointer-events-none fixed z-[310] overflow-hidden'>
            <div
                ref={frameRef}
                data-popup=''
                data-sheet={sheet.id}
                data-sheet-player={sheet.playerName}
                className={classNames(
                    'absolute flex w-max flex-col border-x border-default-200 bg-zinc-950/95',
                    fromTop
                        ? 'top-0 flex-col-reverse rounded-b-xl border-b shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
                        : 'bottom-0 flex-col rounded-t-xl border-t shadow-[0_-8px_24px_rgba(0,0,0,0.6)]',
                    { 'pointer-events-auto': open }
                )}
                style={{
                    translate: shown ? `0 ${pulled}px` : fromTop ? '0 -100%' : '0 100%',
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
                    {sheet.playerName && <PlayerTag player={sheet.playerName} />}
                    {chips || (
                        <span className='min-w-0 flex-1 truncate text-sm font-bold text-amber-100'>
                            {sheet.title}
                        </span>
                    )}
                    <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        title='Close'
                        className='h-6 w-6 min-w-6 shrink-0 lg:h-8 lg:w-8 lg:min-w-8'
                        onPress={() => sheet.close()}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>
                <div
                    ref={setContent}
                    className={classNames('min-h-0 flex-1 overflow-y-auto overflow-x-hidden', {
                        hidden: strip
                    })}
                    style={size ? { '--card-scale': String(size.scale) } : undefined}
                />
            </div>
        </div>,
        document.querySelector('[data-overlay-container="true"]') || document.body
    );
};

// The board's sheets: each player's open one, and any closing, until they have slid away
const SheetHost = ({ mode }) => {
    const { sheets, piles } = useSheetState();
    const [leaving, setLeaving] = useState({});
    const previous = useRef(sheets);
    const timers = useRef({});
    useLayoutEffect(() => {
        const before = previous.current;
        previous.current = sheets;
        const gone = Object.keys(before).filter((key) => !sheets[key]);
        const back = Object.keys(sheets).filter((key) => timers.current[key]);
        back.forEach((key) => {
            clearTimeout(timers.current[key]);
            delete timers.current[key];
        });
        if (gone.length === 0 && back.length === 0) {
            return;
        }
        setLeaving((current) => {
            const next = { ...current };
            back.forEach((key) => delete next[key]);
            gone.forEach((key) => {
                next[key] = before[key];
            });
            return next;
        });
        gone.forEach((key) => {
            timers.current[key] = setTimeout(
                () => {
                    delete timers.current[key];
                    setLeaving(({ [key]: done, ...rest }) => rest); // eslint-disable-line no-unused-vars
                },
                motionOff() ? 0 : slideTime
            );
        });
    }, [sheets]);
    useEffect(() => {
        const pending = timers.current;
        return () => Object.values(pending).forEach(clearTimeout);
    }, []);

    // A sheet just closed is still drawn before the effect above marks it as leaving, so it slides away rather than
    // being drawn afresh, already gone
    const closing = Object.fromEntries(
        Object.entries(previous.current).filter(([key]) => !sheets[key])
    );
    const frames = { ...closing, ...leaving, ...sheets };
    return Object.entries(frames).map(([key, sheet]) => (
        <SheetFrame
            key={key}
            sheetKey={key}
            sheet={sheet}
            open={!!sheets[key]}
            mode={mode}
            piles={piles}
        />
    ));
};

export default SheetHost;
