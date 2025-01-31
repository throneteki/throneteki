import React from 'react';
import { Avatar, Button } from '@heroui/react';
import Panel from '../Site/Panel';
import DeckStatus from '../Decks/DeckStatus';
import { Constants } from '../../constants';

const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    let firstPlayer = true;

    return (
        <Panel title={'Players'}>
            <div>
                {Object.values(currentGame.players).map((player) => {
                    const playerIsMe = player && player.name === user?.username;

                    let deck = null;
                    let selectLink = null;
                    let status = null;

                    if (player && player.deck?.selected) {
                        if (playerIsMe) {
                            deck = <Button onPress={onSelectDeck}>{player.deck.name}</Button>;
                        } else {
                            deck = <Button isDisabled>Deck Selected</Button>;
                        }

                        status = <DeckStatus status={player.deck.status} />;
                    } else if (player && playerIsMe) {
                        selectLink = <Button onPress={onSelectDeck}>Select Deck</Button>;
                    }
                    const userClass =
                        'username' +
                        (player.role
                            ? ` ${Constants.ColourClassByRole[player.role.toLowerCase()]}`
                            : '');
                    let rowClass = 'flex items-center gap-2 ';
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
            </div>
        </Panel>
    );
};

export default PendingGamePlayers;
