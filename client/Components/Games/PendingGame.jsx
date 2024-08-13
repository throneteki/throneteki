import React, { useCallback, useEffect, useRef, useState } from 'react';
import $ from 'jquery';

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
import { Button, Input, Link, Snippet } from '@nextui-org/react';
import GameTypeInfo from './GameTypeInfo';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import PendingGamePlayers from './PendingGamePlayers';

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

    const onLeaveClick = useCallback(
        (event) => {
            event.preventDefault();

            dispatch(sendLeaveGameMessage(currentGame.id));
        },
        [currentGame.id, dispatch]
    );

    const sendMessage = useCallback(() => {
        if (message === '') {
            return;
        }

        dispatch(sendChatMessage(message));

        setMessage('');
    }, [dispatch, message]);

    const onKeyPress = useCallback(
        (event) => {
            if (event.key === 'Enter') {
                sendMessage();

                event.preventDefault();
            }
        },
        [sendMessage]
    );

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
        return <div>Loading game in progress, please wait...</div>;
    }

    if (!user) {
        dispatch(navigate('/'));

        return <div>You must be logged in to play, redirecting...</div>;
    }

    return (
        <>
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
                        <strong>Cards:</strong> {cardSetLabel(currentGame.restrictedList.cardSet)}
                    </p>
                )}
                <div className='flex content-between'>
                    <div>
                        <Button
                            className='me-2'
                            color='success'
                            disabled={!canStartGame()}
                            onClick={() => {
                                setWaiting(true);
                                dispatch(sendStartGameMessage());
                            }}
                        >
                            Start
                        </Button>
                        <Button
                            color='primary'
                            onClick={() => {
                                dispatch(sendLeaveGameMessage());
                            }}
                        >
                            Leave
                        </Button>
                    </div>
                    <Snippet
                        className='ml-2'
                        classNames={{ base: 'py-1' }}
                        codeString={`${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`}
                        hideSymbol
                    >
                        <Link href={`/play?gameId=${currentGame.id}`} isExternal>
                            Game Link
                        </Link>
                    </Snippet>
                </div>
                <div className='mt-3'>
                    <GameTypeInfo gameType={currentGame.gameType} />
                </div>
                <div className='mt-4'>
                    {gameError ? (
                        <AlertPanel variant={AlertType.Danger}>{getGameStatus()}</AlertPanel>
                    ) : (
                        getGameStatus()
                    )}
                </div>
            </Panel>
            <div className='mt-2'>
                <PendingGamePlayers
                    currentGame={currentGame}
                    user={user}
                    onSelectDeck={() => setShowModal(true)}
                />
            </div>
            <Panel className='mt-2' title={`Spectators(${currentGame.spectators.length})`}>
                {currentGame.spectators.map((spectator) => {
                    return <div key={spectator.name}>{spectator.name}</div>;
                })}
            </Panel>
            <Panel className='mt-2' title={'Chat'}>
                <div
                    className='message-list'
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
                <form>
                    <Input
                        type='text'
                        placeholder={'Enter a message...'}
                        value={message}
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                sendMessage();
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => setMessage(event.target.value)}
                    ></Input>
                </form>
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
        </>
    );
};

PendingGame.displayName = 'PendingGame';

export default PendingGame;
