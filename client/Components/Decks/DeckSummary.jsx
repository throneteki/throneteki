import React, { useMemo } from 'react';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { sortBy } from 'underscore';
import CardHoverable from '../Images/CardHoverable';
import classNames from 'classnames';
import ThronesIcon from '../GameBoard/ThronesIcon';

const DeckSummary = ({ className, deck }) => {
    const { data: cardsResponse } = useGetCardsQuery({});

    const cardsByCode = useMemo(() => {
        return cardsResponse;
    }, [cardsResponse]);

    const deckCards = deck.deckCards
        .filter((dc) => dc.type !== 'Banner')
        .map((dc) => ({ card: cardsByCode[dc.card.code], count: dc.count }));

    const poolCards = deck.poolCards
        ?.map((pc) => {
            const dc = deck.deckCards.find((dc) => dc.card.code === pc.code);
            const deckCount = dc ? dc.count : 0;
            const poolCount = pc.deckLimit - deckCount;
            return { card: pc, count: poolCount };
        })
        .filter((pc) => pc.count > 0);

    const groupCards = (cards) => {
        const groupedCards = {
            agenda: [],
            plot: [],
            character: [],
            attachment: [],
            location: [],
            event: []
        };
        for (const card of cards) {
            const type = card.card.type;
            if (groupedCards[type]) {
                groupedCards[type].push(card);
            }
        }
        return groupedCards;
    };

    const groupedDeckCards = groupCards(deckCards);
    const groupedPoolCards = poolCards ? groupCards(poolCards) : null;

    const getContainers = (groupedCards) => {
        return Object.entries(groupedCards).map(([type, cards]) => {
            const header = (
                <h4 className='mb-1 flex items-baseline gap-1.5 font-display text-sm font-semibold text-gold'>
                    <ThronesIcon icon={type} />
                    {type[0].toUpperCase() + type.slice(1)}
                    <span className='font-sans font-normal tabular-nums text-ink-faint'>
                        {cards.reduce((acc, card) => acc + card.count, 0)}
                    </span>
                </h4>
            );

            const sortedCards = sortBy(cards, (card) => card.card.name).map((card, index) => (
                <CardHoverable key={index} code={card.card.code} type={card.card.type}>
                    <div className='flex flex-row items-baseline gap-1.5 text-sm'>
                        <span className='w-4 shrink-0 text-right tabular-nums text-ink-dim'>
                            {card.count}
                        </span>
                        <ThronesIcon icon={type} color={card.card.faction} />
                        <span>{card.card.label}</span>
                    </div>
                </CardHoverable>
            ));

            return (
                <div key={type} className='break-inside-avoid pb-4'>
                    {header}
                    <div className='flex flex-col items-start'>{sortedCards}</div>
                </div>
            );
        });
    };

    const deckContainers = getContainers(groupedDeckCards);
    const poolContainers = groupedPoolCards ? getContainers(groupedPoolCards) : null;

    const containerClass = classNames(
        className,
        'columns-1 sm:columns-2 md:columns-3 xl:columns-2 gap-6'
    );
    return (
        <div>
            <div className={containerClass}>{deckContainers}</div>
            {poolContainers && (
                <>
                    <h3 className='mb-3 mt-2 border-t border-gold-hair pt-4 font-display text-lg font-semibold text-gold'>
                        Draft pool
                    </h3>
                    <div className={containerClass}>{poolContainers}</div>
                </>
            )}
        </div>
    );
};

export default DeckSummary;
