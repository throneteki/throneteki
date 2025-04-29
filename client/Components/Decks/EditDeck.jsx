import React from 'react';

import DeckEditor from './DeckEditor';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import { useGetDeckQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';
import Page from '../../pages/Page';

const EditDeckPage = ({ deckId }) => {
    const dispatch = useDispatch();

    const { data, isLoading, isError, isSuccess } = useGetDeckQuery(deckId);

    let content;

    if (isLoading) {
        content = <LoadingSpinner label={'Loading deck...'} />;
    } else if (isError) {
        content = (
            <AlertPanel variant='danger'>
                {'An error occured loading your deck. Please try again later.'}
            </AlertPanel>
        );
    } else if (isSuccess) {
        content = <DeckEditor deck={data} onBackClick={() => dispatch(navigate('/decks'))} />;
    }

    return (
        <Page>
            <Panel title={data?.name}>{content}</Panel>
        </Page>
    );
};

export default EditDeckPage;
