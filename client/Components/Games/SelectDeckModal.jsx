import React, { useMemo } from 'react';

import DeckList from '../Decks/DeckList';
import Modal from '../Site/Modal';
import { useGetStandaloneDecksQuery } from '../../redux/middleware/api';

const SelectDeckModal = ({
    id,
    currentRestrictedList,
    decks,
    allowStandaloneDecks = true,
    filterDecks = () => true,
    onDeckSelected,
    events
}) => {
    const { data: standaloneDecks, isLoading: isDecksLoading } = useGetStandaloneDecksQuery('', {
        skip: !allowStandaloneDecks
    });

    const deckList = useMemo(() => {
        const filteredDecks = decks.filter(filterDecks);

        return (
            <div>
                <DeckList
                    currentRestrictedList={currentRestrictedList}
                    className='deck-list-popup'
                    decks={filteredDecks}
                    onSelectDeck={onDeckSelected}
                    events={events}
                />
                {allowStandaloneDecks && standaloneDecks && standaloneDecks.length !== 0 && (
                    <div>
                        <h3 className='deck-list-header'>Or choose a standalone deck:</h3>
                        <DeckList
                            currentRestrictedList={currentRestrictedList}
                            className='deck-list-popup'
                            decks={standaloneDecks}
                            onSelectDeck={onDeckSelected}
                            events={events}
                        />
                    </div>
                )}
            </div>
        );
    }, [
        decks,
        filterDecks,
        currentRestrictedList,
        onDeckSelected,
        events,
        allowStandaloneDecks,
        standaloneDecks
    ]);

    return (
        <Modal id={id} className='deck-popup' title='Select Deck'>
            {isDecksLoading ? <div>Loading decks...</div> : deckList}
        </Modal>
    );
};

export default SelectDeckModal;
