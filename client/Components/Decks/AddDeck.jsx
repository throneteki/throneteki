import React, { useMemo, useState } from 'react';
import DeckEditor from './DeckEditor';
import Panel from '../Site/Panel';
import AgendaSelectStep from './AgendaSelectStep';
import FactionSelectStep from './FactionSelectStep';
import { useGetCardsQuery, useGetPacksQuery } from '../../redux/middleware/api';
import LoadingSpinner from '../Site/LoadingSpinner';

const AddDeck = () => {
    const [selectedFaction, setFaction] = useState();
    const [selectedAgendas, setAgendas] = useState();
    const { data: cards, isLoading: isLoadingCards } = useGetCardsQuery({});
    const { data: packs, isLoading: isLoadingPacks } = useGetPacksQuery();

    const isLoading = useMemo(
        () => isLoadingCards || isLoadingPacks,
        [isLoadingCards, isLoadingPacks]
    );
    return (
        <div>
            <Panel title={'New Deck'}>
                {selectedFaction ? (
                    <div>
                        {selectedAgendas ? (
                            isLoading ? (
                                <LoadingSpinner />
                            ) : (
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
                                                ? selectedAgendas
                                                      .slice(1)
                                                      .map((c) => ({ card: c, count: 1 }))
                                                : []
                                    }}
                                />
                            )
                        ) : (
                            <AgendaSelectStep
                                onBackClick={() => setFaction(undefined)}
                                onNextClick={(agendas) => setAgendas(agendas)}
                            />
                        )}
                    </div>
                ) : (
                    <FactionSelectStep onSelect={(faction) => setFaction(faction)} />
                )}
            </Panel>
        </div>
    );
};

AddDeck.displayName = 'AddDeck';

export default AddDeck;
