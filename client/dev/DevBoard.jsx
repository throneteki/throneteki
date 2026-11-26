import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import auth, { setUser } from '../redux/reducers/auth.js';
import lobby, { receiveGameState } from '../redux/reducers/lobby';
import game, {
    gameConnected,
    gameConnectionFailed,
    gameConnectionLost,
    gameReconnecting,
    gameRetryScheduled,
    reconnectGameNow,
    sendCardClickedMessage
} from '../redux/reducers/game.js';
import cards from '../redux/reducers/cards';
import navigation from '../redux/reducers/navigation.js';
import admin from '../redux/reducers/admin';
import { apiSlice } from '../redux/middleware/api';
import { serverWait } from '../Components/GameBoard/serverWait';
import {
    applyPredictions,
    predictionFor,
    predictions,
    pressFor
} from '../Components/GameBoard/predictions';
import flipMiddleware from '../redux/middleware/flip.js';
import GameBoard from '../Components/GameBoard/GameBoard';
import {
    boardFixtures,
    fixtureSteps,
    fixtureUsername,
    overlayExamples,
    spectatorName,
    withLongNames,
    withoutOverlay
} from './boardFixtures';

// A store of its own, with no game server behind it: messages the board sends go nowhere. It notes where cards
// were before each new state (flipMiddleware), as the real store does, so cards fly between zones.
// A pretend game server's round trip (&lag=ms): each message the board sends is handled after this long. Until then
// the board shows what the real client predicts, and once handled the pretend server does what was predicted.
let devLag = 0;
let devTruth;
// A pretend dropped connection: it retries with a doubling delay and fails, until asked to reconnect, which works
let devRetry;
const loseConnection = (store) => {
    clearTimeout(devRetry);
    store.dispatch(gameConnectionLost('transport close'));
    let delay = 1000;
    const retry = () => {
        store.dispatch(gameRetryScheduled(Date.now() + delay));
        devRetry = setTimeout(attempt, delay);
        delay = Math.min(delay * 2, 10000);
    };
    const attempt = () => {
        store.dispatch(gameReconnecting());
        devRetry = setTimeout(() => {
            store.dispatch(gameConnectionFailed('xhr poll error'));
            retry();
        }, 1000);
    };
    retry();
};
const lagMiddleware = (store) => (next) => (action) => {
    if (reconnectGameNow.match(action) && store.getState().game.lost) {
        clearTimeout(devRetry);
        store.dispatch(gameReconnecting());
        devRetry = setTimeout(() => store.dispatch(gameConnected()), 1200);
        return next(action);
    }
    if (receiveGameState.match(action)) {
        const { game, username } = action.payload;
        devTruth = game;
        return next(
            receiveGameState(applyPredictions(game, predictions.list(), username), username)
        );
    }
    if (action.type.startsWith('game/send')) {
        const user = store.getState().auth.user;
        const shown = store.getState().lobby.currentGame;
        const prediction = predictionFor(action, shown, user);
        const press = pressFor(action, shown, user);
        const quiet = sendCardClickedMessage.match(action) && !press;
        const seq = serverWait.sent(undefined, { quiet });
        predictions.add(seq, [prediction, press]);
        const shows = predictions.list().some((one) => one.seq === seq);
        if (shows) {
            store.dispatch(receiveGameState(devTruth, user?.username));
        }
        setTimeout(() => {
            serverWait.handled(seq);
            predictions.handled(seq);
            if (shows && devTruth) {
                if (prediction) {
                    devTruth = applyPredictions(devTruth, [prediction], user?.username, true);
                }
                store.dispatch(receiveGameState(devTruth, user?.username));
            }
        }, devLag);
    }
    return next(action);
};

const createFixtureStore = () =>
    configureStore({
        reducer: { admin, api: apiSlice.reducer, auth, cards, navigation, lobby, game },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
                .concat(lagMiddleware)
                .concat(flipMiddleware)
                .concat(apiSlice.middleware)
    });

// With manual mode on, cards can be dragged. Spectating, the page watches the game as someone not playing it. A
// crowd is many people watching, to see how the spectators' count and list hold up.
const crowdSize = 60;
const watcher = (name) => ({ id: name, name, user: { username: name } });
const buildFixture = (fixture, { manual, spectate, players, long, crowd }) => {
    const built = boardFixtures[fixture].build({ players });
    const state = { ...(long ? withLongNames(built) : built), manualMode: manual };
    state.spectators = [
        ...(spectate ? [watcher(spectatorName)] : []),
        ...(crowd
            ? Array.from({ length: crowdSize }, (_, index) => watcher(`Spectator${index + 1}`))
            : [])
    ];
    return state;
};

const viewerOf = (spectate) => (spectate ? spectatorName : fixtureUsername);

// The board expects a game before it first draws, as it has in a real game
const loadFixture = (store, state, board, spectate) => {
    store.dispatch(
        setUser({
            username: viewerOf(spectate),
            permissions: {},
            settings: { hud: { board } }
        })
    );
    store.dispatch(receiveGameState(state, viewerOf(spectate)));
    // With no server to ask, the card lookups (naming a card or a trait) search the scenario's own cards
    store.dispatch(apiSlice.util.upsertQueryData('getCards', undefined, cardsOf(state)));
};

const cardsOf = (state) => {
    const found = {};
    const visit = (value) => {
        if (Array.isArray(value)) {
            value.forEach(visit);
        } else if (value && typeof value === 'object') {
            if (value.code && value.name) {
                found[value.code] = {
                    code: value.code,
                    name: value.name,
                    traits: value.traits ?? []
                };
            }
            Object.values(value).forEach(visit);
        }
    };
    visit(state.players);
    return found;
};

const setQuery = (values) => {
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === false) {
            url.searchParams.delete(key);
        } else {
            url.searchParams.set(key, value === true ? '1' : value);
        }
    }
    window.history.replaceState(window.history.state, '', url);
};

const modeOf = (fixture) => boardFixtures[fixture]?.mode ?? 'joust';
const firstFixture = { joust: 'mid', melee: 'melee' };
// Scenarios and overlays are for one kind of game; steps are for both unless they say otherwise
const forMode = (entries, mode) =>
    Object.entries(entries).filter(([, entry]) =>
        (entry.modes ?? [entry.mode ?? mode]).includes(mode)
    );

// Resolves once the board has drawn its cards and stopped moving: every image loaded and no animation that will end
// still running, or after a few seconds whatever the case
const boardSettled = (signal) =>
    new Promise((resolve) => {
        const started = Date.now();
        let calm = 0;
        const busy = () =>
            [...document.images].some((image) => !image.complete) ||
            document
                .getAnimations()
                .some(
                    (animation) =>
                        animation.playState === 'running' &&
                        animation.effect?.getComputedTiming().iterations !== Infinity
                );
        const check = () => {
            if (signal.aborted) {
                return;
            }
            calm = busy() ? 0 : calm + 1;
            if (calm >= 3 || Date.now() - started > 8000) {
                setTimeout(resolve, 200);
                return;
            }
            setTimeout(check, 100);
        };
        document.fonts.ready.then(() => setTimeout(check, 300));
    });

// Where the panel sits and whether it is open, kept between visits
const layoutKey = 'dev-board-panel';
const readLayout = () => {
    try {
        return { side: 'left', open: true, ...JSON.parse(localStorage.getItem(layoutKey)) };
    } catch {
        return { side: 'left', open: true };
    }
};

const Section = ({ title, children }) => (
    <div className='flex flex-col gap-1'>
        <div className='text-[10px] font-semibold uppercase tracking-wider text-default-400'>
            {title}
        </div>
        {children}
    </div>
);

const Segmented = ({ label, value, options, onChange }) => (
    <div role='radiogroup' aria-label={label} className='flex rounded-md bg-white/10 p-0.5'>
        {options.map(([option, text]) => (
            <button
                key={option}
                type='button'
                role='radio'
                aria-checked={value === option}
                className={classNames(
                    'flex-1 rounded px-2 py-0.5',
                    value === option ? 'bg-amber-500 font-semibold text-black' : 'hover:bg-white/10'
                )}
                onClick={() => onChange(option)}
            >
                {text}
            </button>
        ))}
    </div>
);

const Toggle = ({ label, checked, onChange }) => (
    <label className='flex cursor-pointer items-center gap-1.5'>
        <input
            type='checkbox'
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
        />
        {label}
    </label>
);

const selectClass = 'w-full min-w-0 rounded-md border border-white/15 bg-black px-1 py-1';
const buttonClass =
    'rounded-md bg-white/10 px-2 py-1 text-left hover:bg-white/20 disabled:opacity-40';

// Development only: the real game board with a canned state, at /dev/board?fixture=crowded&board=adaptive
// (&manual=1, &spectate=1, &players=3..6 for melee scenarios, &long=1, &crowd=1, &lag=300|600|1000|3000|5000, &panel=0 to hide the panel). The
// steps change the game as a server would, to see cards move. An overlay is played on its scenario once the board has
// loaded it, so what is seen at its start is the overlay, not the board still loading.
const DevBoard = ({
    fixture: initialFixture,
    board: initialBoard,
    panel,
    manual: manualParam,
    spectate: spectateParam,
    players: playersParam,
    long: longParam,
    crowd: crowdParam,
    lag: lagParam
}) => {
    const [fixture, setFixture] = useState(boardFixtures[initialFixture] ? initialFixture : 'mid');
    const [board, setBoard] = useState(initialBoard === 'classic' ? 'classic' : 'adaptive');
    const [players, setPlayers] = useState(
        String(Math.min(6, Math.max(3, Number(playersParam) || 4)))
    );
    const [long, setLong] = useState(longParam === '1');
    const [crowd, setCrowd] = useState(crowdParam === '1');
    const [lag, setLag] = useState(
        ['300', '600', '1000', '3000', '5000'].includes(lagParam) ? lagParam : '0'
    );
    useEffect(() => {
        devLag = Number(lag);
        serverWait.reset();
        predictions.reset();
        setQuery({ lag: lag === '0' ? undefined : lag });
    }, [lag]);
    const [manual, setManual] = useState(manualParam === '1');
    const [spectate, setSpectate] = useState(spectateParam === '1');
    const mode = modeOf(fixture);
    const current = useRef(null);
    const [store] = useState(() => {
        const created = createFixtureStore();
        current.current = buildFixture(fixture, { manual, spectate, players, long, crowd });
        loadFixture(created, current.current, board, spectate);
        return created;
    });
    const [layout, setLayout] = useState(readLayout);
    const changeLayout = (change) =>
        setLayout((was) => {
            const next = { ...was, ...change };
            try {
                localStorage.setItem(layoutKey, JSON.stringify(next));
            } catch {
                // The panel is then where it was for this visit only
            }
            return next;
        });
    // An overlay to play: the board is opened afresh on its scenario, having seen none, and once it has loaded the
    // overlay is brought about
    const [overlay, setOverlay] = useState(null);
    const [status, setStatus] = useState(null);
    const [boardKey, setBoardKey] = useState(0);
    const opened = useRef(false);

    const changeFixture = (next) => {
        setOverlay(null);
        setFixture(next);
    };
    const showOverlay = (key) => {
        const example = overlayExamples[key];
        if (!example) {
            return;
        }
        try {
            sessionStorage.removeItem('board-overlays:fixture');
        } catch {
            // Without it, an overlay already seen in this tab is not shown again
        }
        setFixture(example.fixture);
        setOverlay({ key, run: Date.now() });
    };
    const reset = () => {
        setOverlay(null);
        current.current = buildFixture(fixture, { manual, spectate, players, long, crowd });
        store.dispatch(receiveGameState(current.current, viewerOf(spectate)));
    };
    const step = (name) => {
        current.current = fixtureSteps[name].apply(structuredClone(current.current));
        store.dispatch(receiveGameState(current.current, viewerOf(spectate)));
    };

    useEffect(() => {
        const example = overlay && overlayExamples[overlay.key];
        const built = buildFixture(fixture, { manual, spectate, players, long, crowd });
        const steps = example?.steps ?? [];
        current.current = example && steps.length === 0 ? withoutOverlay(built) : built;
        loadFixture(store, current.current, board, spectate);
        setQuery({
            fixture,
            board,
            players: modeOf(fixture) === 'melee' ? players : undefined,
            long,
            crowd,
            manual,
            spectate
        });
        // Opened afresh on each scenario, so the board does not take the change of scenario for one in the game
        if (opened.current) {
            setBoardKey((key) => key + 1);
        }
        opened.current = true;
        if (!example) {
            setStatus(null);
            return;
        }
        setStatus(`Loading ${example.label}…`);
        const controller = new AbortController();
        boardSettled(controller.signal).then(() => {
            if (controller.signal.aborted) {
                return;
            }
            current.current =
                steps.length === 0
                    ? built
                    : steps.reduce(
                          (state, name) => fixtureSteps[name].apply(structuredClone(state)),
                          current.current
                      );
            store.dispatch(receiveGameState(current.current, viewerOf(spectate)));
            setStatus(`Showing ${example.label}`);
        });
        return () => controller.abort();
    }, [store, fixture, board, manual, spectate, players, long, crowd, overlay]);

    const fixtures = forMode(boardFixtures, mode);
    const overlays = forMode(overlayExamples, mode);
    const steps = forMode(fixtureSteps, mode);
    return (
        <Provider store={store}>
            <div key={boardKey} className='h-full'>
                <GameBoard />
            </div>
            {panel !== '0' && (
                <div
                    data-dev-panel
                    className={classNames(
                        'fixed bottom-1 z-[500]',
                        layout.side === 'right' ? 'right-1' : 'left-1',
                        ' flex max-h-[calc(100%-0.5rem)] w-56 flex-col gap-2.5 overflow-y-auto rounded-lg border border-white/15 bg-black/90 p-2 text-xs text-white shadow-xl'
                    )}
                >
                    <div className='flex items-center gap-1 font-semibold'>
                        <button
                            type='button'
                            className='flex-1 text-left'
                            onClick={() => changeLayout({ open: !layout.open })}
                        >
                            <span className='text-default-400'>{layout.open ? '▾' : '▸'}</span> Dev
                            board
                        </button>
                        <button
                            type='button'
                            className='rounded px-1 text-default-400 hover:bg-white/10'
                            title='Move the panel to the other side'
                            onClick={() =>
                                changeLayout({ side: layout.side === 'right' ? 'left' : 'right' })
                            }
                        >
                            {layout.side === 'right' ? '⇤' : '⇥'}
                        </button>
                    </div>
                    {layout.open && (
                        <>
                            <Section title='Game'>
                                <Segmented
                                    label='Game'
                                    value={mode}
                                    options={[
                                        ['joust', 'Joust'],
                                        ['melee', 'Melee']
                                    ]}
                                    onChange={(next) =>
                                        next !== mode && changeFixture(firstFixture[next])
                                    }
                                />
                                {mode === 'melee' && (
                                    <Segmented
                                        label='Players'
                                        value={players}
                                        options={['3', '4', '5', '6'].map((count) => [
                                            count,
                                            `${count}p`
                                        ])}
                                        onChange={setPlayers}
                                    />
                                )}
                            </Section>
                            <Section title='Scenario'>
                                <select
                                    className={selectClass}
                                    aria-label='Scenario'
                                    value={fixture}
                                    onChange={(event) => changeFixture(event.target.value)}
                                >
                                    {fixtures.map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                            </Section>
                            <Section title='Overlay'>
                                <div className='flex gap-1'>
                                    <select
                                        className={selectClass}
                                        aria-label='Show an overlay'
                                        value={overlay?.key ?? ''}
                                        onChange={(event) => showOverlay(event.target.value)}
                                    >
                                        <option value=''>Show an overlay…</option>
                                        {overlays.map(([key, { label }]) => (
                                            <option key={key} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type='button'
                                        className={buttonClass}
                                        aria-label='Show the overlay again'
                                        title='Show again'
                                        disabled={!overlay}
                                        onClick={() => showOverlay(overlay.key)}
                                    >
                                        ↻
                                    </button>
                                </div>
                                {status && (
                                    <div data-dev-status className='text-amber-300'>
                                        {status}
                                    </div>
                                )}
                            </Section>
                            <Section title='Steps'>
                                <div className='grid grid-cols-2 gap-1'>
                                    {steps.map(([name, { label }]) => (
                                        <button
                                            key={name}
                                            type='button'
                                            className={buttonClass}
                                            data-step={name}
                                            onClick={() => step(name)}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                    <button
                                        type='button'
                                        className={classNames(buttonClass, 'text-amber-200')}
                                        onClick={reset}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </Section>
                            <Section title='View'>
                                <Segmented
                                    label='Board'
                                    value={board}
                                    options={[
                                        ['adaptive', 'Adaptive'],
                                        ['classic', 'Classic']
                                    ]}
                                    onChange={setBoard}
                                />
                                <Segmented
                                    label='Lag'
                                    value={lag}
                                    options={[
                                        ['0', 'No lag'],
                                        ['300', '0.3s'],
                                        ['600', '0.6s'],
                                        ['1000', '1s'],
                                        ['3000', '3s'],
                                        ['5000', '5s']
                                    ]}
                                    onChange={setLag}
                                />
                                <div className='flex flex-wrap gap-x-3 gap-y-1'>
                                    <Toggle label='Long names' checked={long} onChange={setLong} />
                                    <Toggle label='Manual' checked={manual} onChange={setManual} />
                                    <Toggle
                                        label='Spectate'
                                        checked={spectate}
                                        onChange={setSpectate}
                                    />
                                    <Toggle label='Crowd' checked={crowd} onChange={setCrowd} />
                                </div>
                                <button
                                    type='button'
                                    className={buttonClass}
                                    data-lose-connection=''
                                    onClick={() => loseConnection(store)}
                                >
                                    Lose connection
                                </button>
                            </Section>
                        </>
                    )}
                </div>
            )}
        </Provider>
    );
};

export default DevBoard;
