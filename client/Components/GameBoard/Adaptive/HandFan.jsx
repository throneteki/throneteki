import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import Card from '../Card';
import { InspectLabel } from '../LabelledGameArea';
import { remSize } from '../../../cardScale';

const fanTime = 0.35;
// How much of a card each card in the fan leaves showing of the one under it
const spreadShare = 0.55;

// The player's own board (their strips and play area), as far as it can be seen: the fan's backdrop covers it, and
// the fan keeps within it. Room is kept for the fan's label on the side away from the divider.
const boardArea = (side, playerName) => {
    const view = document.querySelector('[data-board-scroll]')?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight
    };
    const board = playerName
        ? document
              .querySelector(`[data-side][data-player="${CSS.escape(playerName)}"]`)
              ?.getBoundingClientRect()
        : null;
    const rect = board ?? {
        left: view.left,
        right: view.right,
        top: side === 'bottom' ? (view.top + view.bottom) / 2 : view.top,
        bottom: side === 'bottom' ? view.bottom : (view.top + view.bottom) / 2
    };
    const left = Math.max(rect.left, view.left);
    const right = Math.min(rect.right, view.right);
    const top = Math.max(rect.top, view.top);
    const bottom = Math.min(rect.bottom, view.bottom);
    const label = 2.5 * remSize();
    return {
        backdrop: { left, top, width: right - left, height: bottom - top },
        left,
        width: right - left,
        top: side === 'bottom' ? top : top + label,
        height: bottom - top - label
    };
};

// Each card's place in the fan and the card size that fits it in the area, centred near the hand (centreX).
// mirrored: held by a player across the table, so turned to face them.
const fanLayout = (count, area, centreX, mirrored) => {
    const rem = remSize();
    const step = count > 1 ? Math.min(8, 48 / (count - 1)) : 0;
    const drop = (offset) => offset * offset * step * 0.006;
    const outer = (count - 1) / 2;
    const tall = 1 + drop(outer) + Math.sin((outer * step * Math.PI) / 180) * 0.75;
    const spanCards = 1 + Math.max(0, count - 1) * spreadShare;
    const scale = Math.max(
        0.6,
        Math.min(
            2.2,
            (area.width * 0.9) / (spanCards * 4 * rem),
            (area.height * 0.85) / (tall * 5.6 * rem)
        )
    );
    const cardWidth = 4 * rem * scale;
    const cardHeight = 5.6 * rem * scale;
    const half = (spanCards * cardWidth) / 2 + cardWidth * 0.2;
    const middle = Math.min(
        Math.max(centreX ?? area.left + area.width / 2, area.left + half),
        area.left + area.width - half
    );
    const first = area.top + (area.height - tall * cardHeight) / 2;
    const places = Array.from({ length: count }, (_, index) => {
        const offset = index - outer;
        const lower = mirrored ? drop(outer) - drop(offset) : drop(offset);
        return {
            x: middle + offset * cardWidth * spreadShare - cardWidth / 2,
            y: first + lower * cardHeight,
            rotate: (mirrored ? -offset : offset) * step,
            scale: 1
        };
    });
    return {
        scale,
        cardWidth,
        places,
        middle,
        top: first,
        bottom: first + tall * cardHeight,
        backdrop: area.backdrop
    };
};

// Where a card lies in the strip, as a place for the fan to start from and go back to
const stripPlace = (strip, uuid, cardWidth, cardHeight) => {
    const element = strip?.querySelector(`[data-flip="${CSS.escape(uuid)}"]`);
    if (!element) {
        return null;
    }
    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - cardWidth / 2,
        y: rect.top + rect.height / 2 - cardHeight / 2,
        rotate: 0,
        scale: rect.width / cardWidth
    };
};

// The opponent's hand: fans out over their half when tapped, when its cards are to be chosen from, or when cards in
// it are shown to us
const HandFan = ({ cards, side = 'top', playerName, onCardClick, children }) => {
    const below = side === 'bottom';
    const stripRef = useRef(null);
    const [state, setState] = useState('closed');
    const [layout, setLayout] = useState(null);
    const selecting = cards.some((card) => card.selectable);
    const shownToUs = cards
        .filter((card) => card.code)
        .map((card) => card.uuid)
        .join(',');

    // Across the table the player holds their cards facing them, so the fan is turned their way
    const mirrored = side === 'top';
    const measure = useCallback(() => {
        const hand = stripRef.current?.getBoundingClientRect();
        return fanLayout(
            cards.length,
            boardArea(side, playerName),
            hand && hand.width > 0 ? hand.left + hand.width / 2 : null,
            mirrored
        );
    }, [cards.length, side, playerName, mirrored]);
    const open = useCallback(() => {
        setLayout(measure());
        setState('open');
    }, [measure]);
    const close = useCallback(
        () => setState((current) => (current === 'open' ? 'closing' : current)),
        []
    );

    useEffect(() => {
        if (selecting) {
            open();
        } else {
            close();
        }
    }, [selecting, open, close]);
    useEffect(() => {
        if (shownToUs) {
            open();
        }
    }, [shownToUs, open]);

    // With no cards to fly home, there is nothing to wait for
    useEffect(() => {
        if (state === 'closing' && cards.length === 0) {
            setState('closed');
        }
    }, [state, cards.length]);

    // The fan follows the hand while it is out
    useLayoutEffect(() => {
        if (state === 'open') {
            setLayout(measure());
        }
    }, [state, measure]);

    useEffect(() => {
        if (state !== 'open' || selecting) {
            return;
        }
        const away = (event) => {
            if (!event.target.closest?.('[data-fan-card]')) {
                close();
            }
        };
        document.addEventListener('pointerdown', away, true);
        window.addEventListener('resize', close);
        return () => {
            document.removeEventListener('pointerdown', away, true);
            window.removeEventListener('resize', close);
        };
    }, [state, selecting, close]);

    const out = state !== 'closed' && layout;
    const cardHeight = layout ? layout.cardWidth * 1.4 : 0;

    return (
        <>
            <div
                ref={stripRef}
                className='h-full'
                style={out ? { visibility: 'hidden' } : undefined}
                onClickCapture={(event) => {
                    if (state === 'closed' && cards.length > 0) {
                        event.stopPropagation();
                        event.preventDefault();
                        open();
                    }
                }}
            >
                {children}
            </div>
            {out &&
                createPortal(
                    <div className='pointer-events-none fixed inset-0 z-[290]'>
                        <motion.div
                            className={classNames(
                                'absolute bg-black/70',
                                state === 'open' && 'pointer-events-auto'
                            )}
                            style={layout.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: state === 'open' ? 1 : 0 }}
                            transition={{ duration: fanTime }}
                        />
                        <motion.div
                            className='absolute flex -translate-x-1/2 justify-center'
                            style={{
                                left: layout.middle,
                                top: below
                                    ? `calc(${layout.bottom}px + 0.25rem)`
                                    : `calc(${layout.top}px - 2.25rem)`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: state === 'open' ? 1 : 0 }}
                            transition={{ duration: fanTime }}
                        >
                            <div className='hud-zoom rounded-md bg-surface px-2.5 py-1 shadow-md'>
                                <InspectLabel
                                    label='Hand'
                                    name={playerName ? `${playerName}'s hand` : 'Hand'}
                                    count={cards.length}
                                />
                            </div>
                        </motion.div>
                        {cards.map((card, index) => {
                            const place = layout.places[index];
                            const home = stripPlace(
                                stripRef.current,
                                card.uuid,
                                layout.cardWidth,
                                cardHeight
                            ) ?? { ...place, scale: 0.5 };
                            const last = index === cards.length - 1;
                            return (
                                <motion.div
                                    key={card.uuid}
                                    data-fan-card=''
                                    className='pointer-events-auto absolute left-0 top-0'
                                    style={{
                                        '--card-scale': layout.scale,
                                        zIndex: index
                                    }}
                                    initial={home}
                                    animate={state === 'open' ? place : home}
                                    transition={{ duration: fanTime, ease: 'easeInOut' }}
                                    onAnimationComplete={() => {
                                        if (last && state === 'closing') {
                                            setState('closed');
                                        }
                                    }}
                                >
                                    <Card
                                        card={card}
                                        source='hand'
                                        disableHover={!card.code}
                                        onClick={card.selectable ? onCardClick : undefined}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default HandFan;
