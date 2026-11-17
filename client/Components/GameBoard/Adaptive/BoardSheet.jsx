import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { SheetContext } from '../PopupContainer';
import { useDragSource } from '../dragStore';
import { motionOff } from '../../../flip';
import { sheetStore, useRecentSheets } from './sheetStore';

const slideTime = 220;
// Dragging the handle this far moves the sheet up or down a height
const swipeDistance = 50;
const ignoreEvent = { preventDefault: () => {}, stopPropagation: () => {} };

const heightStyle = {
    strip: { maxHeight: 'none' },
    peek: { height: 'min(46dvh, 26rem)' },
    full: { height: '92dvh' }
};

// The biggest a plot can be drawn in the carousel: most of the width, and no more than about half the height
const carouselScale = () => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Math.min(
        (0.72 * window.innerWidth) / (5.6 * rem),
        (0.5 * window.innerHeight) / (4 * rem)
    );
};

// A pile's cards in a sheet along the bottom of the screen, which the board stays usable above. It opens at peek
// (one row that scrolls sideways) and can be pulled up to full (every card) or swiped down to close. Picking a card
// up out of it drops it to a strip, out of the way, and it comes back at peek once the card is put down. Plots
// being chosen are shown large, one after another, at full height.
const BoardSheet = ({ open, id, side, name, title, onCloseClick, onOpen, prompting, children }) => {
    const sheetId = `${name}:${id ?? side}`;
    const plots = name === 'plot deck';
    const startHeight = plots ? 'full' : 'peek';
    const [height, setHeight] = useState(startHeight);
    const [mounted, setMounted] = useState(open);
    const [shown, setShown] = useState(false);
    const promptText = useSelector((state) => {
        const name = state.auth.user?.username;
        return name ? state.lobby.currentGame?.players?.[name]?.menuTitle : undefined;
    });
    const recent = useRecentSheets();

    const closeRef = useRef(onCloseClick);
    const openRef = useRef(onOpen);
    closeRef.current = onCloseClick;
    openRef.current = onOpen;
    const close = useCallback(() => closeRef.current?.(ignoreEvent), []);

    if (open && !mounted) {
        setMounted(true);
    }

    useEffect(() => {
        if (!open) {
            return;
        }
        setHeight(startHeight);
        sheetStore.opened({
            id: sheetId,
            title,
            close: () => closeRef.current?.(ignoreEvent),
            open: () => openRef.current?.()
        });
        return () => sheetStore.closed(sheetId);
    }, [open, sheetId, title, startHeight]);

    useEffect(() => () => sheetStore.forget(sheetId), [sheetId]);

    // Slides up once it is on the page, and slides away before it leaves
    useLayoutEffect(() => {
        if (open) {
            const frame = requestAnimationFrame(() => setShown(true));
            return () => cancelAnimationFrame(frame);
        }
        setShown(false);
        if (!mounted) {
            return;
        }
        const timer = setTimeout(() => setMounted(false), motionOff() ? 0 : slideTime);
        return () => clearTimeout(timer);
    }, [open, mounted]);

    // A card picked up from the sheet is carried over the board, so the sheet gets out of its way
    const pressedInside = useRef(false);
    const dragSource = useDragSource();
    useEffect(() => {
        if (dragSource && pressedInside.current) {
            setHeight('strip');
        } else if (!dragSource && pressedInside.current) {
            pressedInside.current = false;
            setHeight((current) => (current === 'strip' ? 'peek' : current));
        }
    }, [dragSource]);

    // Pulling the handle: up for more, down for less, and down from peek closes it. A tap switches peek and full.
    const swipe = useRef(null);
    const [pull, setPull] = useState(0);
    const onHandleDown = (event) => {
        swipe.current = { y: event.clientY, moved: false };
        event.currentTarget.setPointerCapture?.(event.pointerId);
    };
    const onHandleMove = (event) => {
        if (!swipe.current) {
            return;
        }
        const dy = event.clientY - swipe.current.y;
        swipe.current.moved ||= Math.abs(dy) > 6;
        setPull(Math.max(dy, -40));
    };
    const onHandleUp = (event) => {
        const start = swipe.current;
        swipe.current = null;
        setPull(0);
        if (!start) {
            return;
        }
        const dy = event.clientY - start.y;
        if (!start.moved) {
            setHeight((current) => (current === 'full' ? 'peek' : 'full'));
        } else if (dy > swipeDistance) {
            if (height === 'full' && !plots) {
                setHeight('peek');
            } else {
                close();
            }
        } else if (dy < -swipeDistance) {
            setHeight('full');
        }
    };

    const layout = useMemo(() => ({ height, carousel: plots }), [height, plots]);
    const contentScale = plots ? carouselScale() : null;

    if (!mounted) {
        return null;
    }

    const tabs = recent.filter((entry) => entry.id !== sheetId);
    return createPortal(
        <div
            data-popup=''
            data-sheet={sheetId}
            className='hud-zoom fixed inset-x-0 bottom-0 z-[310] flex flex-col rounded-t-xl border-t border-default-200 bg-black/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.6)]'
            style={{
                ...(plots ? { maxHeight: '92dvh' } : heightStyle[height]),
                translate: shown ? `0 ${Math.max(pull, 0)}px` : '0 100%',
                transition: motionOff()
                    ? 'none'
                    : `translate ${pull ? 0 : slideTime}ms ease-out, height ${slideTime}ms ease-out`
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
            <div
                className='shrink-0 cursor-grab touch-none select-none px-3 pb-1 pt-1.5'
                onPointerDown={onHandleDown}
                onPointerMove={onHandleMove}
                onPointerUp={onHandleUp}
                onPointerCancel={onHandleUp}
            >
                <div className='mx-auto mb-1 h-1.5 w-10 rounded-full bg-default-400' />
                <div className='flex items-center gap-2'>
                    <span className='truncate text-sm font-bold'>{title}</span>
                    <div className='flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]'>
                        {tabs.map((entry) => (
                            <button
                                key={entry.id}
                                type='button'
                                data-no-drag
                                className='shrink-0 rounded-full border border-default-300 px-2 text-tiny text-default-400'
                                onPointerDown={(event) => event.stopPropagation()}
                                onClick={() => entry.open()}
                            >
                                {entry.title}
                            </button>
                        ))}
                    </div>
                    <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        title='Close'
                        onPointerDown={(event) => event.stopPropagation()}
                        onPress={close}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>
                {prompting && promptText && (
                    <div className='text-sm font-semibold text-warning'>{promptText}</div>
                )}
            </div>
            <div
                className={classNames('min-h-0 flex-1 overflow-auto px-2 pb-2', {
                    hidden: height === 'strip'
                })}
                style={{
                    '--card-scale': contentScale ? String(contentScale) : 'var(--hand-scale, 1)'
                }}
            >
                <SheetContext.Provider value={layout}>{children}</SheetContext.Provider>
            </div>
        </div>,
        document.querySelector('[data-overlay-container="true"]') || document.body
    );
};

export default BoardSheet;
