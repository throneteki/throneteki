import React from 'react';
import { Avatar, Button, Divider } from '@heroui/react';
import Panel from '../Site/Panel';
import DeckStatus from '../Decks/DeckStatus';
import { Constants } from '../../constants';

const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    return (
        <Panel title={'Players'}>
            <div className='flex flex-col gap-2'>
                {Object.values(currentGame.players).map((player, index) => {
                    const playerIsMe = player && player.name === user?.username;

                    let deckButton = null;
                    let status = null;

                    if (player && player.deck?.selected) {
                        if (playerIsMe) {
                            deckButton = (
                                <Button className='text-wrap' onPress={onSelectDeck}>
                                    {player.deck.name}
                                </Button>
                            );
                        } else {
                            deckButton = <Button isDisabled>Deck Selected</Button>;
                        }

                        status = (
                            <DeckStatus
                                status={player.deck.status[currentGame.restrictedList._id]}
                                gameFormat={currentGame.gameFormat}
                            />
                        );
                    } else if (player && playerIsMe) {
                        deckButton = <Button onPress={onSelectDeck}>Select Deck</Button>;
                    }
                    const userClass =
                        'username' +
                        (player.role
                            ? ` ${Constants.ColourClassByRole[player.role.toLowerCase()]}`
                            : '');
                    return (
                        <div className={'flex gap-2 flex-wrap'} key={player.name}>
                            {index > 0 && <Divider />}
                            <div className='flex items-center gap-2 w-full md:w-auto'>
                                <Avatar src={`/img/avatar/${player.name}.png`} />
                                <span className={userClass}>{player.name}</span>
                            </div>
                            <span className='flex items-center gap-1'>
                                {deckButton}
                                {status}
                            </span>
                        </div>
                    );
                })}
            </div>
        </Panel>
    );
};

export default PendingGamePlayers;
