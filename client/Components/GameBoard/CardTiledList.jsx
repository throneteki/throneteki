import React, { useMemo } from 'react';

import Card from './Card';
import { cardBoxClass } from '../../cardScale';

const gapRem = 0.375;
const unit = (rem) => `calc(var(--card-scale, 1) * ${rem}rem)`;

const CardTiledList = ({
    cards,
    disableHover,
    numColumns,
    numRows,
    onCardClick,
    onMenuItemClick,
    source,
    title,
    titleCount,
    showCards,
    flip = false
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
                        orientation={card.type === 'plot' ? 'horizontal' : 'vertical'}
                        source={source}
                        flip={flip}
                    />
                );
            })
        ) : (
            <div className={cardBoxClass()}></div>
        );
    }, [cards, disableHover, onCardClick, showCards, source, flip]);

    const titleText = title && cards ? `${title} (${titleCount || cards.length})` : title;

    const { style, containerStyle } = useMemo(() => {
        const list = cards || [];
        const hasPlot = list.some((card) => card.type === 'plot');
        const hasOther = list.some((card) => card.type !== 'plot');
        // A pile keeps the width of its full column count, so an empty or small pile is not just as wide as its title
        const columns = Math.max(1, numColumns || list.length);
        const cellRem = hasPlot ? 5.6 : 4;
        const rowRem = hasOther || list.length === 0 ? 5.6 : 4;
        const natural = unit(cellRem * columns + gapRem * (columns - 1));
        return {
            containerStyle: { padding: unit(0.5) },
            style: {
                gap: unit(gapRem),
                gridTemplateColumns: `repeat(auto-fill, ${unit(cellRem)})`,
                width: `min(${natural}, calc(100vw - 2rem))`,
                minHeight: unit(rowRem),
                ...(numRows && {
                    maxHeight: unit(rowRem * numRows + gapRem * Math.ceil(numRows - 1))
                })
            }
        };
    }, [cards, numColumns, numRows]);

    return (
        <div style={containerStyle}>
            {titleText && (
                <div className='text-sm' style={{ paddingBottom: unit(0.5) }}>
                    {titleText}
                </div>
            )}
            <div className='grid' style={style}>
                {cardList}
            </div>
        </div>
    );
};

export default CardTiledList;
