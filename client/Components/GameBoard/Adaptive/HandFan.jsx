import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import Card from '../Card';
import { InspectLabel } from '../LabelledGameArea';

const fanTime = 0.35;
// How much of a card each card in the fan leaves showing of the one under it
const spreadShare = 0.55;

const remSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

// The opponent's half of the screen: at the top, below their bar (which stays above the fan) and down to the divider;
// at the bottom (a melee table's bottom row), from the divider down to the bottom of the board. Room is kept for the
// fan's label on the side away from the divider.
const halfArea = (side) => {
    const style = getComputedStyle(document.documentElement);
    const read = (name) => parseFloat(style.getPropertyValue(name));
    const label = 2.5 * remSize();
    if (side === 'bottom') {
        const top =
            read('--board-divider-bottom') > 0
                ? read('--board-divider-bottom')
                : window.innerHeight / 2;
        const end =
            read('--board-view-bottom') > 0 ? read('--board-view-bottom') : window.innerHeight;
        return { width: window.innerWidth, top, height: end - top - label };
    }
    const bottom = read('--board-divider-top');
    const top = read('--board-chat-top') || 0;
    const end = bottom > 0 ? bottom : window.innerHeight / 2;
    return { width: window.innerWidth, top: top + label, height: end - top - label };
};

// Where each card lies in the fan, and the card size that fits the whole fan into the area: the outer cards sit
// lower round the arc and lean out, so the fan is taller than a card
const fanLayout = (count, area) => {
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
    const first = area.top + (area.height - tall * cardHeight) / 2;
    const places = Array.from({ length: count }, (_, index) => {
        const offset = index - outer;
        return {
            x: area.width / 2 + offset * cardWidth * spreadShare - cardWidth / 2,
            y: first + drop(offset) * cardHeight,
            rotate: offset * step,
            scale: 1
        };
    });
    return { scale, cardWidth, places, top: first, bottom: first + tall * cardHeight };
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

// The opponent's hand. Tapped, it fans out over their half of the board (side), which darkens, to count or look at;
// a tap anywhere else puts it back. It fans out by itself when its cards are to be chosen from, and stays until the
// choosing is done, or when cards in it are shown to us.
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

    const open = useCallback(() => {
        setLayout(fanLayout(cards.length, halfArea(side)));
        setState('open');
    }, [cards.length, side]);
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
            setLayout(fanLayout(cards.length, halfArea(side)));
        }
    }, [cards.length, state, side]);

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
                                'absolute inset-x-0 bg-black/70',
                                state === 'open' && 'pointer-events-auto'
                            )}
                            style={
                                below
                                    ? {
                                          top: 'var(--board-divider-bottom, 50%)',
                                          height: 'calc(var(--board-view-bottom, 100%) - var(--board-divider-bottom, 50%))'
                                      }
                                    : { top: 0, height: 'var(--board-divider-top, 50%)' }
                            }
                            initial={{ opacity: 0 }}
                            animate={{ opacity: state === 'open' ? 1 : 0 }}
                            transition={{ duration: fanTime }}
                        />
                        <motion.div
                            className='absolute inset-x-0 flex justify-center'
                            style={{
                                top: below
                                    ? `calc(${layout.bottom}px + 0.25rem)`
                                    : `calc(${layout.top}px - 2.25rem)`
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: state === 'open' ? 1 : 0 }}
                            transition={{ duration: fanTime }}
                        >
                            <div className='hud-zoom rounded-medium bg-content1 px-2.5 py-1 shadow-medium'>
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
                                    style={{ '--card-scale': layout.scale, zIndex: index }}
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
                    document.querySelector('[data-overlay-container="true"]') || document.body
                )}
        </>
    );
};

export default HandFan;
