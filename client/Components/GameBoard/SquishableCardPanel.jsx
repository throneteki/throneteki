import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motionOff } from '../../flip';
import { cardHeight } from '../../cardScale';
import { pressedByTouch } from '../../lastPointer';

import Card from './Card';
import { useMemo } from 'react';
import LabelledGameArea from './LabelledGameArea';
import classNames from 'classnames';
import { useMotionEnabled } from '../../motion';
import { useStagedArrivals } from './useStagedArrivals';
import { useHiddenDragUuid, useIncomingSlot } from './dragStore';
import { boardRescaleEvent } from './useHudScale';

const raiseTime = 150;

// Above the cards it overlaps, and lifted a little so the whole of it shows
const raisedStyle = {
    zIndex: 220,
    translate: '0 calc(var(--card-scale, 1) * -0.75rem)',
    transition: `translate ${raiseTime}ms ease-out`
};

// A card being lowered stays above its neighbours until it is back in place
const loweringStyle = { zIndex: 220, transition: `translate ${raiseTime}ms ease-out` };

// Fitted to its width, the panel holds as many cards side by side as that width takes at its card size
const useFittedCards = (areaRef, enabled) => {
    const [fitted, setFitted] = useState(null);
    useLayoutEffect(() => {
        const area = areaRef.current;
        if (!enabled || !area) {
            return;
        }
        const measure = () => {
            const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const scale = parseFloat(getComputedStyle(area).getPropertyValue('--card-scale')) || 1;
            setFitted(Math.max(1, Math.floor((area.clientWidth / (4 * rem * scale)) * 100) / 100));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(area);
        window.addEventListener(boardRescaleEvent, measure);
        return () => {
            observer.disconnect();
            window.removeEventListener(boardRescaleEvent, measure);
        };
    }, [areaRef, enabled]);
    return fitted;
};

const SquishableCardPanel = ({
    cards: allCards,
    disableBackground = false,
    onCardClick,
    source,
    maxCards: fixedMaxCards,
    fitWidth = false,
    title,
    titlePosition,
    className,
    groupVisibleCards,
    flipFrom,
    stagedArrivals = false,
    redeal = false
}) => {
    const motionEnabled = useMotionEnabled();
    const staged = useStagedArrivals(allCards, stagedArrivals && motionEnabled, redeal);
    const draggedUuid = useHiddenDragUuid();
    const incoming = useIncomingSlot(source);
    const cards = useMemo(
        () => (draggedUuid ? staged.filter((card) => card.uuid !== draggedUuid) : staged),
        [staged, draggedUuid]
    );

    const hasMixOfVisibleCards = useCallback(
        () => cards.some((card) => !!card.code) && cards.some((card) => !card.code),
        [cards]
    );

    const areaRef = useRef(null);
    const fittedCards = useFittedCards(areaRef, fitWidth);
    // Fitted, the panel fills its width, but holds no more than maxCards side by side before overlapping them
    const maxCards = fitWidth && fittedCards ? Math.min(fittedCards, fixedMaxCards) : fixedMaxCards;

    const slotCount = cards.length + (incoming ? 1 : 0);
    const needsSquish = slotCount > maxCards;

    // On a touch screen cards here can be covered by their neighbours, so a tap raises a card and a second tap
    // uses it. Every card works that way, covered or not, so the same tap always does the same thing.
    // The card being lowered is set in the same update as the raise that replaces it, so it never loses its
    // transition for a frame and snaps back
    const [lift, setLift] = useState({ raised: null, lowering: null });
    const raisedUuid = lift.raised;
    const loweringUuid = lift.lowering;
    const raise = useCallback(
        (uuid) =>
            setLift((current) =>
                current.raised === uuid
                    ? current
                    : { raised: uuid, lowering: current.raised ?? current.lowering }
            ),
        []
    );

    useEffect(() => {
        if (!loweringUuid) {
            return;
        }
        const timer = setTimeout(
            () =>
                setLift((current) =>
                    current.lowering === loweringUuid ? { ...current, lowering: null } : current
                ),
            raiseTime
        );
        return () => clearTimeout(timer);
    }, [loweringUuid]);

    const onSquishedCardClick = useCallback(
        (card) => {
            if (pressedByTouch() && card.uuid !== raisedUuid) {
                raise(card.uuid);
                return;
            }
            raise(null);
            onCardClick?.(card);
        },
        [raisedUuid, raise, onCardClick]
    );

    useEffect(() => {
        if (!raisedUuid) {
            return;
        }
        const own = `[data-flip="${CSS.escape(raisedUuid)}"], [data-raised-card="${CSS.escape(raisedUuid)}"]`;
        const lower = (event) => {
            if (!event.target.closest?.(own)) {
                raise(null);
            }
        };
        document.addEventListener('pointerdown', lower, true);
        return () => document.removeEventListener('pointerdown', lower, true);
    }, [raisedUuid, raise]);

    // A card raised from underneath another is shown above the whole board, so neither the card it lies under nor
    // the rows, hand or player bar around it can cover it
    const floats = source === 'underneath';
    const floatingUuid = floats ? raisedUuid || loweringUuid : null;
    const floatingCard = floatingUuid && staged.find((card) => card.uuid === floatingUuid);

    const cardsToRender = useMemo(() => {
        const handLength = slotCount;
        const overlap = (handLength - maxCards) / (handLength - 1);

        // The carried card stays mounted, just out of the layout, so its touch is never lost
        let localCards = staged;
        if (groupVisibleCards && hasMixOfVisibleCards()) {
            localCards = [...staged].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        let shown = 0;
        return localCards.map((card) => {
            let style = {};
            if (card.uuid === draggedUuid) {
                style = { display: 'none' };
            } else {
                style = {
                    ...(needsSquish && {
                        left: `calc(var(--card-scale, 1) * 4rem * ${(1 - overlap) * shown})`
                    }),
                    ...(floats
                        ? card.uuid === floatingUuid && { visibility: 'hidden' }
                        : {
                              ...(card.uuid === loweringUuid && loweringStyle),
                              ...(card.uuid === raisedUuid && raisedStyle)
                          })
                };
            }
            if (card.uuid !== draggedUuid) {
                shown++;
            }

            return (
                <Card
                    key={card.uuid}
                    card={card}
                    disableHover={!card.code}
                    onClick={onSquishedCardClick}
                    forceFaceup={
                        !floats && card.uuid === raisedUuid && card.facedown && !!card.code
                    }
                    style={style}
                    source={source}
                    flip
                    flipFrom={flipFrom}
                />
            );
        });
    }, [
        staged,
        draggedUuid,
        slotCount,
        groupVisibleCards,
        hasMixOfVisibleCards,
        maxCards,
        needsSquish,
        onSquishedCardClick,
        raisedUuid,
        loweringUuid,
        floats,
        floatingUuid,
        source,
        flipFrom
    ]);

    const headerText = title ? title + ' (' + cards.length + ')' : '';

    const style = useMemo(
        () => ({
            width: fitWidth
                ? `min(100%, calc(var(--card-scale, 1) * ${4 * fixedMaxCards}rem))`
                : `calc(var(--card-scale, 1) * ${4 * maxCards}rem)`,
            height: cardHeight
        }),
        [maxCards, fitWidth, fixedMaxCards]
    );

    const retClassName = classNames('box-border relative', className);

    return (
        <LabelledGameArea
            ref={areaRef}
            label={headerText}
            count={title ? cards.length : undefined}
            position={titlePosition}
            className={retClassName}
            style={style}
            disableBackground={disableBackground}
        >
            {cardsToRender}
            {floatingCard && (
                <FloatingCard
                    key={floatingCard.uuid}
                    card={floatingCard}
                    raised={floatingCard.uuid === raisedUuid}
                    onClick={onSquishedCardClick}
                />
            )}
        </LabelledGameArea>
    );
};

// Raised from underneath, the card comes out below the card it lies under, turned face up when its owner may see it
const FloatingCard = ({ card, raised, onClick }) => {
    const ref = useRef(null);
    const [rect] = useState(() =>
        document.querySelector(`[data-flip="${CSS.escape(card.uuid)}"]`)?.getBoundingClientRect()
    );
    const [faceup, setFaceup] = useState(false);
    const drop = rect ? rect.height * 0.2 : 0;

    useLayoutEffect(() => {
        setFaceup(raised && card.facedown && !!card.code);
        const el = ref.current;
        if (!el) {
            return;
        }
        const down = { translate: `0 ${drop}px` };
        const up = { translate: '0 0' };
        if (motionOff()) {
            el.style.translate = raised ? down.translate : up.translate;
            return;
        }
        el.animate(raised ? [up, down] : [down, up], {
            duration: raiseTime,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }, [raised, card.facedown, card.code, drop]);

    if (!rect) {
        return null;
    }

    return createPortal(
        <div
            ref={ref}
            data-raised-card={card.uuid}
            className='fixed z-[350]'
            style={{ left: rect.left, top: rect.top }}
        >
            <Card
                card={card}
                disableHover={!card.code}
                onClick={onClick}
                forceFaceup={faceup}
                source='underneath'
            />
        </div>,
        document.querySelector('[data-overlay-container="true"]') || document.body
    );
};

export default SquishableCardPanel;
