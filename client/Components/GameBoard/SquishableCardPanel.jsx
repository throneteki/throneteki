import React, { useCallback } from 'react';
import { getCardDimensions } from '../../util';

import Card from './Card';
import { useMemo } from 'react';
import LabelledGameArea from './LabelledGameArea';
import classNames from 'classnames';

const SquishableCardPanel = ({
    cards,
    disableBackground = false,
    onCardClick,
    cardSize,
    source,
    maxCards,
    title,
    titlePosition,
    className,
    groupVisibleCards
}) => {
    const getOverallDimensions = useCallback(() => {
        const cardDimensions = getCardDimensions(cardSize);
        return {
            width: cardDimensions.width * maxCards,
            height: cardDimensions.height
        };
    }, [cardSize, maxCards]);

    const hasMixOfVisibleCards = useCallback(
        () => cards.some((card) => !!card.code) && cards.some((card) => !card.code),
        [cards]
    );

    const needsSquish = useMemo(() => cards && cards.length > maxCards, [cards, maxCards]);

    const cardsToRender = useMemo(() => {
        const overallDimensions = getOverallDimensions();
        const dimensions = getCardDimensions(cardSize);
        const handLength = cards ? cards.length : 0;
        const cardWidth = dimensions.width;

        const requiredWidth = handLength * cardWidth;
        const overflow = requiredWidth - overallDimensions.width;
        const offset = overflow / (handLength - 1);

        let localCards = cards;
        if (groupVisibleCards && hasMixOfVisibleCards()) {
            localCards = [...cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        return localCards.map((card, index) => {
            let style = {};
            if (needsSquish) {
                style = {
                    left: `${(cardWidth - offset) * index}rem`
                };
            }

            return (
                <Card
                    key={card.uuid}
                    card={card}
                    disableHover={!card.code}
                    onClick={onCardClick}
                    size={cardSize}
                    style={style}
                    source={source}
                />
            );
        });
    }, [
        getOverallDimensions,
        cardSize,
        cards,
        groupVisibleCards,
        hasMixOfVisibleCards,
        needsSquish,
        onCardClick,
        source
    ]);

    const dimensions = getOverallDimensions();

    const headerText = title ? title + ' (' + cardsToRender.length + ')' : '';

    const style = {
        width: dimensions.width + 'rem',
        height: dimensions.height + 'rem'
    };

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
