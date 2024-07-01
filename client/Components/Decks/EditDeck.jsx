import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import DraftDeckEditor from './DraftDeckEditor';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import { useGetDeckQuery, useSaveDeckMutation } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';

const EditDeck = ({ deckId }) => {
    const dispatch = useDispatch();
    const [currentRestrictedList, setCurrentRestrictedList] = useState(undefined);
    const [deck, setDeck] = useState(undefined);
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);

    const { data, isLoading, error: deckError } = useGetDeckQuery(deckId);
    const [saveDeck, { isLoading: isSaveLoading }] = useSaveDeckMutation();

    const onEditDeck = useCallback(
        async (deck) => {
            try {
                await saveDeck(deck).unwrap();
                setSuccess('Deck saved successfully');

                setTimeout(() => {
                    setSuccess(undefined);
                    dispatch(navigate('/decks'));
                }, 5000);
            } catch (err) {
                setError(
                    err.message || 'An error occured saving the deck. Please try again later.'
                );
            }
        },
        [dispatch, saveDeck]
    );

    const onDeckUpdated = useCallback((deck) => {
        setDeck(deck);
    }, []);

    useEffect(() => {
        if (data) {
            setDeck(data);
        }
    }, [data]);

    useEffect(() => {
        if (deckError) {
            setError(deckError.data.message);
        }
    }, [deckError]);

    let content;

    if (isLoading || !data) {
        content = <div>Loading deck from the server...</div>;
    } else if (!deck) {
        content = <AlertPanel message='The specified deck was not found' type='error' />;
    } else if (deck.format === 'draft') {
        content = (
            <Panel title='Deck Editor'>
                <DraftDeckEditor
                    deck={deck}
                    onDeckSave={onEditDeck}
                    onDeckUpdated={onDeckUpdated}
                />
            </Panel>
        );
    } else {
        content = (
            <div>
                <div className='col-sm-6'>
                    <Panel title='Deck Editor'>
                        {error && <AlertPanel type='error' message={error} />}
                        {success && <AlertPanel type='success' message={success} />}
                        <DeckEditor
                            onDeckSave={onEditDeck}
                            isSaveLoading={isSaveLoading}
                            deck={deck}
                            onDeckUpdated={onDeckUpdated}
                            onRestrictedListChange={(restrictedList) =>
                                setCurrentRestrictedList(restrictedList)
                            }
                        />
                    </Panel>
                </div>
                <div className='col-sm-6'>
                    <Panel title={deck.name}>
                        <DeckSummary deck={deck} currentRestrictedList={currentRestrictedList} />
                    </Panel>
                </div>
            </div>
        );
    }

    return content;
};

export default EditDeck;
