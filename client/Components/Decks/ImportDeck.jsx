import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

import { Button, Spinner, Textarea } from '@nextui-org/react';
import Panel from '../Site/Panel';
import {
    useAddDeckMutation,
    useGetCardsQuery,
    useGetFactionsQuery,
    useGetPacksQuery
} from '../../redux/middleware/api';
import AlertPanel from '../Site/AlertPanel';
import { processThronesDbDeckText } from './DeckHelper';

const ImportDeck = () => {
    const [deckText, setDeckText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const {
        data: factions,
        isLoading: isFactionsLoading,
        isError: isFactionsError
    } = useGetFactionsQuery({});
    const { data: cards, isLoading: isCardsLoading, isError: isCardsError } = useGetCardsQuery({});
    const { data: packs, isLoading: isPacksLoading, isError: isPacksError } = useGetPacksQuery({});
    const [addDeck, { isLoading: isAddLoading }] = useAddDeckMutation();

    const processDeck = async () => {
        try {
            const deck = processThronesDbDeckText(factions, packs, cards, deckText);

            if (!deck) {
                setError(
                    'There was an error processing your deck. Please ensure you have pasted a ThronesDb deck plain text export.'
                );

                return;
            }

            await addDeck(deck).unwrap();
            setSuccess('Deck added successfully.');
        } catch (err) {
            setError(err.message || 'An error occured adding the deck. Please try again later.');
        }
    };

    let content;

    if (isFactionsLoading || isCardsLoading || isPacksLoading) {
        content = <Spinner text='Loading data, please wait...' />;
    } else if (isFactionsError || isCardsError || isPacksError) {
        <AlertPanel variant='danger'>
            {'An error occured loading the card data. Please try again later.'}
        </AlertPanel>;
    } else {
        content = (
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    setError('');

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
            <Panel title={'Import Deck'}>
                {error && <AlertPanel variant='danger'>{error}</AlertPanel>}
                {success && <AlertPanel variant='success'>{success}</AlertPanel>}
                {content}
            </Panel>
        </div>
    );
};

export default ImportDeck;
