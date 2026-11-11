import React, { useCallback } from 'react';
import { cardHeight } from '../../cardScale';

import Card from './Card';
import { useMemo } from 'react';
import LabelledGameArea from './LabelledGameArea';
import classNames from 'classnames';
import { useMotionEnabled } from '../../motion';
import { useStagedArrivals } from './useStagedArrivals';
import { useHiddenDragUuid, useIncomingSlot } from './dragStore';

const SquishableCardPanel = ({
    cards: allCards,
    disableBackground = false,
    onCardClick,
    source,
    maxCards,
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

    const slotCount = cards.length + (incoming ? 1 : 0);
    const needsSquish = slotCount > maxCards;

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
            } else if (needsSquish) {
                style = {
                    left: `calc(var(--card-scale, 1) * 4rem * ${(1 - overlap) * shown})`
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
                    onClick={onCardClick}
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
        onCardClick,
        source,
        flipFrom
    ]);

    const headerText = title ? title + ' (' + cards.length + ')' : '';

    const style = useMemo(
        () => ({
            width: `calc(var(--card-scale, 1) * ${4 * maxCards}rem)`,
            height: cardHeight
        }),
        [maxCards]
    );

    const retClassName = classNames('box-border relative', className);

    return (
        <LabelledGameArea
            label={headerText}
            position={titlePosition}
            className={retClassName}
            style={style}
            disableBackground={disableBackground}
        >
            {cardsToRender}
        </LabelledGameArea>
    );
};

export default SquishableCardPanel;
