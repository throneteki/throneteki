import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';
import { standardiseCardSize } from '../../util';
import Droppable from './Droppable';

const PlayerBoard = ({
    isDroppable,
    cardsInPlay,
    rowDirection,
    onCardClick,
    onMenuItemClick,
    cardSize,
    className
}) => {
    const getCardRows = useCallback(() => {
        let groupedCards = cardsInPlay.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);

            return group;
        }, {});

        let rows = [];
        let locations = groupedCards['location'] || [];
        let characters = groupedCards['character'] || [];
        let other = [];

        for (let key of Object.keys(groupedCards).filter(
            (k) => !['location', 'character'].includes(k)
        )) {
            other = other.concat(groupedCards[key]);
        }

        if (rowDirection === 'reverse') {
            if (other.length > 0) {
                rows.push(other);
            }

            rows.push(locations);
            rows.push(characters);
        } else {
            rows.push(characters);
            rows.push(locations);
            if (other.length > 0) {
                rows.push(other);
            }
        }

        return rows;
    }, [cardsInPlay, rowDirection]);

    const renderRow = useCallback(
        (row) => {
            const maxDupe = Math.max(...row.map((card) => card.dupes?.length || 0), 0);
            return row.map((card) => {
                const dupeOffset = maxDupe - (card.dupes?.length || 0);
                const dupeOffsets = Array.from({ length: dupeOffset }, (_, i) => (
                    <div key={i} className={`duplicate-offset-${standardiseCardSize(cardSize)}`} />
                ));
                return (
                    <div key={card.uuid} className='flex flex-col'>
                        {dupeOffsets}
                        <Card
                            card={card}
                            disableHover={card.facedown && !card.code}
                            onClick={onCardClick}
                            onMenuItemClick={onMenuItemClick}
                            size={cardSize}
                            source='play area'
                        />
                    </div>
                );
            });
        },
        [onCardClick, onMenuItemClick, cardSize]
    );

    const renderRows = useCallback(
        (rows) => {
            return rows.map((row, index) => (
                <div
                    className='flex justify-start min-h-0 gap-1.5 card-row'
                    key={`card-row-${index}`}
                >
                    {renderRow(row)}
                </div>
            ));
        },
        [renderRow]
    );

    const rows = getCardRows();

    const wrapperClassName = classNames(
        className,
        'flex flex-1 flex-col min-h-0 m-2 gap-1.5 justify-between',
        {
            'our-side': rowDirection === 'default'
        }
    );
    const content = <div className={wrapperClassName}>{renderRows(rows)}</div>;

    if (isDroppable) {
        return (
            <Droppable source='play area' className='flex flex-grow'>
                {content}
            </Droppable>
        );
    }
    return content;
};

export default PlayerBoard;
