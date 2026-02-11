import React, { useEffect, useState } from 'react';

import GameFilter from './GameFilter';
import GameList from './GameList';
import NewGame from './NewGame';
import PendingGame from './PendingGame';
import Panel from '../Site/Panel';
import { useDispatch, useSelector } from 'react-redux';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import GameButtons from './GameButtons';
import PasswordGame from './PasswordGame';
import { toast } from 'react-toastify';
import {
    joinPasswordGame,
    sendJoinGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';
import { setUrl } from '../../redux/reducers/navigation';
import Page from '../../pages/Page';

const filterDefaults = {
    ['beginner']: true,
    ['casual']: true,
    ['competitive']: true,
    ['joust']: true,
    ['melee']: true
};

const GameLobby = ({ gameId }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [quickJoin, setQuickJoin] = useState(false);
    const [newGame, setNewGame] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const games = useSelector((state) => state.lobby.games);
    const passwordGame = useSelector((state) => state.lobby.passwordGame);

    useEffect(() => {
        const filter = localStorage.getItem('gameFilter');
        if (filter) {
            setCurrentFilter(JSON.parse(filter));
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

    // Manages the auto-scrolling, depending on which ref just appeared
    const scrollRef = (node, block = 'start') => {
        if (node !== null) {
            node.scrollIntoView({
                behavior: 'smooth',
                block
            });
        }
    };

    return (
        <Page>
            {newGame && (
                <NewGame quickJoin={quickJoin} onClosed={() => setNewGame(false)} ref={scrollRef} />
            )}
            {currentGame?.started === false && <PendingGame ref={(n) => scrollRef(n, 'center')} />}
            {passwordGame && <PasswordGame ref={scrollRef} />}
            <Panel title={'Current Games'}>
                {!user && (
                    <div className='mb-2 text-center'>
                        <AlertPanel variant={AlertType.Warning}>
                            {'Please log in to be able to start a new game'}
                        </AlertPanel>
                    </div>
                )}
                <div className='flex gap-2 lg:flex-row flex-col'>
                    <GameButtons
                        onNewGame={() => {
                            setQuickJoin(false);
                            setNewGame(true);
                        }}
                        onQuickJoin={() => {
                            setQuickJoin(true);
                            setNewGame(true);
                        }}
                    />
                    <div className='flex-1'>
                        <GameFilter
                            filter={currentFilter}
                            onFilterChanged={(filter) => {
                                setCurrentFilter(filter);
                                localStorage.setItem('gameFilter', JSON.stringify(filter));
                            }}
                        />
                    </div>
                </div>
                <div className='mt-3'>
                    <div className='text-center'>
                        {games.length === 0 ? (
                            <AlertPanel variant={AlertType.Info}>
                                No games are currently in progress. Click the buttons above to start
                                one.
                            </AlertPanel>
                        ) : (
                            <GameList games={games} gameFilter={currentFilter} />
                        )}
                    </div>
                </div>
            </Panel>
        </Page>
    );
};

export default GameLobby;
