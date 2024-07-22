import React from 'react';
import DeckRow from './DeckRow';

const DeckList = ({
    activeDeck,
    className,
    currentRestrictedList,
    decks,
    onSelectDeck,
    events
}) => {
    return (
        <div className={className}>
            {!decks || decks.length === 0
                ? 'You have no decks, try adding one'
                : decks.map((deck, index) => (
                      <DeckRow
                          currentRestrictedList={currentRestrictedList}
                          active={activeDeck && activeDeck._id === deck._id}
                          deck={deck}
                          key={index}
                          onSelect={onSelectDeck}
                          events={events}
                      />
                  ))}
        </div>
    );
};

export default DeckList;
