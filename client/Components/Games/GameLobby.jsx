import React, { useCallback, useEffect, useMemo, useState } from 'react';

import GameFilter from './GameFilter';
import GameList from './GameList';
import NewGame from './NewGame';
import PendingGame from './PendingGame';
import Frame from '../Site/Frame';
import Notice from '../Site/Notice';
import { Button } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import PasswordGame from './PasswordGame';
import { toast } from 'react-toastify';
import {
    clearEventGameRequest,
    joinPasswordGame,
    sendJoinGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';
import { setUrl } from '../../redux/reducers/navigation';
import Page from '../../pages/Page';
import { createMockLobbyGames, createMockPendingGame, isMockMode } from '../../dev/mockData';

const GameLobby = ({ gameId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [quickJoin, setQuickJoin] = useState(false);
    const [newGame, setNewGame] = useState(false);
    const [newGameEventId, setNewGameEventId] = useState();
    const [currentFilter, setCurrentFilter] = useState({});
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const lobbyGames = useSelector((state) => state.lobby.games);
    const [mockGames] = useState(() =>
        import.meta.env.DEV && isMockMode() ? createMockLobbyGames() : null
    );
    const mockPendingGame = useMemo(
        () =>
            import.meta.env.DEV && user && isMockMode('pending')
                ? createMockPendingGame(user.username)
                : undefined,
        [user]
    );
    const games = mockGames ?? lobbyGames;
    const eventGameRequest = useSelector((state) => state.lobby.eventGameRequest);
    const passwordGame = useSelector((state) => state.lobby.passwordGame);

    useEffect(() => {
        try {
            const filter = localStorage.getItem('gameFilter');
            if (filter) {
                setCurrentFilter(JSON.parse(filter));
            }
        } catch {
            // A broken saved filter just means every game shows
        }
    }, []);

    useEffect(() => {
        if (currentGame) {
            setNewGame(false);
        } else if (!currentGame && gameId && games.length !== 0) {
            const game = games.find((x) => x.id === gameId);

            if (!game) {
                toast.error('Game not found');
                return;
            }

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

            dispatch(setUrl('/play'));
        }
    }, [currentGame, dispatch, gameId, games]);

    useEffect(() => {
        if (!eventGameRequest) {
            return;
        }

        // Cleared whatever happens, so a request can't open the form later on its own
        dispatch(clearEventGameRequest());
        if (!user) {
            toast.info('Log in to start a game for this event');
        } else if (currentGame) {
            toast.info('Leave your current game to start one for this event');
        } else {
            setQuickJoin(false);
            setNewGameEventId(eventGameRequest);
            setNewGame(true);
        }
    }, [currentGame, dispatch, eventGameRequest, user]);

    // Kept stable so it only runs when a panel appears; a new callback each render scrolls on every lobby update
    const scrollRef = useCallback((node) => {
        node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <Page size='wide'>
            {newGame && (
                <NewGame
                    key={newGameEventId}
                    quickJoin={quickJoin}
                    defaultEventId={newGameEventId}
                    onClosed={() => {
                        setNewGame(false);
                        setNewGameEventId(undefined);
                    }}
                    ref={scrollRef}
                />
            )}
            {(mockPendingGame || currentGame?.started === false) && (
                <PendingGame mockGame={mockPendingGame} ref={scrollRef} />
            )}
            {passwordGame && <PasswordGame ref={scrollRef} />}
            <Frame
                title='Play'
                actions={
                    <>
                        <Button
                            isDisabled={!user || !!currentGame || newGame}
                            onPress={() => {
                                setNewGameEventId(undefined);
                                setQuickJoin(true);
                                setNewGame(true);
                            }}
                            variant='tertiary'
                        >
                            Quick join
                        </Button>
                        <Button
                            isDisabled={!user || !!currentGame || newGame}
                            onPress={() => {
                                setNewGameEventId(undefined);
                                setQuickJoin(false);
                                setNewGame(true);
                            }}
                            variant='primary'
                        >
                            New game
                        </Button>
                    </>
                }
                bodyClassName='gap-5'
            >
                {!user && <Notice kind='warning'>Log in to start or join a game.</Notice>}
                <GameFilter
                    filter={currentFilter}
                    onFilterChanged={(filter) => {
                        setCurrentFilter(filter);
                        try {
                            localStorage.setItem('gameFilter', JSON.stringify(filter));
                        } catch {
                            // Filters still apply for this visit
                        }
                    }}
                />
                <GameList games={games} gameFilter={currentFilter} />
            </Frame>
        </Page>
    );
};

export default GameLobby;
