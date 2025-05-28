import React, { useMemo } from 'react';

import Card from './Card';
import { cardClass, getCardDimensions } from '../../util';

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
    disableHover,
    numColumns,
    numRows,
    onCardClick,
    onMenuItemClick,
    size,
    source,
    title,
    titleCount,
    showCards
}) => {
    // Returns a card list, or a single "fake card" to ensure grid size is properly reflected
    const cardList = useMemo(() => {
        return cards && cards.length > 0 ? (
            cards.map((card) => {
                return (
                    <Card
                        card={card}
                        forceFaceup={showCards}
                        disableHover={disableHover}
                        key={card.uuid}
                        onClick={onCardClick}
                        onMenuItemClick={onMenuItemClick}
                        orientation={card.type === 'plot' ? 'horizontal' : 'vertical'}
                        size={size}
                        source={source}
                    />
                );
            })
        ) : (
            <div className={cardClass(size)}></div>
        );
    }, [cards, disableHover, onCardClick, onMenuItemClick, showCards, size, source]);

    const titleText = title && cards ? `${title} (${titleCount || cards.length})` : title;

    const style = useMemo(() => {
        if (numRows) {
            const cardDimensions = getCardDimensions(size);
            const rowHeight = cards.some((card) => card.type !== 'plot')
                ? cardDimensions.height
                : cardDimensions.width;
            return {
                maxHeight: `${rowHeight * numRows}rem`
            };
        }
        return null;
    }, [cards, numRows, size]);

    return (
        <div className='p-2'>
            {titleText && <div>{titleText}</div>}
            <div className={`gap-1.5 grid ${columnClassMap[numColumns]}`} style={style}>
                {cardList}
            </div>
        </div>
    );
};

export default CardTiledList;
