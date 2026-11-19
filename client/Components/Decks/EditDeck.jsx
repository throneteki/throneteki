import React, { useMemo } from 'react';

import DeckEditor from './DeckEditor';
import Frame from '../Site/Frame';
import Notice from '../Site/Notice';
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
        content = (
            <Frame title='Edit deck'>
                <LoadingSpinner label='Loading deck...' />
            </Frame>
        );
    } else if (isError) {
        content = (
            <Frame title='Edit deck'>
                <Notice kind='error'>
                    Your deck couldn&apos;t be loaded. Please try again later.
                </Notice>
            </Frame>
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

    return <Page size='wide'>{content}</Page>;
};

export default EditDeckPage;
