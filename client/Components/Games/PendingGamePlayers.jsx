import React from 'react';
import { Avatar, Button } from '@nextui-org/react';
import Panel from '../Site/Panel';
import DeckStatus from '../Decks/DeckStatus';

const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    let firstPlayer = true;

    return (
        <Panel title={'Players'}>
            {Object.values(currentGame.players).map((player) => {
                const playerIsMe = player && player.name === user?.username;

                let deck = null;
                let selectLink = null;
                let status = null;

                if (player && player.deck?.selected) {
                    if (playerIsMe) {
                        deck = (
                            <Button className='ml-2 mr-2' onClick={onSelectDeck}>
                                {player.deck.name}
                            </Button>
                        );
                    } else {
                        deck = <span className='deck-selection mr-2'>Deck Selected</span>;
                    }

                    status = <DeckStatus status={player.deck.status} />;
                } else if (player && playerIsMe) {
                    selectLink = (
                        <Button className='ml-2' onClick={onSelectDeck}>
                            Select Deck
                        </Button>
                    );
                }
                const userClass =
                    'ml-2 username' + (player.role ? ` ${player.role.toLowerCase()}-role` : '');
                let rowClass = 'flex items-center ';
                if (firstPlayer) {
                    rowClass += 'mb-2';

                    firstPlayer = false;
                }
                return (
                    <div className={rowClass} key={player.name}>
                        <Avatar src={`/img/avatar/${player.name}.png`} />
                        <span className={userClass}>{player.name}</span>
                        {deck} {status} {selectLink}
                    </div>
                );
            })}
        </Panel>
    );
};

export default PendingGamePlayers;
