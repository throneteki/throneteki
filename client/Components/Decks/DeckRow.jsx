import React, { useCallback } from 'react';
import moment from 'moment';
import DeckStatusLabel from './DeckStatusLabel';

const DeckRow = ({ active, currentRestrictedList, deck, events, onSelect }) => {
    const displayNameForDeck = useCallback(
        (deck) => {
            if (deck.eventId) {
                let deckEvent = events.find((e) => e._id === deck.eventId);
                if (deckEvent) {
                    return `(${deckEvent.name}) ${deck.name}`;
                }
            }
            return deck.name;
        },
        [events]
    );

    if (!currentRestrictedList) {
        return <div>Loading...</div>;
    }

    return (
        <div
            className={active ? 'deck-row active' : 'deck-row'}
            key={deck.name}
            onClick={() => onSelect && onSelect(deck)}
        >
            <div className='col-xs-1 deck-image'>
                <img className='card-small' src={'/img/cards/' + deck.faction.value + '.png'} />
            </div>
            {deck.agenda && (
                <div className='col-xs-1 deck-image'>
                    <img className='card-small' src={'/img/cards/' + deck.agenda.code + '.png'} />
                </div>
            )}
            <span className='col-xs-9 col-md-9 col-lg-10 deck-name'>
                <span>{displayNameForDeck(deck)}</span>
                <DeckStatusLabel
                    className='pull-right text-shadow'
                    status={deck.status[currentRestrictedList._id]}
                />
            </span>
            <div className='row small'>
                <span className='col-xs-6 col-md-6 deck-factionagenda'>
                    {deck.faction.name}
                    {deck.agenda && deck.agenda.label ? <span>/{deck.agenda.label}</span> : null}
                </span>
                <span className='col-xs-4 col-md-3 deck-date text-right pull-right'>
                    {moment(deck.lastUpdated).format('Do MMM YYYY')}
                </span>
            </div>
        </div>
    );
};

export default DeckRow;
