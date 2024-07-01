import React, { useCallback } from 'react';

import ConfirmedButton from '../Form/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';
import { useGetCardsQuery } from '../../redux/middleware/api';

const ViewDeck = ({ currentRestrictedList, deck, onEditDeck, onDeleteDeck, isDeleteLoading }) => {
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();

    const handleEditClick = useCallback(
        (event) => {
            event.preventDefault();
            onEditDeck(deck);
        },
        [deck, onEditDeck]
    );

    const handleDeleteClick = useCallback(
        (event) => {
            event.preventDefault();
            onDeleteDeck(deck);
        },
        [deck, onDeleteDeck]
    );

    if (isCardsLoading) {
        return <div>Loading decks from the server...</div>;
    }

    return (
        <div className='col-sm-7'>
            <Panel title={deck.name || 'Unnamed Deck'}>
                <div className='btn-group col-xs-12'>
                    <button
                        className='btn btn-primary'
                        onClick={handleEditClick}
                        disabled={deck.lockedForEditing}
                    >
                        Edit
                    </button>
                    <ConfirmedButton onClick={handleDeleteClick} disabled={deck.lockedForDeletion}>
                        Delete {isDeleteLoading && <span className='spinner button-spinner' />}
                    </ConfirmedButton>
                </div>
                <DeckSummary
                    currentRestrictedList={currentRestrictedList}
                    deck={deck}
                    cards={cards}
                />
            </Panel>
        </div>
    );
};

export default ViewDeck;
