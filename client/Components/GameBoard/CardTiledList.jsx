import React, { useMemo } from 'react';

import Card from './Card';

// This is super manual and explicit so that tailwindcss realises we are using these css classes and doesn't filter them out
// Change this list at your peril
const columnClassMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7'
};

const CardTiledList = ({
    cards,
    disableMouseOver,
    numColumns,
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
            <div className={`card-list-cards gap-1.5 grid ${columnClassMap[numColumns]}`}>
                {cardList}
            </div>
        </div>
    );
};

export default CardTiledList;
