import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth, { setUser } from '../redux/reducers/auth.js';
import lobby, { receiveGameState } from '../redux/reducers/lobby';
import game from '../redux/reducers/game.js';
import cards from '../redux/reducers/cards';
import navigation from '../redux/reducers/navigation.js';
import admin from '../redux/reducers/admin';
import { apiSlice } from '../redux/middleware/api';
import GameBoard from '../Components/GameBoard/GameBoard';
import { hudStore } from '../hudStore';
import { boardFixtures, fixtureUsername } from './boardFixtures';

// A store of its own, with no game server behind it: messages the board sends go nowhere
const createFixtureStore = () =>
    configureStore({
        reducer: { admin, api: apiSlice.reducer, auth, cards, navigation, lobby, game },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(
                apiSlice.middleware
            )
    });

// The board expects a game before it first draws, as it has in a real game
const loadFixture = (store, fixture, board) => {
    store.dispatch(
        setUser({ username: fixtureUsername, permissions: {}, settings: { hud: { board } } })
    );
    store.dispatch(receiveGameState(boardFixtures[fixture].build(), fixtureUsername));
};

const setQuery = (fixture, board) => {
    const url = new URL(window.location.href);
    url.searchParams.set('fixture', fixture);
    url.searchParams.set('board', board);
    window.history.replaceState(window.history.state, '', url);
};

// Development only: the real game board, showing a canned game state, at /dev/board?fixture=crowded&board=adaptive
const DevBoard = ({ fixture: initialFixture, board: initialBoard, panel }) => {
    const [fixture, setFixture] = useState(boardFixtures[initialFixture] ? initialFixture : 'mid');
    const [board, setBoard] = useState(initialBoard === 'classic' ? 'classic' : 'adaptive');
    const [store] = useState(() => {
        const created = createFixtureStore();
        loadFixture(created, fixture, board);
        return created;
    });
    const [open, setOpen] = useState(true);

    useEffect(() => {
        hudStore.reset();
        loadFixture(store, fixture, board);
        setQuery(fixture, board);
    }, [store, fixture, board]);

    return (
        <Provider store={store}>
            <div className='h-full'>
                <GameBoard />
            </div>
            {panel !== '0' && (
                <div className='fixed left-1 bottom-1 z-[500] text-xs bg-black/85 border border-default-200 rounded-md p-1 flex flex-col gap-1'>
                    <button type='button' className='text-left' onClick={() => setOpen(!open)}>
                        {open ? '▾ Fixture' : '▸'}
                    </button>
                    {open && (
                        <>
                            <select
                                className='bg-black'
                                value={fixture}
                                onChange={(event) => setFixture(event.target.value)}
                            >
                                {Object.entries(boardFixtures).map(([key, { label }]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            <select
                                className='bg-black'
                                value={board}
                                onChange={(event) => setBoard(event.target.value)}
                            >
                                <option value='adaptive'>Adaptive</option>
                                <option value='classic'>Classic</option>
                            </select>
                            <button
                                type='button'
                                onClick={() =>
                                    store.dispatch(
                                        receiveGameState(
                                            boardFixtures[fixture].build(),
                                            fixtureUsername
                                        )
                                    )
                                }
                            >
                                Reset
                            </button>
                        </>
                    )}
                </div>
            )}
        </Provider>
    );
};

export default DevBoard;
