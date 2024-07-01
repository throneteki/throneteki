import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import DeckSummary from './DeckSummary';
import DeckEditor from './DeckEditor';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import { useAddDeckMutation } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';

const AddDeck = () => {
    const dispatch = useDispatch();
    const [deck, setDeck] = useState({
        status: {},
        name: 'New Deck',
        drawCards: [],
        plotCards: []
    });
    const [error, setError] = useState(undefined);
    const [success, setSuccess] = useState(undefined);
    const [currentRestrictedList, setCurrentRestrictedList] = useState(undefined);

    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();

    const onDeckUpdated = (deck) => {
        setDeck(deck);
    };

    return (
        <div>
            <div className='col-sm-6'>
                <Panel title='Deck Editor'>
                    {error && <AlertPanel type='error' message={error} />}
                    {success && <AlertPanel type='success' message={success} />}
                    <DeckEditor
                        onDeckSave={async (deck) => {
                            try {
                                await addDeck(deck).unwrap();
                                setSuccess('Deck added successfully');

                                setTimeout(() => {
                                    setSuccess(undefined);
                                    dispatch(navigate('/decks'));
                                }, 5000);
                            } catch (err) {
                                setError(
                                    err.message ||
                                        'An error occured adding the deck. Please try again later.'
                                );
                            }
                        }}
                        onDeckUpdated={onDeckUpdated}
                        onRestrictedListChange={(restrictedList) =>
                            setCurrentRestrictedList(restrictedList)
                        }
                        deck={deck}
                        isSaveLoading={isAddLoading}
                    />
                </Panel>
            </div>
            <div className='col-sm-6'>
                <Panel title={deck ? deck.name : 'New Deck'}>
                    {currentRestrictedList && deck ? (
                        <DeckSummary currentRestrictedList={currentRestrictedList} deck={deck} />
                    ) : (
                        <div>Please wait...</div>
                    )}
                </Panel>
            </div>
        </div>
    );
};

AddDeck.displayName = 'AddDeck';

export default AddDeck;
