import React from 'react';
import CardLink from './CardLink';
import { groupCards } from './CardingGrouping';

const CardTypeGroup = ({
    cards,
    displayFactionIcons,
    groupBy = 'type',
    onCardClick,
    onCardMouseOut,
    onCardMouseOver,
    sortCardsBy = 'name',
    useSchemes
}) => {
    const renderCardItem = (cardQuantity, index) => (
        <div key={`${cardQuantity.card.code}${index++}`}>
            {displayFactionIcons && (
                <span
                    className={`deck-list-icon thronesicon thronesicon-${cardQuantity.card.faction} with-background`}
                />
            )}
            <span>{cardQuantity.count + 'x '}</span>
            <CardLink
                card={cardQuantity.card}
                onClick={onCardClick}
                onMouseOut={onCardMouseOut}
                onMouseOver={onCardMouseOver}
            />
        </div>
    );

    let cardsToRender = [];
    let groupedCards = groupCards({ cards, groupBy, sortCardsBy, useSchemes });

    for (const { cards, group, title } of groupedCards) {
        let renderedCards = [];
        let count = 0;
        let index = 0;

        for (const card of cards) {
            renderedCards.push(renderCardItem(card, index++));
            count += parseInt(card.count);
        }

        if (cards.length === 0) {
            continue;
        }

        cardsToRender.push(
            <div className='cards-no-break' key={group}>
                <div className='card-group-title'>{title + ' (' + count.toString() + ')'}</div>
                <div key={group} className='card-group'>
                    {renderedCards}
                </div>
            </div>
        );
    }

    let cardsClassName = displayFactionIcons ? 'cards-two-columns' : 'cards';

    return <div className={cardsClassName}>{cardsToRender}</div>;
};

export default CardTypeGroup;
