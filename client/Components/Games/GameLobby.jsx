import React, { useEffect, useRef, useState } from 'react';

import GameFilter from './GameFilter';
import GameList from './GameList';
import NewGame from './NewGame';
import PendingGame from './PendingGame';
import Panel from '../Site/Panel';
import { useSelector } from 'react-redux';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import GameButtons from './GameButtons';
import PasswordGame from './PasswordGame';

const filterDefaults = {
    ['beginner']: true,
    ['casual']: true,
    ['competitive']: true
};

const GameLobby = () => {
    const user = useSelector((state) => state.auth.user);

    const [quickJoin, setQuickJoin] = useState(false);
    const [newGame, setNewGame] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(filterDefaults);
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const games = useSelector((state) => state.lobby.games);
    const passwordGame = useSelector((state) => state.lobby.passwordGame);

    const topRef = useRef(null);

    useEffect(() => {
        const filter = localStorage.getItem('gameFilter');
        if (filter) {
            setCurrentFilter(JSON.parse(filter));
        }
    }, []);

    useEffect(() => {
        if (currentGame) {
            setNewGame(false);
        }
    }, [currentGame]);

    return (
        <div className='mx-auto w-4/5'>
            <div ref={topRef}>
                {newGame && <NewGame quickJoin={quickJoin} onClosed={() => setNewGame(false)} />}
                {currentGame?.started === false && <PendingGame />}
                {passwordGame && <PasswordGame />}
            </div>
            <Panel title={'Current Games'}>
                {!user && (
                    <div className='mb-2 text-center'>
                        <AlertPanel variant={AlertType.Warning}>
                            {'Please log in to be able to start a new game'}
                        </AlertPanel>
                    </div>
                )}
                <div className='grid grid-cols-12'>
                    <div className='col-span-2 mr-5 flex flex-col justify-center'>
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
                    </div>
                    <div className='col-span-10'>
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
                            <GameList
                                games={games}
                                gameFilter={currentFilter}
                                onJoinOrWatchClick={() => topRef.current?.scrollIntoView(false)}
                            />
                        )}
                    </div>
                </div>
            </Panel>
        </div>
    );
};

export default GameLobby;
