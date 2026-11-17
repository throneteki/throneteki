import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth, { setUser } from '../redux/reducers/auth.js';
import lobby, { receiveGameState } from '../redux/reducers/lobby';
import game from '../redux/reducers/game.js';
import cards from '../redux/reducers/cards';
import navigation from '../redux/reducers/navigation.js';
import admin from '../redux/reducers/admin';
import { apiSlice } from '../redux/middleware/api';
import flipMiddleware from '../redux/middleware/flip.js';
import GameBoard from '../Components/GameBoard/GameBoard';
import { hudStore } from '../hudStore';
import { boardFixtures, fixtureSteps, fixtureUsername, spectatorName } from './boardFixtures';

// A store of its own, with no game server behind it: messages the board sends go nowhere. It notes where cards
// were before each new state (flipMiddleware), as the real store does, so cards fly between zones.
const createFixtureStore = () =>
    configureStore({
        reducer: { admin, api: apiSlice.reducer, auth, cards, navigation, lobby, game },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
                .concat(flipMiddleware)
                .concat(apiSlice.middleware)
    });

// With manual mode on, cards can be dragged. Spectating, the page watches the game as someone not playing it.
const buildFixture = (fixture, { manual, spectate }) => {
    const state = { ...boardFixtures[fixture].build(), manualMode: manual };
    if (spectate) {
        state.spectators = [
            { id: spectatorName, name: spectatorName, user: { username: spectatorName } }
        ];
    }
    return state;
};

const viewerOf = (spectate) => (spectate ? spectatorName : fixtureUsername);

// The board expects a game before it first draws, as it has in a real game
const loadFixture = (store, state, board, spectate) => {
    store.dispatch(
        setUser({ username: viewerOf(spectate), permissions: {}, settings: { hud: { board } } })
    );
    store.dispatch(receiveGameState(state, viewerOf(spectate)));
};

const setQuery = (fixture, board) => {
    const url = new URL(window.location.href);
    url.searchParams.set('fixture', fixture);
    url.searchParams.set('board', board);
    window.history.replaceState(window.history.state, '', url);
};

// Development only: the real game board, showing a canned game state, at /dev/board?fixture=crowded&board=adaptive
// (&manual=1 for dragging, &spectate=1 to watch, &panel=0 to hide this panel). The steps change the game as a
// server would, to see cards move between zones.
const DevBoard = ({
    fixture: initialFixture,
    board: initialBoard,
    panel,
    manual: manualParam,
    spectate: spectateParam
}) => {
    const options = { manual: manualParam === '1', spectate: spectateParam === '1' };
    const [fixture, setFixture] = useState(boardFixtures[initialFixture] ? initialFixture : 'mid');
    const [board, setBoard] = useState(initialBoard === 'classic' ? 'classic' : 'adaptive');
    const current = useRef(null);
    const [store] = useState(() => {
        const created = createFixtureStore();
        current.current = buildFixture(fixture, options);
        loadFixture(created, current.current, board, options.spectate);
        return created;
    });
    const [open, setOpen] = useState(true);

    const reset = () => {
        current.current = buildFixture(fixture, options);
        store.dispatch(receiveGameState(current.current, viewerOf(options.spectate)));
    };
    const step = (name) => {
        current.current = fixtureSteps[name].apply(structuredClone(current.current));
        store.dispatch(receiveGameState(current.current, viewerOf(options.spectate)));
    };

    useEffect(() => {
        hudStore.reset();
        const spectate = spectateParam === '1';
        current.current = buildFixture(fixture, { manual: manualParam === '1', spectate });
        loadFixture(store, current.current, board, spectate);
        setQuery(fixture, board);
    }, [store, fixture, board, manualParam, spectateParam]);

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
                            {Object.entries(fixtureSteps).map(([name, { label }]) => (
                                <button
                                    key={name}
                                    type='button'
                                    data-step={name}
                                    onClick={() => step(name)}
                                >
                                    {label}
                                </button>
                            ))}
                            <button type='button' onClick={reset}>
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
