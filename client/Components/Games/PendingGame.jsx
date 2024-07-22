import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactClipboard from 'react-clipboardjs-copy';
import $ from 'jquery';

import Panel from '../Site/Panel';
import Messages from '../GameBoard/Messages';
import Avatar from '../Site/Avatar';
import SelectDeckModal from './SelectDeckModal';
import DeckStatus from '../Decks/DeckStatus';
import { cardSetLabel } from '../Decks/DeckHelper';
import { createGameTitle } from './GameHelper';
import { useDispatch, useSelector } from 'react-redux';
import { useGetDecksQuery, useGetEventsQuery } from '../../redux/middleware/api';
import {
    sendChatMessage,
    sendLeaveGameMessage,
    sendSelectDeckMessage,
    sendStartGameMessage
} from '../../redux/reducers/lobby';
import { navigate } from '../../redux/reducers/navigation';

const PendingGame = () => {
    const dispatch = useDispatch();
    const [playerCount, setPlayerCount] = useState(1);
    const [message, setMessage] = useState('');
    const [waiting, setWaiting] = useState(false);

    const { connecting, host } = useSelector((state) => state.game);
    const { currentGame, gameError } = useSelector((state) => state.lobby);
    const user = useSelector((state) => state.auth.user);

    const notification = useRef(null);
    const messageRef = useRef(null);

    const { data: events, isLoading: isEventsLoading, error: eventsError } = useGetEventsQuery();
    const { data: decks, isLoading: isDecksLoading, error: decksError } = useGetDecksQuery();

    const onSelectDeckClick = useCallback(() => {
        $('#decks-modal').modal('show');
    }, []);

    const isGameReady = useCallback(() => {
        if (!user) {
            return false;
        }

        if (currentGame.tableType !== 'drafting-table') {
            if (
                !Object.values(currentGame.players).every((player) => {
                    return !!player.deck.selected;
                })
            ) {
                return false;
            }

            return currentGame.owner === user.username;
        }

        return true;
    }, [currentGame.owner, currentGame.players, currentGame.tableType, user]);

    const getPlayerStatus = useCallback(
        (player, username) => {
            if (currentGame.tableType === 'drafting-table') {
                return (
                    <div className='player-row' key={player.name}>
                        <Avatar username={player.name} />
                        <span>{player.name}</span>
                    </div>
                );
            }

            let playerIsMe = player && player.name === username;

            let deck = null;
            let selectLink = null;
            let status = null;

            if (player && player.deck && player.deck.selected) {
                if (playerIsMe) {
                    deck = (
                        <span className='deck-selection clickable' onClick={onSelectDeckClick}>
                            {player.deck.name}
                        </span>
                    );
                } else {
                    deck = <span className='deck-selection'>Deck Selected</span>;
                }

                status = <DeckStatus status={player.deck.status} />;
            } else if (player && playerIsMe) {
                selectLink = (
                    <span className='card-link' onClick={onSelectDeckClick}>
                        Select deck...
                    </span>
                );
            }

            return (
                <div className='player-row' key={player.name}>
                    <Avatar username={player.name} />
                    <span>{player.name}</span>
                    {deck} {status} {selectLink}
                </div>
            );
        },
        [currentGame.tableType, onSelectDeckClick]
    );

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

    const selectDeck = useCallback(
        (deck) => {
            $('#decks-modal').modal('hide');

            dispatch(sendSelectDeckMessage(currentGame.id, deck._id));
        },
        [currentGame.id, dispatch]
    );

    const onStartClick = useCallback(
        (event) => {
            event.preventDefault();

            setWaiting(true);
            dispatch(sendStartGameMessage(currentGame.id));
        },
        [currentGame.id, dispatch]
    );

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
            console.info(event);
            if (event.key === 'Enter') {
                sendMessage();

                event.preventDefault();
            }
        },
        [sendMessage]
    );

    const onChange = useCallback((event) => {
        setMessage(event.target.value);
    }, []);

    const isCurrentEventALockedDeckEvent = useCallback(() => {
        return currentGame.event && currentGame.event._id !== 'none' && currentGame.event.lockDecks;
    }, [currentGame.event]);

    const filterDecksForCurrentEvent = useCallback(() => {
        if (isCurrentEventALockedDeckEvent()) {
            let filteredDecks = decks.filter((d) => d.eventId === currentGame.event._id);
            return filteredDecks;
        }

        return decks;
    }, [currentGame.event._id, decks, isCurrentEventALockedDeckEvent]);

    useEffect(() => {
        if (!user) {
            return;
        }

        let players = Object.values(currentGame.players).length;

        if (
            notification.current &&
            playerCount === 1 &&
            players === 2 &&
            currentGame.owner === user.username
        ) {
            let promise = notification.current.play();

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

            setPlayerCount(players);
        }
    }, [user, playerCount, currentGame, connecting, gameError]);

    useEffect(() => {
        $(messageRef.current).scrollTop(999999);
    }, [currentGame]);

    if (currentGame && currentGame.started) {
        return <div>Loading game in progress, please wait...</div>;
    }

    if (!decks) {
        return <div>Loading decks, please wait...</div>;
    }

    if (!user) {
        dispatch(navigate('/'));

        return <div>You must be logged in to play, redirecting...</div>;
    }

    let allowStandaloneDecks = true;
    let filterDecks;

    if (currentGame.event.format === 'draft') {
        allowStandaloneDecks = false;
        filterDecks = (deck) => deck.eventId === currentGame.event._id;
    }

    return (
        <div>
            <audio ref={notification}>
                <source src='/sound/charge.mp3' type='audio/mpeg' />
                <source src='/sound/charge.ogg' type='audio/ogg' />
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
                <div className='btn-group'>
                    <button
                        className='btn btn-primary'
                        disabled={!isGameReady() || connecting || waiting}
                        onClick={onStartClick}
                    >
                        Start
                    </button>
                    <button className='btn btn-primary' onClick={onLeaveClick}>
                        Leave
                    </button>
                </div>
                <div className='pull-right'>
                    <ReactClipboard
                        text={`${window.location.protocol}//${window.location.host}/play?gameId=${currentGame.id}`}
                    >
                        <button className='btn btn-primary'>Copy Game Link</button>
                    </ReactClipboard>
                </div>
                <div className='game-status'>{getGameStatus()}</div>
            </Panel>
            <Panel title='Players'>
                {Object.values(currentGame.players).map((player) => {
                    return getPlayerStatus(player, user.username);
                })}
            </Panel>
            <Panel title={`Spectators(${currentGame.spectators.length})`}>
                {currentGame.spectators.map((spectator) => {
                    return <div key={spectator.name}>{spectator.name}</div>;
                })}
            </Panel>
            <Panel title='Chat'>
                <div className='message-list' ref={messageRef}>
                    <Messages messages={currentGame.messages} />
                </div>
                <form className='form form-hozitontal'>
                    <div className='form-group'>
                        <input
                            className='form-control'
                            type='text'
                            placeholder='Enter a message...'
                            value={message}
                            onKeyPress={onKeyPress}
                            onChange={onChange}
                        />
                    </div>
                </form>
            </Panel>
            <SelectDeckModal
                currentRestrictedList={currentGame.restrictedList}
                allowStandaloneDecks={allowStandaloneDecks}
                decks={isCurrentEventALockedDeckEvent() ? filterDecksForCurrentEvent() : decks}
                events={events}
                filterDecks={filterDecks}
                id='decks-modal'
                onDeckSelected={selectDeck}
            />
        </div>
    );
};

PendingGame.displayName = 'PendingGame';

export default PendingGame;
