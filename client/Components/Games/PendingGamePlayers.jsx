import React, { useMemo } from 'react';
import { Avatar, Button, Divider } from '@heroui/react';
import Panel from '../Site/Panel';
import DeckStatus from '../Decks/DeckStatus';
import { Constants } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';

const PendingGamePlayers = ({ currentGame, user, onSelectDeck }) => {
    const isDeckLocked = useMemo(() => {
        const currentPlayer = Object.values(currentGame.players).find(
            (player) => player && player.name === user?.username
        );
        return currentGame.event?.lockDecks && currentPlayer.deck && currentPlayer.deck.locked;
    }, [currentGame.event?.lockDecks, currentGame.players, user?.username]);

    return (
        <Panel title={'Players'}>
            <div className='flex flex-col gap-2'>
                {Object.values(currentGame.players).map((player, index) => {
                    const playerIsMe = player && player.name === user?.username;

                    let deckButton = null;
                    let status = null;

                    if (player && player.deck?.selected) {
                        const startContent = currentGame.event?.lockDecks ? (
                            <FontAwesomeIcon icon={isDeckLocked ? faLock : faUnlock} />
                        ) : null;
                        if (playerIsMe) {
                            deckButton = (
                                <Button
                                    className='text-wrap'
                                    onPress={onSelectDeck}
                                    isDisabled={isDeckLocked}
                                    startContent={startContent}
                                >
                                    {player.deck.name}
                                </Button>
                            );
                        } else {
                            deckButton = <Button isDisabled>Deck Selected</Button>;
                        }

                        status = <DeckStatus showDeckDetails={playerIsMe} deck={player.deck} />;
                    } else if (player && playerIsMe) {
                        deckButton = (
                            <Button onPress={onSelectDeck} isDisabled={isDeckLocked}>
                                Select Deck
                            </Button>
                        );
                    }
                    const userClass =
                        'username' +
                        (player.role
                            ? ` ${Constants.ColorClassByRole[player.role.toLowerCase()]}`
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
