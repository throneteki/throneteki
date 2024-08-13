import React, { useMemo, useState } from 'react';
import { useGetCardsQuery } from '../../redux/middleware/api';
import CardImage from '../Images/CardImage';

const DeckSummary = ({ deck }) => {
    const { data: cardsResponse } = useGetCardsQuery({});
    const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
    const [zoomCard, setZoomCard] = useState(null);

    const cardsByCode = useMemo(() => {
        return cardsResponse;
    }, [cardsResponse]);

    const groupedCards = {};

    const deckCards = deck.deckCards
        .filter((dc) => dc.type !== 'Banner')
        .map((dc) => ({ card: cardsByCode[dc.card.code], count: dc.count }));

    for (const deckCard of deckCards) {
        const type = deckCard.card.type;
        if (!groupedCards[type]) {
            groupedCards[type] = [deckCard];
        } else {
            groupedCards[type].push(deckCard);
        }
    }

    const splitCards = [[], [], []];
    let cardIndex = 0;
    let currentContainer = splitCards[0];
    for (const [type, cards] of Object.entries(groupedCards)) {
        currentContainer.push(
            <div className='mb-2 mt-2' key={type}>
                <span className={`icon me-1 icon-${type}`}></span>
                <strong>
                    {type[0].toUpperCase() + type.slice(1)} ({cards.length})
                </strong>
            </div>
        );
        for (const deckCard of cards) {
            currentContainer.push(
                <React.Fragment key={deckCard.card.code}>
                    <div
                        onMouseOver={() => setZoomCard(deckCard.card.code)}
                        onMouseMove={(event) => {
                            let y = event.clientY;
                            const yPlusHeight = y + 420;

                            if (yPlusHeight >= window.innerHeight) {
                                y -= yPlusHeight - window.innerHeight;
                            }

                            setMousePosition({ x: event.clientX, y: y });
                        }}
                        onMouseOut={() => setZoomCard(null)}
                    >
                        {deckCard.count}x{' '}
                        <span
                            className={`icon me-1 icon-${type} text-${deckCard.card.faction}`}
                        ></span>
                        {deckCard.card.label}
                    </div>
                </React.Fragment>
            );
            cardIndex++;

            if (cardIndex > 30) {
                currentContainer = splitCards[2];
            } else if (cardIndex > 15) {
                currentContainer = splitCards[1];
            }
        }
    }

    return (
        <div className='mt-3 grid grid-cols-3 gap-4'>
            {zoomCard && (
                <div
                    className='decklist-card-zoom fixed left-0 top-0 z-50'
                    style={{ left: mousePos.x + 5 + 'px', top: mousePos.y + 'px' }}
                >
                    <CardImage imageUrl={`/img/cards/${zoomCard}.png`} size='lg' />
                </div>
            )}
            <div>{splitCards[0]}</div>
            <div>{splitCards[1]}</div>
            <div>{splitCards[2]}</div>
        </div>
    );
};

export default DeckSummary;
