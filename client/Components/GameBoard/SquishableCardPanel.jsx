import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';

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
    const getCardSizeMultiplier = useCallback(() => {
        switch (cardSize) {
            case 'small':
                return 0.8;
            case 'large':
                return 1.4;
            case 'x-large':
                return 2;
            default:
                return 1;
        }
    }, [cardSize]);

    const getCardDimensions = useCallback(() => {
        let multiplier = getCardSizeMultiplier();
        return {
            width: 65 * multiplier,
            height: 91 * multiplier
        };
    }, [getCardSizeMultiplier]);

    const getOverallDimensions = useCallback(() => {
        let cardDimensions = getCardDimensions();
        return {
            width: (cardDimensions.width + 5) * maxCards,
            height: cardDimensions.height
        };
    }, [getCardDimensions, maxCards]);

    const hasMixOfVisibleCards = useCallback(() => {
        return cards.some((card) => !!card.code) && cards.some((card) => !card.code);
    }, [cards]);

    const getCards = useCallback(
        (needsSquish) => {
            let overallDimensions = getOverallDimensions();
            let dimensions = getCardDimensions();

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
        },
        [
            getOverallDimensions,
            getCardDimensions,
            cards,
            groupVisibleCards,
            hasMixOfVisibleCards,
            onCardClick,
            onMouseOver,
            onMouseOut,
            cardSize,
            source
        ]
    );

    let dimensions = getOverallDimensions();
    let needsSquish = cards && cards.length > maxCards;
    let cardsComponent = getCards(needsSquish);

    let classNameValue = classNames('squishable-card-panel', className, {
        [cardSize]: cardSize !== 'normal',
        squish: needsSquish
    });

    let style = {
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
    };

    return (
        <div className={classNameValue} style={style}>
            {title && <div className='panel-header'>{`${title} (${cardsComponent.length})`}</div>}
            {cardsComponent}
        </div>
    );
};

export default SquishableCardPanel;
