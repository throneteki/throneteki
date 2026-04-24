import React, { useMemo } from 'react';

import DeckEditor from './DeckEditor';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';
import { useGetCardsQuery, useGetDeckQuery, useGetPacksQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';
import Page from '../../pages/Page';

const EditDeckPage = ({ deckId }) => {
    const dispatch = useDispatch();

    const {
        data: deck,
        isLoading: isLoadingDeck,
        isError: isErrorDeck
    } = useGetDeckQuery({
        deckId
    });
    const { data: cards, isLoading: isLoadingCards, isErrorCards } = useGetCardsQuery({});
    const { data: packs, isLoading: isLoadingPacks, isErrorPacks } = useGetPacksQuery();

    const isLoading = useMemo(
        () => isLoadingDeck || isLoadingCards || isLoadingPacks,
        [isLoadingCards, isLoadingDeck, isLoadingPacks]
    );
    const isError = useMemo(
        () => isErrorDeck || isErrorCards || isErrorPacks,
        [isErrorCards, isErrorDeck, isErrorPacks]
    );
    let content;

    if (isLoading) {
        content = <LoadingSpinner label={'Loading deck...'} />;
    } else if (isError) {
        content = (
            <AlertPanel variant='danger'>
                An error occured loading your deck. Please try again later.
            </AlertPanel>
        );
    } else {
        content = (
            <DeckEditor
                deck={deck}
                cards={cards}
                packs={packs}
                onBackClick={() => dispatch(navigate('/decks'))}
            />
        );
    }

    return (
        <Page>
            <Panel title={deck?.name}>{content}</Panel>
        </Page>
    );
};

export default EditDeckPage;
