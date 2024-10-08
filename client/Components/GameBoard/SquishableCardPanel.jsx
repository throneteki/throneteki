import React, { useCallback } from 'react';
import classNames from 'classnames';
import { getCardDimensions } from '../../util';

import Card from './Card';
import { useMemo } from 'react';

const SquishableCardPanel = ({
    cards,
    onCardClick,
    onMouseOver,
    onMouseOut,
    cardSize,
    source,
    maxCards,
    title,
    className,
    groupVisibleCards
}) => {
    const getOverallDimensions = useCallback(() => {
        let cardDimensions = getCardDimensions(cardSize);

        return {
            width: (cardDimensions.width + 5) * maxCards,
            height: cardDimensions.height
        };
    }, [cardSize, maxCards]);

    const hasMixOfVisibleCards = useCallback(() => {
        return cards.some((card) => !!card.code) && cards.some((card) => !card.code);
    }, [cards]);

    const needsSquish = useMemo(() => cards && cards.length > maxCards, [cards, maxCards]);

    const cardsToRender = useMemo(() => {
        let overallDimensions = getOverallDimensions();
        let dimensions = getCardDimensions(cardSize);
        let cardIndex = 0;
        let handLength = cards ? cards.length : 0;
        let cardWidth = dimensions.width;

        let requiredWidth = handLength * cardWidth;
        let overflow = requiredWidth - overallDimensions.width;
        let offset = overflow / (handLength - 1);

        let localCards = cards;
        if (groupVisibleCards && hasMixOfVisibleCards()) {
            localCards = [...cards].sort((a, b) => (a.facedown && !b.facedown ? -1 : 1));
        }

        return localCards.map((card) => {
            let left = (cardWidth - offset) * cardIndex++;

            let style = {};
            if (needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (
                <Card
                    key={card.uuid}
                    card={card}
                    disableMouseOver={!card.code}
                    onClick={onCardClick}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
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
        onMouseOver,
        onMouseOut,
        source
    ]);

    let dimensions = getOverallDimensions();

    let classNameValue = classNames(
        'flex justify-start mx-1 mt-1 p-0 relative m-1 border-1 border-default-100 bg-opacity-65',
        className,
        {
            [cardSize]: cardSize !== 'normal',
            absolute: needsSquish
        }
    );

    let style = {
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
    };

    return (
        <div className={classNameValue} style={style}>
            {title && (
                <div className='absolute top-0 left-0 p-1 text-xs bg-black bg-opacity-60 rounded-md z-20'>{`${title} (${cardsToRender.length})`}</div>
            )}
            {cardsToRender}
        </div>
    );
};

export default SquishableCardPanel;
