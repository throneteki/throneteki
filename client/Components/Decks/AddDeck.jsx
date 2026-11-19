import React, { useMemo, useState } from 'react';
import DeckEditor from './DeckEditor';
import AgendaSelectStep from './AgendaSelectStep';
import FactionSelectStep from './FactionSelectStep';
import { useGetCardsQuery, useGetPacksQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';
import Frame from '../Site/Frame';
import Page from '../../pages/Page';

const AddDeck = () => {
    const [selectedFaction, setFaction] = useState();
    const [selectedAgendas, setAgendas] = useState();
    const { data: cards, isLoading: isLoadingCards } = useGetCardsQuery({});
    const { data: packs, isLoading: isLoadingPacks } = useGetPacksQuery();

    const isLoading = useMemo(
        () => isLoadingCards || isLoadingPacks,
        [isLoadingCards, isLoadingPacks]
    );

    let content;
    if (!selectedFaction) {
        content = <FactionSelectStep onSelect={(faction) => setFaction(faction)} />;
    } else if (!selectedAgendas) {
        content = (
            <AgendaSelectStep
                onBackClick={() => setFaction(undefined)}
                onNextClick={(agendas) => setAgendas(agendas)}
            />
        );
    } else if (isLoading) {
        content = (
            <Frame title='New deck'>
                <LoadingSpinner />
            </Frame>
        );
    } else {
        content = (
            <DeckEditor
                onBackClick={() => setAgendas(undefined)}
                cards={cards}
                packs={packs}
                deck={{
                    name: 'New Deck',
                    faction: selectedFaction,
                    agenda: selectedAgendas[0],
                    drawCards:
                        selectedAgendas.length > 1
                            ? selectedAgendas.slice(1).map((c) => ({ card: c, count: 1 }))
                            : []
                }}
            />
        );
    }

    return <Page size={selectedAgendas ? 'wide' : 'normal'}>{content}</Page>;
};

AddDeck.displayName = 'AddDeck';

export default AddDeck;
