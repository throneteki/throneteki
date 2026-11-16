import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { useRenderCount } from '../../perf';
import Card from './Card';
import Droppable from './Droppable';
import FittedRow from './FittedRow';
import { cardHeight } from '../../cardScale';
import { useHiddenDragUuid, useIncomingType } from './dragStore';
import { cardBoxClass } from '../../cardScale';
import { rowTypeOf } from './leftBehind';

const boardStyle = { minHeight: cardHeight };

const holdsCards = (card) => card.attachments?.length > 0 || card.dupes?.length > 0;

const PlayerBoard = ({
    isDroppable,
    cardsInPlay,
    pendingAttachment,
    leftBehind = [],
    rowDirection,
    onCardClick,
    className,
    overflow = 'grow'
}) => {
    useRenderCount('PlayerBoard');
    const draggedUuid = useHiddenDragUuid();
    const incomingType = useIncomingType(isDroppable ? 'play area' : null);
    // Attachments that are not attached yet wait at the end of the characters
    const incomingRow =
        incomingType === 'attachment'
            ? 'character'
            : ['location', 'character'].includes(incomingType)
              ? incomingType
              : 'other';
    const places = useRef(new Map());
    const getCardRows = useCallback(() => {
        let groupedCards = cardsInPlay.reduce((group, card) => {
            (group[card.type] = group[card.type] || []).push(card);

            return group;
        }, {});

        let rows = [];
        let locations = Object.assign([...(groupedCards['location'] || [])], {
            rowType: 'location'
        });
        let characters = Object.assign([...(groupedCards['character'] || [])], {
            rowType: 'character'
        });
        let other = Object.assign([], { rowType: 'other' });

        characters.push(...(groupedCards['attachment'] || []));

        for (let key of Object.keys(groupedCards).filter(
            (k) => !['location', 'character', 'attachment'].includes(k)
        )) {
            other.push(...groupedCards[key]);
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

        // A card that left play keeps its place until what it holds has left too
        for (const card of leftBehind) {
            const place = places.current.get(card.uuid);
            const type = place?.rowType ?? rowTypeOf(card);
            const row = rows.find((candidate) => candidate.rowType === type);
            if (row && !cardsInPlay.some((inPlay) => inPlay.uuid === card.uuid)) {
                const held = place
                    ? { ...card, facedown: place.facedown, kneeled: place.kneeled }
                    : card;
                row.splice(Math.min(place?.index ?? row.length, row.length), 0, held);
            }
        }

        return rows;
    }, [cardsInPlay, leftBehind, rowDirection]);

    const shells = useMemo(() => new Set(leftBehind.map((card) => card.uuid)), [leftBehind]);
    const renderRow = useCallback(
        (row) => {
            const maxDupe = Math.max(...row.map((card) => card.dupes?.length || 0), 0);
            const slot =
                incomingType && row.rowType === incomingRow ? (
                    <div key='incoming' className={cardBoxClass()} />
                ) : null;
            const cards = row.map((card) => {
                const dupeOffset = maxDupe - (card.dupes?.length || 0);
                const dupeOffsets = Array.from({ length: dupeOffset }, (_, i) => (
                    <div key={i} className='card-duplicate-offset' />
                ));
                return (
                    <div
                        key={card.uuid}
                        className={classNames('flex flex-col', {
                            hidden: card.uuid === draggedUuid && !holdsCards(card)
                        })}
                    >
                        {dupeOffsets}
                        <Card
                            card={card}
                            disableHover={card.facedown && !card.code}
                            onClick={onCardClick}
                            onMenuItemClick={onMenuItemClick}
                            source='play area'
                            flip
                            shell={shells.has(card.uuid)}
                        />
                    </div>
                );
            });
            const waiting =
                pendingAttachment && row.rowType === 'character' ? (
                    <div key={pendingAttachment.uuid} className='flex flex-col'>
                        <Card card={pendingAttachment} source='play area' flip dragDisabled />
                    </div>
                ) : null;
            return [...cards, ...(waiting ? [waiting] : []), ...(slot ? [slot] : [])];
        },
        [onCardClick, draggedUuid, incomingType, incomingRow, pendingAttachment, shells]
    );

    const renderRows = useCallback(
        (rows) => {
            const fitted = ['squish', 'squish-then-scroll'].includes(overflow);
            const Row = fitted ? FittedRow : 'div';
            const rowProps = fitted ? { scroll: overflow === 'squish-then-scroll' } : {};
            return rows.map((row, index) => (
                <Row
                    {...rowProps}
                    className='flex justify-start min-h-0 gap-1.5 card-row'
                    key={`card-row-${index}`}
                >
                    {renderRow(row)}
                </Row>
            ));
        },
        [renderRow, overflow]
    );

    const rows = getCardRows();

    useLayoutEffect(() => {
        const next = new Map();
        rows.forEach((row) =>
            row.forEach((card, index) => {
                next.set(
                    card.uuid,
                    shells.has(card.uuid)
                        ? places.current.get(card.uuid) || { rowType: row.rowType, index }
                        : {
                              rowType: row.rowType,
                              index,
                              facedown: card.facedown,
                              kneeled: card.kneeled
                          }
                );
            })
        );
        places.current = next;
    });

    const wrapperClassName = classNames(
        className,
        'flex flex-1 flex-col m-2 gap-1.5 justify-between',
        {
            'our-side': rowDirection === 'default',
            'min-w-0': overflow !== 'grow'
        }
    );
    const content = (
        <div className={wrapperClassName} style={boardStyle}>
            {renderRows(rows)}
        </div>
    );

    if (isDroppable) {
        return (
            <Droppable
                source='play area'
                className={classNames('flex flex-grow', { 'min-w-0': overflow !== 'grow' })}
                underCards
            >
                {content}
            </Droppable>
        );
    }
    return content;
};

export default PlayerBoard;
