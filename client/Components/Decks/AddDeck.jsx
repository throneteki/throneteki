import React, { useState } from 'react';
import DeckEditor from './DeckEditor';
import Panel from '../Site/Panel';
import AgendaSelect from './AgendaSelect';
import FactionSelect from './FactionSelect';

const AddDeck = () => {
    const [selectedFaction, setFaction] = useState();
    const [selectedAgendas, setAgendas] = useState();

    return (
        <div>
            <Panel title={'New Deck'}>
                {selectedFaction ? (
                    <div>
                        {selectedAgendas ? (
                            <DeckEditor
                                onBackClick={() => setAgendas(undefined)}
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
                        ) : (
                            <AgendaSelect
                                onBackClick={() => setFaction(undefined)}
                                onNextClick={(agendas) => setAgendas(agendas)}
                            />
                        )}
                    </div>
                ) : (
                    <FactionSelect onSelect={(faction) => setFaction(faction)} />
                )}
            </Panel>
        </div>
    );
};

AddDeck.displayName = 'AddDeck';

export default AddDeck;
