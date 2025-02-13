import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import ChargeMp3 from '../../assets/sound/charge.mp3';
import ChargeOgg from '../../assets/sound/charge.ogg';
import { Button, Input, Link, Snippet } from '@heroui/react';
import GameTypeInfo from './GameTypeInfo';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import PendingGamePlayers from './PendingGamePlayers';
import LoadingSpinner from '../Site/LoadingSpinner';

const PendingGame = () => {
    const dispatch = useDispatch();
    const [playerCount, setPlayerCount] = useState(1);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [canScroll, setCanScroll] = useState(true);

    const { connecting, host } = useSelector((state) => state.game);
    const { currentGame, gameError } = useSelector((state) => state.lobby);
    const user = useSelector((state) => state.auth.user);

    const notificationRef = useRef(null);
    const messageRef = useRef(null);

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

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        dispatch(sendChatMessage(message));

        setMessage('');
    }, [dispatch, message]);

    useEffect(() => {
        if (!user) {
            return;
        }

        let players = Object.values(currentGame.players).length;

        if (
            notificationRef.current &&
            playerCount === 1 &&
            players === 2 &&
            currentGame.owner === user.username
        ) {
            let promise = notificationRef.current.play();

            if (promise !== undefined) {
                promise.catch(() => {}).then(() => {});
            }

            if (window.Notification && Notification.permission === 'granted') {
                let otherPlayer = Object.values(currentGame.players).find(
                    (p) => p.name !== user.username
                );

                let windowNotification = new Notification('The Iron Throne', {
                    body: `${otherPlayer.name} has joined your game`,
                    icon: `/img/avatar/${otherPlayer.username}.png`
                });

                setTimeout(() => windowNotification.close(), 5000);
            }

            if (connecting || gameError) {
                setWaiting(false);
            }

            if (canScroll && messageRef.current) {
                messageRef.current.scrollTop = 999999;
            }

            setPlayerCount(players);
        }
    }, [user, playerCount, currentGame, connecting, gameError, canScroll]);

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

    return (
        <div className='flex flex-col gap-2'>
            <audio ref={notificationRef}>
                <source src={ChargeMp3} type='audio/mpeg' />
                <source src={ChargeOgg} type='audio/ogg' />
            </audio>
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
            <Panel title={`Spectators (${currentGame.spectators.length})`}>
                {currentGame.spectators.map((spectator) => {
                    return <div key={spectator.name}>{spectator.name}</div>;
                })}
            </Panel>
            <Panel title={'Chat'}>
                <div
                    className='h-48 w-full border-1 border-primary-500 rounded-lg overflow-auto py-1 px-2'
                    ref={messageRef}
                    onScroll={() => {
                        setTimeout(() => {
                            if (
                                messageRef.current &&
                                messageRef.current.scrollTop >=
                                    messageRef.current.scrollHeight -
                                        messageRef.current.offsetHeight -
                                        20
                            ) {
                                setCanScroll(true);
                            } else {
                                setCanScroll(false);
                            }
                        }, 500);
                    }}
                >
                    <Messages messages={currentGame.messages} />
                </div>
                <div className='mt-2'>
                    <form>
                        <Input
                            type='text'
                            placeholder={'Enter a message...'}
                            value={message}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    sendMessage();
                                    event.preventDefault();
                                }
                            }}
                            onValueChange={setMessage}
                        ></Input>
                    </form>
                </div>
            </Panel>
            {showModal && (
                <SelectDeckModal
                    onClose={() => setShowModal(false)}
                    onDeckSelected={(deck) => {
                        setShowModal(false);
                        dispatch(sendSelectDeckMessage(deck._id));
                    }}
                    restrictedList={currentGame.restrictedList?._id}
                />
            )}
        </div>
    );
};

PendingGame.displayName = 'PendingGame';

export default PendingGame;
