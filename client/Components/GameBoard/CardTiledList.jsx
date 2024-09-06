import React, { useMemo } from 'react';

import Card from './Card';

const CardTiledList = ({
    cards,
    disableMouseOver,
    onCardClick,
    onCardMouseOut,
    onCardMouseOver,
    onTouchMove,
    onMenuItemClick,
    size,
    source,
    title,
    titleCount,
    showCards
}) => {
    const cardList = useMemo(() => {
        return (
            cards &&
            cards.map((card, index) => {
                return (
                    <Card
                        card={card}
                        forceFaceup={showCards}
                        disableMouseOver={disableMouseOver}
                        key={index}
                        onClick={onCardClick}
                        onMouseOut={onCardMouseOut}
                        onMouseOver={onCardMouseOver}
                        onTouchMove={onTouchMove}
                        onMenuItemClick={onMenuItemClick}
                        orientation={card.type === 'plot' ? 'horizontal' : 'vertical'}
                        size={size}
                        source={source}
                    />
                );
            })
        );
    }, [
        cards,
        disableMouseOver,
        onCardClick,
        onCardMouseOut,
        onCardMouseOver,
        onMenuItemClick,
        onTouchMove,
        showCards,
        size,
        source
    ]);

    let titleText = title && cards ? `${title} (${titleCount || cards.length})` : title;

    return (
        <div className='card-list'>
            {titleText && <div className='card-list-title'>{titleText}</div>}
            <div className='card-list-cards flex gap-1.5 flex-wrap'>{cardList}</div>
        </div>
    );
};

export default CardTiledList;
