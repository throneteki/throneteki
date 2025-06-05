import React, { useCallback, useState } from 'react';
import Panel from '../Site/Panel';
import Messages from '../GameBoard/Messages';
import SelectDeckModal from './SelectDeckModal';
import { cardSetLabel } from '../Decks/DeckHelper';
import { createGameTitle } from './GameHelper';
import { useDispatch, useSelector } from 'react-redux';
import {
    sendChatMessage,
    sendLeaveGameMessage,
    sendSelectDeckMessage,
    sendStartGameMessage
} from '../../redux/reducers/lobby';
import { navigate } from '../../redux/reducers/navigation';

import { Button, Link, Snippet } from '@heroui/react';
import GameTypeInfo from './GameTypeInfo';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import PendingGamePlayers from './PendingGamePlayers';
import LoadingSpinner from '../Site/LoadingSpinner';
import { GameFormats } from '../../constants';
import ChatArea from '../Site/ChatArea';

const PendingGame = () => {
    const dispatch = useDispatch();
    const [waiting, setWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { connecting, host } = useSelector((state) => state.game);
    const { currentGame, gameError } = useSelector((state) => state.lobby);
    const user = useSelector((state) => state.auth.user);

    const getGameStatus = useCallback(() => {
        if (gameError) {
            return gameError;
        }

        if (connecting) {
            return 'Connecting to game server: ' + host;
        }

        if (waiting) {
            return 'Waiting for lobby server...';
        }

        if (Object.values(currentGame.players).length < 2) {
            return 'Waiting for players...';
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck.selected;
            })
        ) {
            return 'Waiting for players to select decks';
        }

        if (currentGame.owner === user.username) {
            return 'Ready to begin, click start to begin the game';
        }

        return 'Ready to begin, waiting for opponent to start the game';
    }, [
        connecting,
        currentGame.owner,
        currentGame.players,
        gameError,
        host,
        user.username,
        waiting
    ]);

    const canStartGame = () => {
        if (!user || !currentGame || currentGame.owner !== user.username || connecting) {
            return false;
        }

        if (
            !Object.values(currentGame.players).every((player) => {
                return !!player.deck?.selected;
            })
        ) {
            return false;
        }

        if (waiting && !gameError) {
            return false;
        }

        return true;
    };

    if (currentGame && currentGame.started) {
        return <LoadingSpinner label='Loading game in progress...' />;
    }

    if (!user) {
        dispatch(navigate('/'));

        return <LoadingSpinner label='You must be logged in to play, redirecting...' />;
    }
    const gameFormatLabel = GameFormats.find((gf) => gf.name === currentGame.gameFormat).label;
    return (
        <div className='flex flex-col gap-2'>
            <Panel
                title={createGameTitle(
                    currentGame.name,
                    currentGame.event.name,
                    currentGame.restrictedList.cardSet
                )}
            >
                <div className='flex flex-col gap-2'>
                    <div>
                        {currentGame.event.name && (
                            <p>
                                <strong>Event:</strong> {currentGame.event.name}
                            </p>
                        )}
                        <p>
                            <strong>Format:</strong> {gameFormatLabel}
                        </p>
                        <p>
                            <strong>Restricted List:</strong> {currentGame.restrictedList.name}
                        </p>
                        {currentGame.event.format !== 'draft' && (
                            <p>
                                <strong>Cards:</strong>{' '}
                                {cardSetLabel(currentGame.restrictedList.cardSet)}
                            </p>
                        )}
                    </div>
                    <div className='flex gap-2 flex-wrap'>
                        <div className='flex gap-1'>
                            <Button
                                color='success'
                                isDisabled={!canStartGame()}
                                onPress={() => {
                                    setWaiting(true);
                                    dispatch(sendStartGameMessage());
                                }}
                            >
                                Start
                            </Button>
                            <Button
                                color='primary'
                                onPress={() => {
                                    dispatch(sendLeaveGameMessage());
                                }}
                            >
                                Leave
                            </Button>
                        </div>
                        <Snippet
                            classNames={{ base: 'py-1' }}
                            codeString={`${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`}
                            hideSymbol
                        >
                            <Link href={`/play?gameId=${currentGame.id}`} isExternal>
                                Game Link
                            </Link>
                        </Snippet>
                    </div>
                    <div>
                        <GameTypeInfo gameType={currentGame.gameType} />
                    </div>
                    <div>
                        {gameError ? (
                            <AlertPanel variant={AlertType.Danger}>{getGameStatus()}</AlertPanel>
                        ) : (
                            getGameStatus()
                        )}
                    </div>
                </div>
            </Panel>
            <div>
                <PendingGamePlayers
                    currentGame={currentGame}
                    user={user}
                    onSelectDeck={() => setShowModal(true)}
                />
            </div>
            {currentGame.spectators.length > 0 && (
                <Panel title={`Spectators (${currentGame.spectators.length})`}>
                    {currentGame.spectators.map((spectator) => {
                        return <div key={spectator.name}>{spectator.name}</div>;
                    })}
                </Panel>
            )}
            <Panel title={'Chat'}>
                <ChatArea
                    classNames={{
                        wrapper: 'h-52 border-1 border-primary-500 rounded-lg overflow-hidden',
                        messages: 'flex flex-col gap-1.5 p-2'
                    }}
                    messageCount={currentGame.messages.length}
                    onSendMessage={(message) => dispatch(sendChatMessage(message))}
                    placeholder={'Enter a message...'}
                >
                    <Messages messages={currentGame.messages} />
                </ChatArea>
            </Panel>
            {showModal && (
                <SelectDeckModal
                    onClose={() => setShowModal(false)}
                    onDeckSelected={(deck) => {
                        setShowModal(false);
                        dispatch(sendSelectDeckMessage(deck._id));
                    }}
                    gameFormat={currentGame.gameFormat}
                    restrictedList={currentGame.restrictedList?._id}
                />
            )}
        </div>
    );
};

export default PendingGame;
