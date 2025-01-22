import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { Button, Textarea } from "@heroui/react";
import Panel from '../Site/Panel';
import {
    useAddDeckMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery
} from '../../redux/middleware/api';
import AlertPanel from '../Site/AlertPanel';
import { processThronesDbDeckText } from './DeckHelper';
import LoadingSpinner from '../Site/LoadingSpinner';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const ImportDeck = () => {
    const [deckText, setDeckText] = useState('');

    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const { data: cards, isLoading: isCardsLoading, isError: isCardsError } = useGetCardsQuery({});
    const { data: packs, isLoading: isPacksLoading, isError: isPacksError } = useGetPacksQuery({});
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();
    const dispatch = useDispatch();

    const processDeck = async () => {
        try {
            const deck = processThronesDbDeckText(factions, packs, cards, deckText);

            if (!deck) {
                toast.error(
                    'There was an error processing your deck. Please ensure you have pasted a ThronesDb deck plain text export'
                );

                return;
            }

            await addDeck(deck).unwrap();
            toast.success('Deck added successfully.');

            dispatch(navigate('/decks'));
        } catch (err) {
            toast.error(err.message || 'An error occured adding the deck. Please try again later');
        }
    };

    let content;

    if (isFactionsLoading || isCardsLoading || isPacksLoading) {
        content = <LoadingSpinner label='Loading data...' />;
    } else if (isFactionsError || isCardsError || isPacksError) {
        <AlertPanel variant='danger'>
            An error occured loading the card data. Please try again later
        </AlertPanel>;
    } else {
        content = (
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    processDeck();
                }}
            >
                <div className='mb-3'>
                    <label>
                        Export your deck as plain text from{' '}
                        <a href='https://thronesdb.com' target='_blank' rel='noreferrer'>
                            ThronesDB
                        </a>{' '}
                        and paste it into this box
                    </label>
                    <Textarea minRows={20} value={deckText} onValueChange={setDeckText} />
                </div>

                <Button type='submit' color='primary' isDisabled={!deckText || isAddLoading}>
                    Submit &nbsp;
                    {isAddLoading && <FontAwesomeIcon icon={faCircleNotch} spin />}
                </Button>
            </form>
        );
    }

    return (
        <div className='container'>
            <Panel title={'Import Deck'}>{content}</Panel>
        </div>
    );
};

export default ImportDeck;
