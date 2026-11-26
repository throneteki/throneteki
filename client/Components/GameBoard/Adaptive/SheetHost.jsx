import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Button from '../../Site/Button';
import PlayerAvatar from './PlayerAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useDragSource } from '../dragStore';
import { motionOff } from '../../../flip';
import { pilesOf, sheetStore, slideTime, useSheetState } from './sheetStore';
import { remSize } from '../../../cardScale';

// Going from pile to pile: the body eases to the new pile's height as its cards fade in
const resizeTime = 200;
// A tap outside the sheets, which closes them: moved less than this (pixels), let go within this (ms)
const tapSlop = 10;
const tapTime = 500;

const chipFade = ({ start, end }) => {
    if (!start && !end) {
        return undefined;
    }
    const mask = `linear-gradient(to right, ${start ? 'transparent' : 'black'} 0, black 1.25rem, black calc(100% - 1.25rem), ${end ? 'transparent' : 'black'} 100%)`;
    return { maskImage: mask, WebkitMaskImage: mask };
};
// How far a sheet must be pulled towards its edge, still moving that way, to close when let go
const swipeDistance = 24;
// Card sizes, in rem at a scale of 1, as CardTiledList lays them out
const unit = { w: 4, h: 5.6, gap: 0.375 };
// The list's padding on each side
const paddingRem = 0.75;
// Room kept between a sheet and its board's edges
const margin = 8;
// The header's height, near enough, for sizing the cards to what is left
const headerPx = 36;
// The most cards a row holds, however wide the sheet: sideways cards (plots), and upright ones
const maxAcross = { sideways: 5, upright: 10 };

// The cards' scale and columns for a sheet's room: one row in phone landscape (row), else as many columns as fit
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
    return {
        scale,
        columns: Math.min(maxAcross.upright, across(unit.w)),
        plotColumns: Math.min(maxAcross.sideways, across(unit.h))
    };
};

const boardOf = (sheet) =>
    sheet.playerName
        ? document.querySelector(`[data-side][data-player="${CSS.escape(sheet.playerName)}"]`)
        : document.querySelector(`[data-side="${sheet.side}"]`);

// Our sheet slides out from the bottom of everything that is ours: in portrait our hand's row lies below our board
const handTrayBelow = (sheet, board) => {
    const tray =
        sheet.side === 'bottom' ? document.querySelector('[data-region="hand-tray"]') : null;
    const rect = tray?.getBoundingClientRect();
    return rect && rect.top >= board.bottom - 2 ? rect : null;
};

// Whether the cards are scrolled fully towards the sheet's edge, so a swipe that way closes the sheet
const scrolledToEdge = (body, fromTop) =>
    fromTop ? body.scrollTop + body.clientHeight >= body.scrollHeight - 1 : body.scrollTop <= 0;

// The board's visible view, less the prompt beside it, so a sheet is never drawn over the prompt
const viewRect = () => {
    const scroll = document.querySelector('[data-board-scroll]');
    const view = scroll
        ? scroll.getBoundingClientRect()
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    const box = { left: view.left, right: view.right, top: view.top, bottom: view.bottom };
    for (const region of ['prompt-column', 'prompt-float']) {
        const prompt = document.querySelector(`[data-region="${region}"]`)?.getBoundingClientRect();
        if (!prompt || prompt.width === 0) {
            continue;
        }
        if (prompt.left <= box.left + 1) {
            box.left = Math.max(box.left, prompt.right);
        } else {
            box.right = Math.min(box.right, prompt.left);
        }
    }
    return box;
};

// Phone: how far a sheet reaches under the stats bar at its edge, so it seems to come out from behind it
const underStats = (fromTop, view, edge) => {
    const stats = document
        .querySelector(`[data-sheet-edge="${fromTop ? 'top' : 'bottom'}"]`)
        ?.getBoundingClientRect();
    if (!stats) {
        return 0;
    }
    if (fromTop) {
        return edge <= view.top + 2 && stats.bottom <= view.top + 2 ? edge - stats.top : 0;
    }
    return edge >= view.bottom - 2 && stats.top >= view.bottom - 2 ? stats.bottom - edge : 0;
};

// Desktop: pulling the handle detachAt px (giving tugGive of the pull) floats the sheet; let go with its edge
// against the board's, it docks again
const detachAt = 64;
const tugGive = 0.3;
const popTime = 180;

// Where each seat's sheet was left (localStorage): docked, its middle across the board (0 to 1); floating, its top
// left corner
const placeKey = (seat) => `sheet-place-${seat}`;
const readPlace = (seat) => {
    try {
        const saved = JSON.parse(localStorage.getItem(placeKey(seat)));
        return {
            dock: Number.isFinite(saved?.dock) ? saved.dock : null,
            float:
                Number.isFinite(saved?.float?.left) && Number.isFinite(saved?.float?.top)
                    ? { left: saved.float.left, top: saved.float.top }
                    : null
        };
    } catch {
        return { dock: null, float: null };
    }
};
const writePlace = (seat, { dock, float }) => {
    try {
        localStorage.setItem(placeKey(seat), JSON.stringify({ dock, float }));
    } catch {
        // Kept for this visit only
    }
};

// How much of a board can be seen across, and where its edges are
const seenSpan = (sheet) => {
    const view = viewRect();
    const board = boardOf(sheet)?.getBoundingClientRect() ?? view;
    return {
        left: Math.max(board.left, view.left),
        right: Math.min(board.right, view.right),
        top: Math.max(board.top, view.top),
        bottom: Math.min(board.bottom, view.bottom)
    };
};

const clampTo = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));

// Where a floating sheet would dock, outlined while it touches its edge
const DockHint = ({ spot, fromTop }) => (
    <div
        aria-hidden
        data-sheet-dock-hint=''
        className={classNames(
            'pointer-events-none fixed z-[299] border-2 border-gold bg-gold/10',
            fromTop ? 'border-t-0' : 'border-b-0'
        )}
        style={{ left: spot.left, top: spot.top, width: spot.width, height: spot.height }}
    />
);

// Whose piles these are: the avatar alone on a phone, with the name where there is room
const PlayerTag = ({ player }) => (
    <span className='flex min-w-0 shrink-0 items-center gap-1.5' title={player}>
        <PlayerAvatar name={player} className='h-5 w-5 lg:h-6 lg:w-6' />
        <span className='hidden max-w-[10rem] truncate text-sm font-semibold lg:inline'>
            {player}
        </span>
    </span>
);

// A player's sheet: slides from their board's outer edge, centred on its visible part. Closes with its button, its
// pile or (phones) a swipe; shrinks to its header while a card from it is carried.
const SheetFrame = ({ sheetKey, sheet, open, mode, piles }) => {
    const row = mode === 'short';
    const phone = mode !== 'wide';
    const seat = sheet.seat ?? sheetKey;
    const [saved] = useState(() => (phone ? { dock: null, float: null } : readPlace(seat)));
    const dockRef = useRef(saved.dock);
    const floatRef = useRef(saved.float);
    const [floating, setFloating] = useState(!!floatRef.current);
    const [tug, setTug] = useState(0);
    const [held, setHeld] = useState(false);
    const [dockSpot, setDockSpot] = useState(null);
    const popFrom = useRef(null);
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

    // Placed by style, not state, so following the board's scroll never re-renders; the cards are only resized on
    // open and resize
    const sized = useRef(false);
    const place = useCallback(
        (resize = false) => {
            const frame = frameRef.current;
            const box = boxRef.current;
            const boardElement = boardOf(sheet);
            if (!frame || !box) {
                return;
            }
            const rem = remSize();
            if (floatRef.current) {
                // Floating, it may go anywhere over the game board, and is kept within it
                const area = document.querySelector('[data-layout]')?.getBoundingClientRect() ?? {
                    left: 0,
                    top: 0,
                    width: window.innerWidth,
                    height: window.innerHeight
                };
                Object.assign(box.style, {
                    left: `${area.left}px`,
                    top: `${area.top}px`,
                    width: `${area.width}px`,
                    height: `${area.height}px`,
                    clipPath: 'none'
                });
                frame.style.paddingTop = '';
                frame.style.paddingBottom = '';
                // No taller than the player's board, as it is docked
                const span = seenSpan(sheet);
                const tall = Math.min(area.height - margin * 2, span.bottom - span.top);
                frame.style.maxWidth = `${area.width - margin * 2}px`;
                frame.style.maxHeight = `${tall}px`;
                if (resize || !sized.current) {
                    sized.current = true;
                    setSize(sizeFor({ width: area.width - margin * 2, height: tall }, row, rem));
                }
                const at = floatRef.current;
                at.left = clampTo(
                    at.left,
                    area.left + margin,
                    area.left + area.width - frame.offsetWidth - margin
                );
                at.top = clampTo(
                    at.top,
                    area.top + margin,
                    area.top + area.height - frame.offsetHeight - margin
                );
                frame.style.left = `${at.left - area.left}px`;
                frame.style.top = `${at.top - area.top}px`;
                frame.style.bottom = 'auto';
                return;
            }
            frame.style.top = '';
            frame.style.bottom = '';
            const view = viewRect();
            const boardRect = boardElement
                ? boardElement.getBoundingClientRect()
                : {
                      ...view,
                      top: fromTop ? view.top : (view.top + view.bottom) / 2,
                      bottom: fromTop ? (view.top + view.bottom) / 2 : view.bottom
                  };
            const tray = boardElement ? handTrayBelow(sheet, boardRect) : null;
            const board = {
                left: boardRect.left,
                right: boardRect.right,
                top: boardRect.top,
                bottom: tray ? tray.bottom : boardRect.bottom
            };
            const seenTop = Math.max(board.top, view.top);
            const seenBottom = Math.min(board.bottom, view.bottom);
            const under = phone ? underStats(fromTop, view, fromTop ? seenTop : seenBottom) : 0;
            const top = fromTop ? seenTop - under : seenTop;
            const height = Math.max(0, seenBottom - seenTop) + under;
            frame.style[fromTop ? 'paddingTop' : 'paddingBottom'] = under ? `${under}px` : '';
            const boardWidth = board.right - board.left;
            box.style.left = `${board.left}px`;
            box.style.width = `${boardWidth}px`;
            box.style.top = `${top}px`;
            box.style.height = `${height}px`;
            box.style.clipPath = `inset(0 ${Math.max(0, board.right - view.right)}px 0 ${Math.max(0, view.left - board.left)}px)`;
            const room = {
                width: Math.max(160, Math.min(boardWidth, view.right - view.left) - margin * 2),
                height: Math.max(0, height - under - margin)
            };
            frame.style.maxWidth = `${room.width}px`;
            frame.style.maxHeight = `${room.height + under}px`;
            if (resize || !sized.current) {
                sized.current = true;
                const next = sizeFor(room, row, rem);
                setSize((current) =>
                    current &&
                    Math.abs(current.scale - next.scale) < 0.01 &&
                    current.columns === next.columns &&
                    current.plotColumns === next.plotColumns
                        ? current
                        : next
                );
            }
            const width = frame.offsetWidth;
            const seenLeft = Math.max(board.left, view.left);
            const seenRight = Math.min(board.right, view.right);
            const middle =
                seenRight > seenLeft
                    ? seenLeft + (dockRef.current ?? 0.5) * (seenRight - seenLeft)
                    : (board.left + board.right) / 2;
            const left =
                boardWidth < width + margin * 2
                    ? (boardWidth - width) / 2
                    : Math.min(
                          Math.max(middle - board.left - width / 2, margin),
                          boardWidth - margin - width
                      );
            frame.style.left = `${left}px`;
        },
        [sheet, row, fromTop, phone]
    );

    useLayoutEffect(() => {
        place();
    });
    useEffect(() => {
        let frame = null;
        let resizing = false;
        const soon = (resize) => {
            resizing ||= resize;
            frame ??= requestAnimationFrame(() => {
                frame = null;
                place(resizing);
                resizing = false;
            });
        };
        const frameObserver = new ResizeObserver(() => soon(false));
        if (frameRef.current) {
            frameObserver.observe(frameRef.current);
        }
        const boardObserver = new ResizeObserver(() => soon(true));
        const board = boardOf(sheet);
        if (board) {
            boardObserver.observe(board);
        }
        const onScroll = () => place();
        const onResize = () => soon(true);
        document.addEventListener('scroll', onScroll, { capture: true, passive: true });
        window.addEventListener('resize', onResize);
        return () => {
            frameObserver.disconnect();
            boardObserver.disconnect();
            document.removeEventListener('scroll', onScroll, { capture: true });
            window.removeEventListener('resize', onResize);
            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
        };
    }, [place, sheet]);

    // Coming off its edge or docking again, the sheet glides from where it was to where it now is
    useLayoutEffect(() => {
        const from = popFrom.current;
        const frame = frameRef.current;
        popFrom.current = null;
        if (!from || !frame || motionOff()) {
            return;
        }
        const to = frame.getBoundingClientRect();
        frame.animate(
            [
                { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` },
                { transform: 'none' }
            ],
            { duration: popTime, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
        );
    }, [floating]);

    // Desktop: pulling the handle (or the header, away from its buttons) off the edge floats the sheet; a floating
    // sheet is moved the same way, and docks when let go with its edge against the board's
    const dockSpotOf = useCallback(
        (frame) => {
            const { left, right, top, bottom } = seenSpan(sheet);
            const width = Math.min(frame.offsetWidth, right - left - margin * 2);
            const height = Math.min(frame.offsetHeight, bottom - top - margin);
            const rect = frame.getBoundingClientRect();
            // It docks below or above where it floats, as near as the board allows
            const spotLeft = clampTo(
                rect.left + rect.width / 2 - width / 2,
                left + margin,
                right - margin - width
            );
            return {
                left: spotLeft,
                top: fromTop ? top : bottom - height,
                width,
                height,
                dock: right > left ? (spotLeft + width / 2 - left) / (right - left) : 0.5,
                touching: fromTop ? rect.top <= top + 1 : rect.bottom >= bottom - 1
            };
        },
        [sheet, fromTop]
    );
    const startMove = (event) => {
        const frame = frameRef.current;
        if (phone || !frame || event.button !== 0 || event.target.closest('button')) {
            return;
        }
        event.preventDefault();
        const start = { x: event.clientX, y: event.clientY };
        const rect = frame.getBoundingClientRect();
        let over = false;
        setHeld(true);
        const move = (moved) => {
            const dx = moved.clientX - start.x;
            const dy = moved.clientY - start.y;
            if (!floatRef.current) {
                // Docked, it slides along its edge with the pointer
                const span = seenSpan(sheet);
                if (span.right > span.left) {
                    const middle = rect.left + rect.width / 2 + dx;
                    dockRef.current = clampTo(
                        (middle - span.left) / (span.right - span.left),
                        0,
                        1
                    );
                    place();
                }
                const away = Math.max(0, fromTop ? dy : -dy);
                if (away < detachAt) {
                    setTug((fromTop ? 1 : -1) * away * tugGive);
                    return;
                }
                popFrom.current = frame.getBoundingClientRect();
                floatRef.current = { left: rect.left + dx, top: rect.top + dy };
                setTug(0);
                setFloating(true);
                return;
            }
            floatRef.current = { left: rect.left + dx, top: rect.top + dy };
            place();
            const spot = dockSpotOf(frame);
            over = spot.touching ? spot : null;
            setDockSpot(over);
        };
        const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointercancel', up);
            setHeld(false);
            setTug(0);
            setDockSpot(null);
            if (floatRef.current && over) {
                popFrom.current = frame.getBoundingClientRect();
                floatRef.current = null;
                dockRef.current = over.dock;
                setFloating(false);
            }
            writePlace(seat, {
                dock: dockRef.current,
                float: floatRef.current && { ...floatRef.current }
            });
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
    };

    // The body is held to its cards' height, so a change of pile can ease from one height to the next. It only
    // scrolls once settled, so no scroll bar shows while it eases.
    const bodyRef = useRef(null);
    const contentRef = useRef(null);
    const bindContent = useCallback(
        (node) => {
            contentRef.current = node;
            setContent(node);
        },
        [setContent]
    );
    useLayoutEffect(() => {
        const body = bodyRef.current;
        const content = contentRef.current;
        if (!body || !content) {
            return;
        }
        let last = 0;
        let settle = null;
        const fit = () => {
            const next = content.offsetHeight;
            if (next === last) {
                return;
            }
            const ease = last > 0 && next > 0 && !motionOff();
            last = next;
            clearTimeout(settle);
            body.style.transition = ease ? `height ${resizeTime}ms ease-out` : 'none';
            body.style.overflowY = ease ? 'hidden' : '';
            body.style.height = `${next}px`;
            if (ease) {
                settle = setTimeout(() => {
                    body.style.overflowY = '';
                }, resizeTime);
            }
        };
        fit();
        const observer = new ResizeObserver(fit);
        observer.observe(content);
        return () => {
            observer.disconnect();
            clearTimeout(settle);
        };
    }, []);
    // ...and so does its width (except in phone landscape's single row, which is as wide as the board). The frame
    // takes its cards' width at once; it is drawn from its last width to that, and checked again once there.
    useLayoutEffect(() => {
        const frame = frameRef.current;
        const content = contentRef.current;
        if (!frame || !content || row) {
            return;
        }
        let last = null;
        let easing = null;
        const fitWidth = () => {
            if (easing) {
                return;
            }
            const next = frame.getBoundingClientRect().width;
            if (last !== null && Math.abs(next - last) > 1 && next > 0 && !motionOff()) {
                easing = frame.animate([{ width: `${last}px` }, { width: `${next}px` }], {
                    duration: resizeTime,
                    easing: 'ease-out'
                });
                easing.onfinish = easing.oncancel = () => {
                    easing = null;
                    fitWidth();
                };
            }
            last = next;
        };
        fitWidth();
        const observer = new ResizeObserver(fitWidth);
        observer.observe(content);
        return () => {
            observer.disconnect();
            easing?.cancel();
        };
    }, [row]);
    const shownId = useRef(sheet.id);
    useLayoutEffect(() => {
        if (shownId.current === sheet.id) {
            return;
        }
        shownId.current = sheet.id;
        if (!motionOff()) {
            contentRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: resizeTime,
                easing: 'ease-out'
            });
        }
    }, [sheet.id]);

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

    // Phone: a swipe towards the edge closes the sheet, once its cards are scrolled fully that way. Listened to
    // natively, so the cards' scrolling can be held while the sheet follows the finger.
    const [pull, setPull] = useState(0);
    const toEdge = (dy) => (fromTop ? -dy : dy);
    const dragging = useRef(false);
    dragging.current = !!dragSource;
    const closeRef = useRef(sheet.close);
    closeRef.current = sheet.close;
    useEffect(() => {
        const frame = frameRef.current;
        if (!phone || !frame) {
            return;
        }
        const towards = (dy) => (fromTop ? -dy : dy);
        let gesture = null;
        const end = () => {
            gesture = null;
            setPull(0);
        };
        const onStart = (event) => {
            const body = bodyRef.current;
            const touch = event.touches[0];
            const onCards = !!body?.contains(event.target);
            gesture =
                event.touches.length === 1 && (!onCards || scrolledToEdge(body, fromTop))
                    ? {
                          x: touch.clientX,
                          y: touch.clientY,
                          last: touch.clientY,
                          dy: 0,
                          held: false
                      }
                    : null;
        };
        const onMove = (event) => {
            const touch = event.touches[0];
            if (!gesture || !touch) {
                return;
            }
            if (dragging.current) {
                end();
                return;
            }
            const dx = touch.clientX - gesture.x;
            const dy = touch.clientY - gesture.y;
            if (!gesture.held) {
                if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
                    gesture = null;
                    return;
                }
                if (towards(dy) <= 0) {
                    if (Math.abs(dy) > 4) {
                        gesture = null;
                    }
                    return;
                }
                gesture.held = true;
                gesture.closing = true;
            }
            if (event.cancelable) {
                event.preventDefault();
            }
            const step = touch.clientY - gesture.last;
            if (Math.abs(step) >= 2) {
                gesture.closing = towards(step) > 0;
                gesture.last = touch.clientY;
            }
            gesture.dy = dy;
            setPull(dy);
        };
        const onEnd = () => {
            const finished = gesture;
            end();
            if (finished?.held && finished.closing && towards(finished.dy) > swipeDistance) {
                closeRef.current();
            }
        };
        frame.addEventListener('touchstart', onStart, { passive: true });
        frame.addEventListener('touchmove', onMove, { passive: false });
        frame.addEventListener('touchend', onEnd);
        frame.addEventListener('touchcancel', end);
        return () => {
            frame.removeEventListener('touchstart', onStart);
            frame.removeEventListener('touchmove', onMove);
            frame.removeEventListener('touchend', onEnd);
            frame.removeEventListener('touchcancel', end);
        };
    }, [phone, fromTop]);

    const stopDrag = (event) => event.stopPropagation();
    const playerPiles = sheet.playerName ? pilesOf(piles, sheet.playerName) : [];
    const chips = playerPiles.length > 0 && (
        <div
            ref={chipsRef}
            className='relative -mx-1.5 -my-1.5 flex min-w-0 flex-1 gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] lg:gap-1.5'
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
                            'shrink-0 rounded border px-2 text-sm leading-5 lg:px-2.5 lg:py-0.5',
                            current
                                ? 'border-gold bg-quiet text-gold'
                                : choose
                                  ? 'ring-selectable border-select bg-select/10 text-ink [--ring-scale:1]'
                                  : 'border-edge text-ink-dim'
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
    const grabber = (
        <div
            data-sheet-handle=''
            title={
                phone
                    ? undefined
                    : floating
                      ? 'Drag to move it, or to its edge to dock it'
                      : 'Drag off the edge to float it'
            }
            className={classNames(
                'hud-zoom group shrink-0 touch-none select-none',
                held ? 'cursor-grabbing' : 'cursor-grab',
                { 'py-1.5': !phone }
            )}
            onPointerDown={startMove}
        >
            {/* On a desktop the handle is taller, and wider, to take hold of with a mouse */}
            <div
                className={classNames(
                    'mx-auto my-1 rounded-full bg-ink-faint transition-colors',
                    phone ? 'h-1 w-10' : 'h-1.5 w-16 group-hover:bg-ink-dim'
                )}
            />
        </div>
    );
    const still = motionOff() || !!pull || held;
    // Drawn in the board's own layers, not over the page, so the players' stats bars lie over it
    return (
        <>
            {dockSpot && <DockHint spot={dockSpot} fromTop={fromTop} />}
            <div ref={boxRef} className='pointer-events-none fixed z-[300] overflow-hidden'>
                <div
                    ref={frameRef}
                    data-popup=''
                    data-sheet={sheet.id}
                    data-sheet-player={sheet.playerName}
                    data-sheet-floating={floating ? '' : undefined}
                    className={classNames(
                        'absolute flex w-max flex-col border-gold-line bg-panel/95',
                        floating
                            ? 'border shadow-[0_12px_40px_rgba(0,0,0,0.75)]'
                            : fromTop
                              ? 'top-0 flex-col-reverse border-x border-b shadow-[0_8px_24px_rgba(0,0,0,0.6)]'
                              : 'bottom-0 border-x border-t shadow-[0_-8px_24px_rgba(0,0,0,0.6)]',
                        { 'pointer-events-auto': open }
                    )}
                    style={
                        floating
                            ? {
                                  opacity: shown ? 1 : 0,
                                  transition: still ? 'none' : `opacity ${slideTime}ms ease-out`
                              }
                            : {
                                  translate: shown
                                      ? `0 ${pulled + tug}px`
                                      : fromTop
                                        ? '0 -100%'
                                        : '0 100%',
                                  transition: still ? 'none' : `translate ${slideTime}ms ease-out`
                              }
                    }
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
                            'hud-zoom flex min-w-0 shrink-0 touch-pan-x select-none items-center gap-1.5 px-2 lg:gap-2 lg:px-3',
                            fromTop ? 'pt-0.5 lg:pt-1' : 'pb-0.5 lg:pb-1'
                        )}
                        onPointerDown={(event) => {
                            stopDrag(event);
                            startMove(event);
                        }}
                    >
                        {sheet.playerName && <PlayerTag player={sheet.playerName} />}
                        {chips || (
                            <span className='min-w-0 flex-1 truncate font-display text-sm font-semibold text-gold'>
                                {sheet.title}
                            </span>
                        )}
                        <Button
                            isIconOnly
                            size='sm'
                            variant='ghost'
                            title='Close'
                            className='h-6 w-6 min-w-6 shrink-0 lg:h-8 lg:w-8 lg:min-w-8'
                            onPress={() => sheet.close()}
                        >
                            <FontAwesomeIcon icon={faXmark} className='text-base' />
                        </Button>
                    </div>
                    <div
                        ref={bodyRef}
                        className={classNames(
                            'min-h-0 shrink overflow-y-auto overflow-x-hidden overscroll-contain',
                            {
                                hidden: strip,
                                '[&_*]:!pointer-events-none': held
                            }
                        )}
                        style={size ? { '--card-scale': String(size.scale) } : undefined}
                    >
                        <div ref={bindContent} />
                    </div>
                </div>
            </div>
        </>
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

    // Phones: a tap anywhere but a sheet closes the open sheets, and still does what it does there. Not a drag, a
    // scroll or a hold to zoom, and not a pile (or a card's underneath badge), which opens and closes its own.
    const anyOpen = Object.keys(sheets).length > 0;
    const sheetsRef = useRef(sheets);
    sheetsRef.current = sheets;
    useEffect(() => {
        if (mode === 'wide' || !anyOpen) {
            return;
        }
        let tap = null;
        const down = (event) => {
            tap = event.target.closest?.('[data-sheet], [data-sheet-opener]')
                ? null
                : { id: event.pointerId, x: event.clientX, y: event.clientY, at: event.timeStamp };
        };
        const up = (event) => {
            const start = tap;
            tap = null;
            if (
                start?.id === event.pointerId &&
                Math.hypot(event.clientX - start.x, event.clientY - start.y) < tapSlop &&
                event.timeStamp - start.at < tapTime
            ) {
                Object.values(sheetsRef.current).forEach((sheet) => sheet.close?.());
            }
        };
        const cancel = () => {
            tap = null;
        };
        document.addEventListener('pointerdown', down, true);
        document.addEventListener('pointerup', up, true);
        document.addEventListener('pointercancel', cancel, true);
        return () => {
            document.removeEventListener('pointerdown', down, true);
            document.removeEventListener('pointerup', up, true);
            document.removeEventListener('pointercancel', cancel, true);
        };
    }, [mode, anyOpen]);

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
