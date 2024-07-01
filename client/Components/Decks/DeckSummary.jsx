import React, { useCallback, useState } from 'react';

import CardHoverPreview from './CardHoverPreview';
import CardTypeGroups from './CardTypeGroups';
import DeckSummaryHeader from './DeckSummaryHeader';
import { useGetCardsQuery } from '../../redux/middleware/api';

const DeckSummary = ({ currentRestrictedList, deck }) => {
    const [cardToShow, setCardToShow] = useState('');
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();

    const onCardMouseOver = useCallback(
        (card) => {
            let cardToDisplay = cards[card.code];
            setCardToShow(cardToDisplay);
        },
        [cards]
    );

    if (!deck || isCardsLoading || !currentRestrictedList) {
        return <div>Waiting for selected deck...</div>;
    }

    return (
        <div className='deck-summary col-xs-12'>
            {cardToShow && <CardHoverPreview card={cardToShow} />}
            <DeckSummaryHeader
                currentRestrictedList={currentRestrictedList}
                deck={deck}
                onCardMouseOut={() => setCardToShow(undefined)}
                onCardMouseOver={onCardMouseOver}
            />
            <div className='col-xs-12 no-x-padding'>
                <CardTypeGroups
                    cards={deck.plotCards.concat(deck.drawCards)}
                    onCardMouseOut={() => setCardToShow(undefined)}
                    onCardMouseOver={onCardMouseOver}
                    useSchemes={deck.agenda && deck.agenda.code === '05045'}
                />
            </div>
        </div>
    );
};

export default DeckSummary;
