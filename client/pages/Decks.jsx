import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Link from '../Components/Site/Link';
import DeckList from '../Components/Decks/DeckList';
import RestrictedListDropdown from '../Components/Decks/RestrictedListDropdown';
import ViewDeck from '../Components/Decks/ViewDeck';
import {
    useDeleteDeckMutation,
    useGetDecksQuery,
    useGetEventsQuery,
    useGetRestrictedListQuery
} from '../redux/middleware/api';
import { navigate } from '../redux/reducers/navigation';

const Decks = () => {
    const dispatch = useDispatch();

    const {
        data: restrictedLists,
        isLoading: isRestrictedListLoading,
        error: restrictedListError
    } = useGetRestrictedListQuery();
    const { data: events, isLoading: isEventsLoading, error: eventsError } = useGetEventsQuery();
    const {
        data: decks,
        isLoading: isDecksLoading,
        error: decksError
    } = useGetDecksQuery('', {
        skip: !restrictedLists || !events
    });
    const [deleteDeck, { isLoading: isDeleteLoading }] = useDeleteDeckMutation();

    const [currentRestrictedList, setCurrentRestrictedList] = useState(
        restrictedLists && restrictedLists[0]
    );
    const [selectedDeck, setSelectedDeck] = useState();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();

    const handleEditDeck = useCallback(
        (deck) => {
            dispatch(navigate(`/decks/edit/${deck._id}`));
        },
        [dispatch]
    );

    const handleDeleteDeck = useCallback(
        async (deck) => {
            try {
                await deleteDeck(deck._id).unwrap();
                setSuccess('Deck deleted successfully');

                setTimeout(() => {
                    setSuccess(undefined);
                }, 5000);

                setSelectedDeck(undefined);
            } catch (err) {
                setError(
                    err.message || 'An error occured deleting the deck. Please try again later.'
                );
            }
        },
        [deleteDeck]
    );

    useEffect(() => {
        if (decksError) {
            setError();
        } else if (restrictedListError) {
            setError(
                restrictedListError.data?.message || 'An error occured loading the restricted lists'
            );
        } else if (eventsError) {
            setError(eventsError.data?.message || 'An error occured loading the events');
        }
    }, [decksError, eventsError, restrictedListError]);

    let content = null;

    if (decksError) {
        return (
            <AlertPanel
                type='error'
                message={decksError.data?.message || 'An error occured loading the decks'}
            />
        );
    }

    if (
        isDecksLoading ||
        isRestrictedListLoading ||
        isEventsLoading ||
        !decks ||
        !restrictedLists
    ) {
        content = <div>Loading decks from the server...</div>;
    } else {
        content = (
            <div className='full-height'>
                <div className='col-sm-5 full-height'>
                    <Panel title='Your decks'>
                        {error && <AlertPanel type='error' message={error} />}
                        {success && <AlertPanel type='success' message={success} />}
                        <div className='form-group'>
                            <Link className='btn btn-primary' href='/decks/add'>
                                New Deck
                            </Link>
                        </div>
                        <div>
                            <RestrictedListDropdown
                                currentRestrictedList={currentRestrictedList}
                                restrictedLists={restrictedLists}
                                setCurrentRestrictedList={(list) => setCurrentRestrictedList(list)}
                            />
                        </div>
                        <DeckList
                            currentRestrictedList={currentRestrictedList}
                            className='deck-list'
                            activeDeck={selectedDeck}
                            decks={decks}
                            onSelectDeck={(deck) => setSelectedDeck(deck)}
                            events={events}
                        />
                    </Panel>
                </div>
                {!!selectedDeck && (
                    <ViewDeck
                        currentRestrictedList={currentRestrictedList}
                        deck={selectedDeck}
                        onEditDeck={handleEditDeck}
                        onDeleteDeck={handleDeleteDeck}
                        isDeleteLoading={isDeleteLoading}
                    />
                )}
            </div>
        );
    }

    return content;
};

export default Decks;
