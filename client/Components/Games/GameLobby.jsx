import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toastr } from 'react-redux-toastr';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';
import {
    joinPasswordGame,
    sendJoinGameMessage,
    sendWatchGameMessage,
    startNewGame
} from '../../redux/reducers/lobby';
import { setUrl } from '../../redux/reducers/navigation';

const GameState = Object.freeze({
    None: 0,
    NewGame: 1,
    PendingGame: 2,
    PasswordedGame: 3,
    Started: 4
});

const GameLobby = ({ gameId }) => {
    const dispatch = useDispatch();
    const bannerNotice = useSelector((state) => state.lobby.notice);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const games = useSelector((state) => state.lobby.games);
    const newGame = useSelector((state) => state.lobby.newGame);
    const passwordGame = useSelector((state) => state.lobby.passwordGame);
    const user = useSelector((state) => state.auth.user);

    const [gameState, setGameState] = useState(GameState.None);
    const [filter, setFilter] = useState({});
    const [quickJoin, setQuickJoin] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const setGameStateBasedOnProps = useCallback(() => {
        if (passwordGame) {
            setGameState(GameState.PasswordedGame);
        } else if (currentGame && !currentGame.started) {
            setGameState(GameState.PendingGame);
        } else if (currentGame && currentGame.started) {
            setGameState(GameState.Started);
        } else if (!currentGame && newGame && user) {
            setGameState(GameState.NewGame);
        } else {
            setGameState(GameState.None);
        }
    }, [passwordGame, currentGame, newGame, user]);

    const isPendingGameStillCurrent = useCallback(() => {
        if (newGame && !newGame) {
            return false;
        }

        if (currentGame && !currentGame) {
            return false;
        }

        return true;
    }, [newGame, currentGame]);

    const isGameInProgress = useCallback(() => {
        if (currentGame && currentGame.started && (!currentGame || !currentGame.started)) {
            return true;
        }

        return false;
    }, [currentGame]);

    const startNewGameCb = useCallback(() => {
        if (!user) {
            setErrorMessage('Please login before trying to start a new game');
            return;
        }

        dispatch(startNewGame());
    }, [dispatch, user]);

    const onNewGameClick = useCallback(
        (event) => {
            event.preventDefault();
            setQuickJoin(false);
            startNewGameCb();
        },
        [startNewGameCb]
    );

    const onQuickJoinClick = useCallback(
        (event) => {
            event.preventDefault();
            setQuickJoin(true);
            startNewGameCb();
        },
        [startNewGameCb]
    );

    const onCheckboxChange = useCallback(
        (field, event) => {
            let newFilter = Object.assign({}, filter);
            newFilter[field] = event.target.checked;
            setFilter(newFilter);
            localStorage.setItem('gameFilter', JSON.stringify(newFilter));
        },
        [filter]
    );

    useEffect(() => {
        let savedFilter = localStorage.getItem('gameFilter');
        if (savedFilter) {
            savedFilter = JSON.parse(savedFilter);
        } else {
            savedFilter = {};
        }

        let filterDefaults = {
            beginner: true,
            casual: true,
            competitive: true,
            showOnlyNewGames: false
        };

        setFilter(Object.assign(filterDefaults, savedFilter));
    }, []);

    useEffect(() => {
        if (window.Notification && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (user) {
            setErrorMessage(undefined);
        }

        setGameStateBasedOnProps();

        if (!isPendingGameStillCurrent() || isGameInProgress()) {
            setGameState(currentGame && currentGame.started ? GameState.Started : GameState.None);
        }

        if (currentGame && !currentGame.started) {
            // Joining a game
            setGameState(GameState.PendingGame);
        } else if (!currentGame && games.length > 0) {
            const game = games.find((x) => x.id === gameId);

            if (gameId) {
                if (!game) {
                    toastr.error('Error', 'The game you tried to join was not found.');
                } else {
                    if (!game.started && !game.full) {
                        if (game.needsPassword) {
                            dispatch(joinPasswordGame(game, 'Join'));
                        } else {
                            dispatch(sendJoinGameMessage(gameId));
                        }
                    } else {
                        if (game.needsPassword) {
                            dispatch(joinPasswordGame(game, 'Watch'));
                        } else {
                            dispatch(sendWatchGameMessage(game.id));
                        }
                    }
                }
                dispatch(setUrl('/play'));
            }
        }
    }, [
        currentGame,
        dispatch,
        gameId,
        games,
        isGameInProgress,
        isPendingGameStillCurrent,
        setGameStateBasedOnProps,
        user
    ]);

    let modalBody = null;
    switch (gameState) {
        case GameState.None:
        default:
            break;
        case GameState.NewGame:
            modalBody = (
                <NewGame defaultGameName={user.username + "'s game"} quickJoin={quickJoin} />
            );
            break;
        case GameState.PendingGame:
            modalBody = currentGame ? <PendingGame /> : null;
            break;
        case GameState.PasswordedGame:
            modalBody = <PasswordGame />;
            break;
    }

    return (
        <div className='full-height'>
            <div className='col-md-offset-2 col-md-8 full-height'>
                {bannerNotice && <AlertPanel type='error' message={bannerNotice} />}
                {errorMessage && <AlertPanel type='error' message={errorMessage} />}
                {modalBody}
                <Panel title='Current Games'>
                    <div className='col-xs-12 game-controls'>
                        <div className='col-xs-3 join-buttons'>
                            <button
                                className='btn btn-primary'
                                onClick={onNewGameClick}
                                disabled={!!currentGame || !user}
                            >
                                New Game
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={onQuickJoinClick}
                                disabled={!!currentGame || !user}
                            >
                                Quick Join
                            </button>{' '}
                        </div>
                        <div className='col-xs-9 game-filter'>
                            <Panel type='tertiary'>
                                <Checkbox
                                    name='beginner'
                                    label='Beginner'
                                    fieldClass='col-xs-4'
                                    noGroup
                                    onChange={(e) => onCheckboxChange('beginner', e)}
                                    checked={filter['beginner']}
                                />
                                <Checkbox
                                    name='casual'
                                    label='Casual'
                                    fieldClass='col-xs-4'
                                    noGroup
                                    onChange={(e) => onCheckboxChange('casual', e)}
                                    checked={filter['casual']}
                                />
                                <Checkbox
                                    name='competitive'
                                    label='Competitive'
                                    fieldClass='col-xs-4'
                                    noGroup
                                    onChange={(e) => onCheckboxChange('competitive', e)}
                                    checked={filter['competitive']}
                                />
                                <Checkbox
                                    name='showOnlyNewGames'
                                    label='Only show new games'
                                    fieldClass='col-xs-6'
                                    noGroup
                                    onChange={(e) => onCheckboxChange('showOnlyNewGames', e)}
                                    checked={filter['showOnlyNewGames']}
                                />
                            </Panel>
                        </div>
                    </div>
                    <div className='col-xs-12'>
                        {games.length === 0 ? (
                            <AlertPanel type='info' message='No games are currently in progress.' />
                        ) : (
                            <GameList games={games} gameFilter={filter} />
                        )}
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default GameLobby;
