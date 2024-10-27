import React, { useCallback } from 'react';
import classNames from 'classnames';
import { getCardDimensions } from '../../util';

import Card from './Card';
import { useMemo } from 'react';
import LabelledGameArea from './LabelledGameArea';

const SquishableCardPanel = ({
    cards,
    onCardClick,
    onMouseOver,
    onMouseOut,
    cardSize,
    source,
    maxCards,
    title,
    titlePosition,
    className,
    groupVisibleCards
}) => {
    const getOverallDimensions = useCallback(() => {
        let cardDimensions = getCardDimensions(cardSize);

        return {
            width: cardDimensions.width * maxCards,
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

    let headerText = title ? title + ' (' + cardsToRender.length + ')' : '';

    let classNameValue = classNames(
        'flex justify-start box-border border-default-100 bg-black/35 rounded-md',
        className,
        {
            [cardSize]: cardSize !== 'normal'
        }
    );

    let style = {
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
    };

    return (
        <div className={classNameValue} style={style}>
            <LabelledGameArea label={headerText} position={titlePosition} className='w-full h-full'>
                <div className='inner-border absolute border-2 border-default-100/50 w-full h-full rounded-md' />
                {cardsToRender}
            </LabelledGameArea>
        </div>
    );
};

export default SquishableCardPanel;
