import React, { useCallback } from 'react';
import classNames from 'classnames';

import Card from './Card';

const PlayerBoard = ({
    cardsInPlay,
    rowDirection,
    onCardClick,
    onMenuItemClick,
    onMouseOut,
    onMouseOver,
    user
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
            return row.map((card) => (
                <Card
                    key={card.uuid}
                    card={card}
                    disableMouseOver={card.facedown && !card.code}
                    onClick={onCardClick}
                    onMenuItemClick={onMenuItemClick}
                    onMouseOut={onMouseOut}
                    onMouseOver={onMouseOver}
                    size={user.settings.cardSize}
                    source='play area'
                />
            ));
        },
        [onCardClick, onMenuItemClick, onMouseOut, onMouseOver, user]
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

    let rows = getCardRows();

    let className = classNames('flex flex-1 flex-col min-h-0 m-2 gap-1.5 justify-between', {
        'our-side': rowDirection === 'default'
    });

    return <div className={className}>{renderRows(rows)}</div>;
};

export default PlayerBoard;
