import React, { useCallback } from 'react';
import { cardHeight } from '../../cardScale';

import Card from './Card';
import { useMemo } from 'react';
import LabelledGameArea from './LabelledGameArea';
import classNames from 'classnames';

const SquishableCardPanel = ({
    cards,
    disableBackground = false,
    onCardClick,
    source,
    maxCards,
    title,
    titlePosition,
    className,
    groupVisibleCards
}) => {
    const hasMixOfVisibleCards = useCallback(
        () => cards.some((card) => !!card.code) && cards.some((card) => !card.code),
        [cards]
    );

    const needsSquish = useMemo(() => cards && cards.length > maxCards, [cards, maxCards]);

    const cardsToRender = useMemo(() => {
        const handLength = cards ? cards.length : 0;
        const overlap = (handLength - maxCards) / (handLength - 1);

        let localCards = cards;
        if (groupVisibleCards && hasMixOfVisibleCards()) {
            localCards = [...cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        return localCards.map((card, index) => {
            let style = {};
            if (needsSquish) {
                style = {
                    left: `calc(var(--card-scale, 1) * 4rem * ${(1 - overlap) * index})`
                };
            }

            return (
                <Card
                    key={card.uuid}
                    card={card}
                    disableHover={!card.code}
                    onClick={onCardClick}
                    style={style}
                    source={source}
                />
            );
        });
    }, [
        cards,
        groupVisibleCards,
        hasMixOfVisibleCards,
        maxCards,
        needsSquish,
        onCardClick,
        source
    ]);

    const headerText = title ? title + ' (' + cardsToRender.length + ')' : '';

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
