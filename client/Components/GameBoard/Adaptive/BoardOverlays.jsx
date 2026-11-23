import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Avatar } from '@heroui/react';
import CardImage from '../../Images/CardImage';
import { useHud } from '../../../hudStore';
import { overlaySettingsOf } from '../../../hud';
import { claimFlights, motionSettingOff } from '../../../flip';
import { aroundTheTable } from '../seatOrder';
import { useLayoutMode } from './useBoardLayout';
import { remSize } from '../../../cardScale';
import { nameOf } from './followTarget';

// The board's overlays: the game's start and end (major: wait for a button) and what happens in it (minor: continue
// on a timer). Each shows once per game (kept in sessionStorage, so a refresh does not repeat it). A prompt that only
// asks us to choose a title or a player is shown the same way while it waits.

const eliminatedReasons = {
    decked: 'Ran out of cards',
    concede: 'Conceded',
    left: 'Left the game',
    disconnected: 'Disconnected',
    time: 'Ran out of time'
};
const winReasons = {
    power: 'Reached 15 power',
    concede: 'Their opponents conceded',
    remaining: 'Last player standing',
    time: 'Most power when time ran out'
};
const flyTime = 450;
const fadeTime = 250;

const seenKey = (gameId) => `board-overlays:${gameId}`;
const readSeen = (gameId) => {
    try {
        return new Set(JSON.parse(sessionStorage.getItem(seenKey(gameId)) || '[]'));
    } catch {
        return new Set();
    }
};
const markSeen = (gameId, key) => {
    const seen = readSeen(gameId);
    seen.add(key);
    try {
        sessionStorage.setItem(seenKey(gameId), JSON.stringify([...seen]));
    } catch {
        // Remembering is a nicety: without it a refresh shows the overlay again
    }
};

const boardOf = (player) =>
    document.querySelector(`[data-side][data-player="${CSS.escape(nameOf(player) ?? '')}"]`);
const signature = (players, pick) =>
    players.every((player) => pick(player)?.uuid)
        ? players.map((player) => pick(player).uuid).join('|')
        : null;
const powerOf = (player) => player.stats?.totalPower ?? 0;
const ui = (rem) => `calc(var(--ui-scale, 1) * ${rem}rem)`;

// A stable tilt per card, so cards side by side are not in step
const hashOf = (text) => {
    let hash = 0;
    for (const char of String(text)) {
        hash = (hash * 31 + char.charCodeAt(0)) | 0;
    }
    return Math.abs(hash);
};
const tiltOf = (seed, base = 0, spread = 2.5) =>
    base + (((hashOf(seed) % 1000) / 999) * 2 - 1) * spread;

// Players as the melee board seats them, from us at the bottom left round the table. Narrow screens have two to a
// row (three rows for five or six).
const seatRows = (list, everyone, portrait) => {
    const order = aroundTheTable(everyone[0], everyone).filter((player) => list.includes(player));
    if (order.length < 2 || (order.length === 2 && !portrait)) {
        return [order];
    }
    if (portrait && order.length > 4) {
        const last = order.length - 1;
        return [order.slice(3, last).reverse(), [order[last], order[2]], order.slice(0, 2)];
    }
    const bottom = Math.floor(order.length / 2);
    return [order.slice(bottom).reverse(), order.slice(0, bottom)];
};
// Top row first: up to three in a row, more in two rows with the longer on top (two to a row when narrow)
const orderedRows = (list, portrait = false) => {
    if (portrait && list.length > 2) {
        return Array.from({ length: Math.ceil(list.length / 2) }, (_, at) =>
            list.slice(at * 2, at * 2 + 2)
        );
    }
    if (list.length <= 3) {
        return [list];
    }
    const top = Math.ceil(list.length / 2);
    return [list.slice(0, top), list.slice(top)];
};
const columnsOf = (rows) => Math.max(1, ...rows.map((row) => row.length));

// Centred rows of equal-share places, so long names truncate rather than push the rows apart
const Rows = ({ rows, gap = 1.5, keyOf, render }) => {
    const columns = columnsOf(rows);
    const starts = rows.map((_, at) => rows.slice(0, at).reduce((sum, row) => sum + row.length, 0));
    return (
        <div className='flex w-full flex-col items-center' style={{ gap: `${gap * 1.2}rem` }}>
            {rows.map((row, at) => (
                <div
                    key={at}
                    className='flex w-full items-start justify-center'
                    style={{ gap: `${gap}rem` }}
                >
                    {row.map((item, index) => (
                        <div
                            key={keyOf(item)}
                            className='flex min-w-0 justify-center'
                            style={{
                                flex: '0 1 auto',
                                maxWidth: `calc((100% - ${(columns - 1) * gap}rem) / ${columns})`
                            }}
                        >
                            {render(item, starts[at] + index)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

// Which overlays to show, in turn, as the game reaches them
const useOverlays = ({ gameId, players, phase, melee, gameOver, roundsEnded, enabled }) => {
    const [queue, setQueue] = useState([]);
    const queued = useRef(new Set());
    const add = useCallback(
        (overlay) => {
            if (!gameId || queued.current.has(overlay.key) || readSeen(gameId).has(overlay.key)) {
                return;
            }
            queued.current.add(overlay.key);
            setQueue((current) =>
                overlay.major === 'over'
                    ? [...current.filter((item) => item.major), overlay]
                    : [...current, overlay]
            );
        },
        [gameId]
    );

    const live = players.filter((player) => !player.eliminated);
    const plots = signature(live, (player) => player.activePlot);
    const titles = melee ? signature(live, (player) => player.title) : null;
    const plotOf = Object.fromEntries(
        live.map((player) => [nameOf(player), player.activePlot?.uuid])
    );
    const eliminated = players
        .filter((player) => player.eliminated)
        .map(nameOf)
        .join('|');
    const last = useRef(null);
    const before = last.current;
    // The plot phase's reveal: every live player revealing a new plot at once (not a Rains scheme or a card's
    // reveal). Seen as the board draws the new plots, so the board leaves them to the overlay. What was already the case
    // when the board opened counts as seen.
    const revealed =
        enabled &&
        before &&
        phase === 'plot' &&
        eliminated === before.eliminated &&
        live.length > 1 &&
        live.every((player) => {
            const plot = player.activePlot?.uuid;
            return plot && plot !== before.plotOf[nameOf(player)];
        })
            ? live.map((player) => player.activePlot.uuid)
            : null;
    const revealKey = revealed && `plots:${plots}`;
    const claiming =
        revealed && gameId && !queued.current.has(revealKey) && !readSeen(gameId).has(revealKey)
            ? revealed
            : [];
    // Before the board plays its moves (GameBoard's layout effect runs after its children's)
    useLayoutEffect(() => {
        if (claiming.length > 0) {
            claimFlights(claiming);
        }
    });

    useEffect(() => {
        // Until the game's players have arrived there is nothing to compare what changes against
        if (!enabled || players.length < 2) {
            return;
        }
        if (phase === 'setup' && players.every((player) => player.faction?.code)) {
            add({ key: 'start', major: 'start' });
        }
        const before = last.current;
        last.current = { plots, plotOf, titles, eliminated, roundsEnded };
        if (revealed) {
            add({ key: revealKey, minor: 'plots', cards: revealed });
        }
        // What was already the case when the board opened has been seen
        if (before) {
            // Someone leaving the table changes who is counted, not what was revealed
            const sameTable = eliminated === before.eliminated;
            if (sameTable && titles && titles !== before.titles) {
                add({
                    key: `titles:${titles}`,
                    minor: 'titles',
                    cards: live.map((player) => player.title.uuid)
                });
            }
            if (!gameOver) {
                const out = eliminated.split('|').filter(Boolean);
                const was = new Set(before.eliminated.split('|').filter(Boolean));
                for (const name of out.filter((name) => !was.has(name))) {
                    add({ key: `out:${name}`, minor: 'out', name });
                }
            }
        }
        if (before && !gameOver && roundsEnded > before.roundsEnded) {
            add({ key: `round:${roundsEnded}`, minor: 'round', round: roundsEnded });
        }
        if (gameOver) {
            add({ key: 'over', major: 'over' });
        }
    }, [
        enabled,
        phase,
        players,
        live,
        plots,
        plotOf,
        titles,
        eliminated,
        roundsEnded,
        gameOver,
        revealed,
        revealKey,
        add
    ]);

    const current = queue[0];
    const done = useCallback(() => {
        setQueue(([shown, ...rest]) => {
            if (shown) {
                markSeen(gameId, shown.key);
            }
            return rest;
        });
    }, [gameId]);
    // Cards waiting for an overlay to show them: hidden on the board until it does
    const waiting = [...claiming, ...queue.slice(1).flatMap((overlay) => overlay.cards ?? [])];
    return { current, done, waiting };
};

const HideCards = ({ uuids }) =>
    uuids.length > 0 ? (
        <style>
            {`${uuids.map((uuid) => `[data-flip="${CSS.escape(uuid)}"]`).join(',')} { visibility: hidden !important; }`}
        </style>
    ) : null;

// Not flip.js's motionOff(), which is also true while the board settles or rescales: an overlay opening then would
// lose its tosses and start its timers early
const still = () => document.hidden || motionSettingOff();

const cardShadow = 'rounded-[calc(var(--card-scale)*0.25rem)] shadow-[0_8px_22px_rgba(0,0,0,0.7)]';

// A player's faction card with their agendas tucked behind, tossed in at toss ms, the agendas just after
const agendaGap = 110;
const PlayerCards = ({ player, out = false, scale, toss, className }) => {
    const agendas = (player.agendas || []).filter((agenda) => agenda?.code);
    const name = nameOf(player);
    const tossed = (id, delay, card) =>
        toss === undefined ? (
            card
        ) : (
            <Toss id={id} group={name} delay={delay}>
                {card}
            </Toss>
        );
    return (
        <div
            className={classNames('relative flex shrink-0', className, {
                'grayscale brightness-50': out
            })}
            style={{ '--card-scale': scale }}
        >
            <div
                className='relative z-10'
                style={{ rotate: `${tiltOf(`${name}:faction`, -3)}deg` }}
            >
                {tossed(
                    `${name}:faction`,
                    toss,
                    <CardImage code={player.faction?.code || 'cardback'} className={cardShadow} />
                )}
            </div>
            {agendas.map((agenda, index) => (
                <div
                    key={agenda.uuid ?? agenda.code}
                    className='relative'
                    style={{
                        zIndex: 9 - index,
                        marginLeft: 'calc(var(--card-scale) * -2.6rem)',
                        marginTop: `calc(var(--card-scale) * ${0.9 + index * 0.6 + tiltOf(`${name}:${agenda.code}:drop`, 0, 0.3)}rem)`,
                        rotate: `${tiltOf(`${name}:${agenda.code}:${index}`, 4 + index * 3, 3)}deg`
                    }}
                >
                    {tossed(
                        `${name}:${agenda.code}:${index}`,
                        toss + agendaGap * (index + 1),
                        <CardImage code={agenda.code} className={cardShadow} />
                    )}
                </div>
            ))}
        </div>
    );
};

// An avatar and a name, which shortens to fit the room it has
const Name = ({ player, size = 1.1, you = false, className, style }) => (
    <div
        className={classNames('flex min-w-0 max-w-full items-center', className)}
        style={{ gap: ui(0.5), ...style }}
        title={nameOf(player)}
    >
        <Avatar
            src={nameOf(player) ? `/img/avatar/${nameOf(player)}.png` : undefined}
            showFallback
            name={nameOf(player)}
            className='shrink-0 text-tiny shadow-[0_4px_10px_rgba(0,0,0,0.6)] ring-2 ring-white/20'
            style={{ width: ui(size * 1.75), height: ui(size * 1.75) }}
        />
        <span
            className={classNames(
                'min-w-0 truncate font-[Cinzel,serif] font-extrabold tracking-wide [text-shadow:0_2px_8px_#000]',
                you ? 'text-amber-200' : 'text-white'
            )}
            style={{ fontSize: ui(size) }}
        >
            {nameOf(player)}
        </span>
    </div>
);

const zoom = '[zoom:var(--ui-scale,1)]';

const Heading = ({ children, className, style }) => (
    <div
        style={style}
        className={classNames(
            'text-center font-[Cinzel,serif] font-extrabold uppercase tracking-[0.3em] text-amber-300 [text-shadow:0_2px_10px_#000]',
            zoom,
            className
        )}
    >
        {children}
    </div>
);

const OverlayButton = ({ primary = false, onPress, children }) => (
    <button
        type='button'
        onClick={onPress}
        className={classNames(
            'pointer-events-auto rounded-md border px-4 py-1.5 text-sm font-semibold uppercase tracking-wide',
            primary
                ? 'border-amber-400 bg-amber-400 text-black hover:bg-amber-300'
                : 'border-amber-400/70 bg-black/70 text-amber-100 hover:bg-amber-400/15'
        )}
    >
        {children}
    </button>
);

// Continue, filling as its time runs out (starting after delay ms), when it is pressed for you
const ContinueButton = ({ seconds, delay = 0, onContinue }) => {
    const wait = still() ? 0 : delay;
    useEffect(() => {
        const timer = setTimeout(onContinue, wait + seconds * 1000);
        return () => clearTimeout(timer);
    }, [seconds, wait, onContinue]);
    return (
        <button
            type='button'
            onClick={onContinue}
            className='hud-zoom pointer-events-auto relative min-w-[9rem] overflow-hidden rounded-md border border-amber-400/80 bg-black/75 px-6 py-1.5 text-sm font-semibold uppercase tracking-wide text-amber-100 hover:bg-black/90'
        >
            <span
                aria-hidden
                className='absolute inset-0 origin-left bg-amber-400/35'
                style={{ animation: `overlay-timer ${seconds}s linear ${wait}ms both` }}
            />
            <span className='relative'>Continue</span>
        </button>
    );
};

// Cards that come out of the board and go back when the overlay ends (sized as the card, not its tilted outline)
const flyBetween = (element, target, reverse) => {
    const from = element.getBoundingClientRect();
    const to = target?.getBoundingClientRect();
    if (!to || !element.offsetWidth || !to.width) {
        return null;
    }
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const away = {
        transform: `translate(${dx}px, ${dy}px) scale(${to.width / element.offsetWidth})`,
        rotate: '0deg',
        opacity: 0.9
    };
    const here = { transform: 'none', rotate: element.style.rotate || '0deg', opacity: 1 };
    return element.animate(reverse ? [here, away] : [away, here], {
        duration: flyTime,
        easing: 'cubic-bezier(.3,.8,.3,1)',
        fill: reverse ? 'forwards' : 'none'
    });
};

const useFlights = (rootRef) => {
    useLayoutEffect(() => {
        if (still()) {
            return;
        }
        rootRef.current?.querySelectorAll('[data-fly]').forEach((element) => {
            flyBetween(element, element.flyFrom?.(), false);
        });
    }, [rootRef]);
    return useCallback(
        () =>
            Promise.all(
                still()
                    ? []
                    : [...(rootRef.current?.querySelectorAll('[data-fly]') ?? [])].map(
                          (element) => flyBetween(element, element.flyTo?.(), true)?.finished
                      )
            ),
        [rootRef]
    );
};

// A card in an overlay that comes from and goes to a place on the board
const Flier = ({ from, to, tilt = 0, children }) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.flyFrom = from;
            ref.current.flyTo = to;
        }
    });
    return (
        <div ref={ref} data-fly='' className='relative shrink-0' style={{ rotate: `${tilt}deg` }}>
            {children}
        </div>
    );
};

const useCardScale = (rootRef, across, tall) => {
    const [scale, setScale] = useState(1);
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        const measure = () => {
            const rem = remSize();
            const fit = Math.min(
                root.clientWidth / (across * rem * 1.15),
                root.clientHeight / (tall * rem)
            );
            setScale(Math.max(0.6, Math.min(2.4, Math.round(fit * 20) / 20)));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        return () => observer.disconnect();
    }, [rootRef, across, tall]);
    return scale;
};

// Cards tossed onto the overlay's table (overlay-toss) from off its left or right edge. Each player's cards come from
// the nearer side, split evenly (an odd middle one from the left if in the upper half). Start offsets are measured
// from the wrapper, which holds still while the card moves.
const tossTime = 620;
const tossGap = 140;
const landedAt = (delay) => delay + tossTime;
const sameColumn = 8;
const tossSides = (groups, middleY) => {
    const order = [...groups].sort((a, b) =>
        Math.abs(a.x - b.x) > sameColumn ? a.x - b.x : a.y - b.y
    );
    const half = order.length / 2;
    return new Map(
        order.map((group, index) => [
            group.key,
            index < Math.floor(half)
                ? -1
                : index >= Math.ceil(half)
                  ? 1
                  : group.y <= middleY
                    ? -1
                    : 1
        ])
    );
};
const useToss = (rootRef) => {
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root || still()) {
            return;
        }
        const box = root.getBoundingClientRect();
        const tossed = [...root.querySelectorAll('[data-toss]')].map((element) => ({
            element,
            key: element.dataset.tossGroup ?? element.dataset.toss,
            place: element.parentElement.getBoundingClientRect()
        }));
        const groups = new Map();
        for (const { key, place } of tossed) {
            const group = groups.get(key);
            groups.set(
                key,
                group
                    ? {
                          left: Math.min(group.left, place.left),
                          right: Math.max(group.right, place.right),
                          top: Math.min(group.top, place.top),
                          bottom: Math.max(group.bottom, place.bottom)
                      }
                    : { left: place.left, right: place.right, top: place.top, bottom: place.bottom }
            );
        }
        const sides = tossSides(
            [...groups].map(([key, group]) => ({
                key,
                x: (group.left + group.right) / 2,
                y: (group.top + group.bottom) / 2
            })),
            box.top + box.height / 2
        );
        const lift = Math.min(box.height * 0.12, 90);
        for (const { element, key, place } of tossed) {
            const side = sides.get(key);
            const swing = (hashOf(element.dataset.toss) % 200) / 100 - 1;
            const arc = (hashOf(key) % 200) / 100 - 1;
            const x = side < 0 ? box.left - 40 - place.right : box.right + 40 - place.left;
            const y = arc * lift + swing * 20;
            element.style.setProperty('--toss-x', `${Math.round(x)}px`);
            element.style.setProperty('--toss-y', `${Math.round(y)}px`);
            element.style.setProperty('--toss-r', `${Math.round(swing * 40 - side * 20)}deg`);
        }
    }, [rootRef]);
};
const Toss = ({ id, group, delay, children }) => (
    <div
        data-toss={id}
        data-toss-group={group}
        className='overlay-toss'
        style={{ '--toss-delay': `${delay}ms` }}
    >
        {children}
    </div>
);
// What comes after the cards have landed: names, numbers, buttons
const after = (delay) => ({ '--after-delay': `${delay}ms` });

// A number counting up to its value once the cards have landed
const CountUp = ({ value, delay }) => {
    const [shown, setShown] = useState(() => (still() ? value : 0));
    useEffect(() => {
        if (still()) {
            setShown(value);
            return;
        }
        let frame;
        const start = performance.now() + delay;
        const step = (now) => {
            const done = Math.min(1, Math.max(0, (now - start) / 800));
            setShown(Math.round(value * (1 - (1 - done) ** 3)));
            if (done < 1) {
                frame = requestAnimationFrame(step);
            }
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [value, delay]);
    return shown;
};

const groupLanded = (player, delay) =>
    landedAt(delay + agendaGap * (player.agendas?.filter((agenda) => agenda?.code).length ?? 0));

const groupWidth = (player) =>
    4 + 1.4 * (player.agendas?.filter((agenda) => agenda?.code).length ?? 0);
const widestGroup = (players) => Math.max(4, ...players.map(groupWidth));

// The players sit down: their cards tossed in, then their names, and in a joust VS between them
const Start = ({ players, me, portrait, onClose }) => {
    const rootRef = useRef(null);
    const melee = players.length > 2;
    const ordered = me ? [me, ...players.filter((player) => player !== me)] : players;
    const joust = portrait ? [...ordered].reverse() : ordered;
    const rows = seatRows(players, players, portrait);
    const across = melee
        ? columnsOf(rows) * (widestGroup(players) + 2)
        : portrait
          ? widestGroup(players) + 2
          : players.reduce((sum, player) => sum + groupWidth(player), 0) + 10;
    const tall = melee ? 6 + rows.length * 11 : portrait ? 30 : 13;
    const scale = useCardScale(rootRef, across, tall);
    useToss(rootRef);
    const tossOf = (index) => 150 + index * tossGap * 1.6;
    const allLanded = Math.max(
        ...players.map((player, index) => groupLanded(player, tossOf(index)))
    );
    const seat = (player, index) => (
        <div className='flex min-w-0 max-w-full flex-col items-center gap-5'>
            <PlayerCards player={player} scale={scale} toss={tossOf(index)} />
            <Name
                player={player}
                you={player === me}
                className='overlay-after'
                style={after(groupLanded(player, tossOf(index)))}
            />
        </div>
    );
    return (
        <div
            ref={rootRef}
            className='flex h-full w-full flex-col items-center justify-center gap-6 p-4'
        >
            {melee && (
                <Heading className='overlay-after text-xl' style={after(0)}>
                    Melee · {players.length} players
                </Heading>
            )}
            {melee ? (
                <Rows rows={rows} gap={2.5} keyOf={nameOf} render={seat} />
            ) : (
                <div
                    className={classNames(
                        'flex w-full items-center justify-center',
                        portrait ? 'flex-col gap-10' : 'gap-10'
                    )}
                >
                    {joust.map((player, index) => (
                        <React.Fragment key={nameOf(player)}>
                            {index === 1 && (
                                <div
                                    className='overlay-stamp shrink-0 font-[Cinzel,serif] text-5xl font-extrabold text-amber-300 [text-shadow:0_0_24px_rgba(242,184,75,0.6),0_4px_0_#5a3c08]'
                                    style={{ animationDelay: `${allLanded}ms` }}
                                >
                                    VS
                                </div>
                            )}
                            <div
                                className={classNames(
                                    'flex min-w-0 justify-center',
                                    portrait ? 'max-w-full' : 'max-w-[40%]'
                                )}
                            >
                                {seat(player, ordered.indexOf(player))}
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
            <div className='overlay-after hud-zoom flex gap-2' style={after(allLanded + 300)}>
                <OverlayButton primary onPress={onClose}>
                    Begin
                </OverlayButton>
            </div>
        </div>
    );
};

// The game's end: the winner's cards (in a melee everyone's, last place first), then the result. Rematch and Continue
// playing when the game offers them.
const Over = ({ players, me, portrait, winners, winReason, buttons, onButtonClick, onClose }) => {
    const rootRef = useRef(null);
    const melee = players.length > 2;
    const winning = players.filter((player) => winners.includes(nameOf(player)));
    const placed = [...players].sort((a, b) => (a.standing ?? 99) - (b.standing ?? 99));
    const rows = orderedRows(placed, portrait);
    const across = melee ? columnsOf(rows) * (widestGroup(players) + 2) : 12;
    const scale = useCardScale(rootRef, across, melee ? 10 + rows.length * 15 : 18);
    useToss(rootRef);
    const iWon = me && winners.includes(nameOf(me));
    const title =
        winning.length === 0
            ? 'No winner'
            : me && !melee
              ? iWon
                  ? 'Victory'
                  : 'Defeat'
              : `${winning.map(nameOf).join(' and ')} ${winning.length > 1 ? 'win' : 'wins'}`;
    const tossOf = (player) =>
        melee ? 150 + (placed.length - 1 - placed.indexOf(player)) * tossGap * 2.2 : 200;
    const shown = melee ? placed : winning.slice(0, 1);
    const allLanded = Math.max(300, ...shown.map((player) => groupLanded(player, tossOf(player))));
    const button = (arg) => buttons?.find((candidate) => candidate.arg === arg);
    const press = (arg) => {
        const found = button(arg);
        if (found) {
            onButtonClick(found);
        }
        onClose();
    };
    const powerLine = players.map((player) => `${nameOf(player)} ${powerOf(player)}`).join(' · ');
    const lead = (player, cardScale) => (
        <div className='relative flex justify-center'>
            {winners.includes(nameOf(player)) && (
                <div
                    aria-hidden
                    className='overlay-rays pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full'
                    style={after(allLanded)}
                />
            )}
            <PlayerCards
                player={player}
                scale={cardScale}
                out={player.eliminated}
                toss={tossOf(player)}
            />
        </div>
    );

    return (
        <div
            ref={rootRef}
            className='flex h-full w-full flex-col items-center justify-center gap-5 p-4 text-center'
        >
            <div
                className={classNames(
                    'overlay-stamp relative z-10 max-w-full break-words font-[Cinzel,serif] font-extrabold tracking-wide [text-shadow:0_0_24px_rgba(242,184,75,0.45),0_4px_0_#000]',
                    melee ? 'text-3xl' : 'text-5xl',
                    me && !melee && !iWon && winning.length > 0 ? 'text-red-400' : 'text-amber-300'
                )}
                style={{ animationDelay: `${allLanded}ms` }}
            >
                {title}
            </div>
            {melee ? (
                <Rows
                    rows={rows}
                    gap={2}
                    keyOf={nameOf}
                    render={(player) => (
                        <div className='flex min-w-0 max-w-full flex-col items-center gap-4'>
                            {lead(player, scale * (player.standing === 1 ? 1.15 : 0.9))}
                            <div
                                className='overlay-after flex min-w-0 max-w-full flex-col items-center gap-1'
                                style={after(groupLanded(player, tossOf(player)))}
                            >
                                <Name player={player} you={player === me} />
                                <div className='hud-zoom flex flex-col items-center gap-1 text-sm leading-tight text-white'>
                                    <span className='flex items-baseline gap-2'>
                                        {player.standing && (
                                            <span className='font-[Cinzel,serif] text-xl font-extrabold text-amber-300'>
                                                #{player.standing}
                                            </span>
                                        )}
                                        <span>{powerOf(player)} power</span>
                                    </span>
                                    {player.eliminated && (
                                        <span className='text-xs uppercase tracking-wider text-red-300'>
                                            {eliminatedReasons[player.eliminatedReason] ??
                                                'Eliminated'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                />
            ) : (
                winning.length > 0 && (
                    <div className='flex min-w-0 max-w-full flex-col items-center gap-6'>
                        {lead(winning[0], scale)}
                        <Name
                            player={winning[0]}
                            you={winning[0] === me}
                            className='overlay-after'
                            style={after(allLanded)}
                        />
                    </div>
                )
            )}
            <div
                className='overlay-after hud-zoom max-w-full text-sm uppercase tracking-widest text-default-400'
                style={after(allLanded + 300)}
            >
                {[winReasons[winReason], !melee && powerLine].filter(Boolean).join(' · ')}
            </div>
            <div
                className='overlay-after hud-zoom flex flex-wrap justify-center gap-2'
                style={after(allLanded + 450)}
            >
                {button('rematch') && (
                    <OverlayButton primary onPress={() => press('rematch')}>
                        Rematch
                    </OverlayButton>
                )}
                {button('continue') && (
                    <OverlayButton onPress={() => press('continue')}>
                        Continue playing
                    </OverlayButton>
                )}
                <OverlayButton primary={!button('rematch')} onPress={onClose}>
                    View board
                </OverlayButton>
            </div>
        </div>
    );
};

// Standings on power, most first (ties in seat order), each with their progress towards winning
const winningPower = 15;
const byPower = (players) =>
    aroundTheTable(players[0], players).sort((a, b) => powerOf(b) - powerOf(a));
const standingToss = (index) => 150 + index * tossGap;

const Standing = ({ player, me, scale, portrait, index }) => {
    const landed = groupLanded(player, standingToss(index));
    return (
        <div
            className={classNames(
                'flex min-w-0 max-w-full items-center',
                portrait ? 'w-full gap-3' : 'flex-col gap-4'
            )}
        >
            <PlayerCards
                player={player}
                scale={portrait ? Math.min(scale, 0.55) : scale}
                toss={standingToss(index)}
            />
            <div
                className={classNames(
                    'overlay-after flex min-w-0 flex-col gap-1',
                    portrait ? 'flex-1' : 'max-w-full items-center'
                )}
                style={after(landed)}
            >
                <Name player={player} you={player === me} />
                <div className={classNames('flex items-baseline gap-2 leading-none', zoom)}>
                    <span className='font-[Cinzel,serif] text-3xl font-extrabold tabular-nums text-amber-300'>
                        <CountUp value={powerOf(player)} delay={landed} />
                    </span>
                    <span className='text-xs uppercase tracking-wider text-default-400'>power</span>
                </div>
                <div
                    className={classNames(
                        'mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-white/15',
                        zoom
                    )}
                >
                    <div
                        className='h-full'
                        style={{
                            width: `${Math.min(100, (powerOf(player) / winningPower) * 100)}%`
                        }}
                    >
                        <div
                            className='overlay-grow h-full rounded-full bg-amber-400'
                            style={after(landed)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Standings = ({ ranked, me, scale, portrait }) =>
    portrait ? (
        <div className='flex w-full max-w-md flex-col items-stretch gap-3'>
            {ranked.map((player, index) => (
                <Standing
                    key={nameOf(player)}
                    player={player}
                    me={me}
                    scale={scale}
                    portrait
                    index={index}
                />
            ))}
        </div>
    ) : (
        <Rows
            rows={orderedRows(ranked)}
            gap={2.5}
            keyOf={nameOf}
            render={(player, index) => (
                <Standing player={player} me={me} scale={scale} index={index} />
            )}
        />
    );

// Whom a player's title rivals and supports, among the players still in, each line popping in after the card lands
const Relations = ({ player, live, me, delay }) => {
    const among = (titles) =>
        live.filter((other) => other !== player && titles?.includes(other.title?.name));
    const lines = [
        {
            label: 'Rivals',
            tone: 'border-red-400/60 bg-red-500/25 text-red-200',
            players: among(player.title?.rivals)
        },
        {
            label: 'Supports',
            tone: 'border-emerald-400/60 bg-emerald-500/25 text-emerald-200',
            players: among(player.title?.supports)
        }
    ].filter((line) => line.players.length > 0);
    if (lines.length === 0) {
        return null;
    }
    return (
        <div
            className='flex min-w-0 max-w-full flex-col items-center'
            style={{ gap: ui(0.25), fontSize: ui(0.75) }}
        >
            {lines.map((line, index) => (
                <div
                    key={line.label}
                    className='overlay-pop flex min-w-0 max-w-full items-center'
                    style={{ gap: ui(0.375), ...after(delay + index * 120) }}
                >
                    <span
                        className={classNames(
                            'shrink-0 rounded border px-1 font-bold uppercase tracking-wider',
                            line.tone
                        )}
                    >
                        {line.label}
                    </span>
                    <span
                        className='min-w-0 truncate text-white [text-shadow:0_1px_4px_#000]'
                        title={line.players.map(nameOf).join(', ')}
                    >
                        {line.players.map((other, at) => (
                            <React.Fragment key={nameOf(other)}>
                                {at > 0 && ', '}
                                <span className={classNames({ 'text-amber-200': other === me })}>
                                    {other === me ? 'You' : nameOf(other)}
                                </span>
                            </React.Fragment>
                        ))}
                    </span>
                </div>
            ))}
        </div>
    );
};

// A card that lies face down, then is turned face up where it lies
const flipTime = 560;
const FaceUp = ({ code, orientation, delay }) => (
    <div className='overlay-flip relative' style={{ '--flip-delay': `${delay}ms` }}>
        <CardImage
            code={code}
            orientation={orientation}
            className={classNames('overlay-flip-face', cardShadow)}
        />
        <div className={classNames('overlay-flip-back overflow-hidden', cardShadow)}>
            {orientation === 'horizontal' ? (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90'>
                    <CardImage code='cardback' />
                </div>
            ) : (
                <CardImage code='cardback' />
            )}
        </div>
    </div>
);

// The overlays during the game: plots revealed, titles chosen, the end of a round, a player eliminated. Continue's
// time starts once each has played out.
const Minor = ({ overlay, players, me, portrait, seconds, released, onLanded }) => {
    const rootRef = useRef(null);
    const [leaving, setLeaving] = useState(false);
    const live = players.filter((player) => !player.eliminated);
    const out =
        overlay.minor === 'out' ? players.find((player) => nameOf(player) === overlay.name) : null;
    const seats = seatRows(live, players, portrait);
    const columns = columnsOf(seats);
    const ranked = byPower(live);
    const rankedRows = orderedRows(ranked);
    const [across, tall] = {
        plots: [columns * 7.2, 6 + seats.length * 8],
        titles: [columns * 6, 7 + seats.length * 12.5],
        round: portrait
            ? [14, 4 + live.length * 7]
            : [columnsOf(rankedRows) * 7.5, 5 + rankedRows.length * 13],
        out: [10, 15]
    }[overlay.minor];
    const scale = useCardScale(rootRef, across, tall);
    useToss(rootRef);
    const land = useFlights(rootRef);
    const finish = useCallback(() => {
        if (leaving) {
            return;
        }
        setLeaving(true);
        land().then(onLanded, onLanded);
    }, [leaving, land, onLanded]);

    const flipOf = (index) => flyTime + 80 + index * 130;
    const titleLanded = (index) => flyTime + 60 + index * 90;
    const intro = {
        plots: flipOf(live.length - 1) + flipTime,
        titles: titleLanded(live.length - 1) + 400,
        round: Math.max(
            0,
            ...ranked.map((player, index) => groupLanded(player, standingToss(index)))
        ),
        out: 1500
    }[overlay.minor];

    // Each card comes out of, and goes back to, where the board draws it, or its player's area for it
    const onBoard = (card, area) => () =>
        (card?.uuid && document.querySelector(`[data-flip="${CSS.escape(card.uuid)}"]`)) || area();
    const plotZone = (player) => () => boardOf(player)?.querySelector('[data-flip-layers]');
    const plotDeckOf = (player) => () =>
        boardOf(player)?.querySelector('[data-flip-source="plot deck"]') ?? plotZone(player)();
    const titleSlot = (player) => () =>
        boardOf(player)?.querySelector('[data-flip-source="title"]') ??
        boardOf(player)?.querySelector('[data-flip-source="agenda"]');

    return (
        <div
            ref={rootRef}
            className={classNames(
                'relative flex h-full w-full flex-col items-center justify-center gap-5 p-4',
                {
                    'overlay-leaving': leaving,
                    'overlay-landed': released
                }
            )}
            style={{ '--card-scale': scale }}
        >
            {out && (
                <div
                    aria-hidden
                    className='overlay-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(220,38,38,0.4),transparent_60%)]'
                />
            )}
            {overlay.minor !== 'out' && (
                <Heading className='overlay-text text-xl'>
                    {overlay.minor === 'plots'
                        ? 'Plots revealed'
                        : overlay.minor === 'titles'
                          ? 'Titles chosen'
                          : `End of round ${overlay.round}`}
                </Heading>
            )}
            {overlay.minor === 'plots' && (
                <Rows
                    rows={seats}
                    keyOf={nameOf}
                    render={(player, index) => (
                        <div className='flex min-w-0 max-w-full flex-col items-center gap-3'>
                            <Flier
                                from={plotDeckOf(player)}
                                to={onBoard(player.activePlot, plotZone(player))}
                                tilt={tiltOf(`${nameOf(player)}:${player.activePlot?.code}`, 0, 2)}
                            >
                                <FaceUp
                                    code={player.activePlot?.code}
                                    orientation='horizontal'
                                    delay={flipOf(index)}
                                />
                            </Flier>
                            <Name
                                player={player}
                                size={1}
                                you={player === me}
                                className='overlay-after'
                                style={after(flipOf(index) + flipTime / 2)}
                            />
                        </div>
                    )}
                />
            )}
            {overlay.minor === 'titles' && (
                <Rows
                    rows={seats}
                    keyOf={nameOf}
                    render={(player, index) => (
                        <div className='flex min-w-0 max-w-full flex-col items-center gap-2'>
                            <Flier
                                from={onBoard(player.title, titleSlot(player))}
                                to={onBoard(player.title, titleSlot(player))}
                                tilt={tiltOf(`${nameOf(player)}:${player.title?.code}`, 0, 3)}
                            >
                                <CardImage code={player.title?.code} className={cardShadow} />
                            </Flier>
                            <Name
                                player={player}
                                size={1}
                                you={player === me}
                                className='overlay-after'
                                style={after(titleLanded(index))}
                            />
                            <Relations
                                player={player}
                                live={live}
                                me={me}
                                delay={titleLanded(index) + 200}
                            />
                        </div>
                    )}
                />
            )}
            {overlay.minor === 'round' && (
                <Standings ranked={ranked} me={me} scale={scale} portrait={portrait} />
            )}
            {out && (
                <div className='overlay-quake flex min-w-0 max-w-full flex-col items-center gap-6'>
                    <div className='relative'>
                        <div className='overlay-thud'>
                            <PlayerCards
                                player={out}
                                scale={scale}
                                toss={120}
                                className='overlay-ashen'
                            />
                        </div>
                        <div
                            className='overlay-seal pointer-events-none absolute left-1/2 top-1/2 z-30'
                            style={{
                                translate: '-50% -50%',
                                rotate: `${tiltOf(`${nameOf(out)}:seal`, -14, 4)}deg`
                            }}
                        >
                            <div className='rounded-md border-[3px] border-red-600 bg-red-950/75 p-[3px] shadow-[0_0_0_2px_rgba(0,0,0,0.45),0_12px_30px_rgba(0,0,0,0.85)]'>
                                <div
                                    className='rounded-sm border border-red-500/80 px-3 py-0.5 font-[Cinzel,serif] font-extrabold tracking-[0.15em] text-red-500 [text-shadow:0_1px_0_rgba(0,0,0,0.6)]'
                                    style={{ fontSize: 'calc(var(--card-scale, 1) * 1rem)' }}
                                >
                                    ELIMINATED
                                </div>
                            </div>
                        </div>
                    </div>
                    <Name
                        player={out}
                        you={out === me}
                        className='overlay-after'
                        style={after(1200)}
                    />
                    <div
                        className='overlay-after hud-zoom flex max-w-full flex-wrap items-center justify-center gap-x-2 rounded-full border border-red-500/40 bg-black/75 px-4 py-1.5 text-sm font-medium text-white shadow-[0_6px_20px_rgba(0,0,0,0.6)]'
                        style={after(1350)}
                    >
                        <span className='text-red-300'>
                            {eliminatedReasons[out.eliminatedReason] ?? 'Eliminated'}
                        </span>
                        <span aria-hidden className='text-red-500/70'>
                            ·
                        </span>
                        <span>
                            {live.length} {live.length === 1 ? 'player remains' : 'players remain'}
                        </span>
                    </div>
                </div>
            )}
            <div className='overlay-text'>
                <ContinueButton seconds={seconds} delay={intro} onContinue={finish} />
            </div>
        </div>
    );
};

// An overlay on the board. Cards it shows are hidden on the board meanwhile, so a card is never in two places.
const OverlayView = ({
    overlay,
    players,
    me,
    game,
    buttons,
    onButtonClick,
    portrait,
    seconds,
    onDone
}) => {
    const [released, setReleased] = useState(false);
    const [fading, setFading] = useState(false);
    const close = useCallback(() => {
        setReleased(true);
        setFading(true);
        setTimeout(onDone, still() ? 0 : fadeTime);
    }, [onDone]);
    const major = !!overlay.major;
    const held = !released && overlay.cards?.length > 0 ? overlay.cards : [];

    return (
        <div
            data-board-overlay={overlay.key}
            className={classNames(
                'overlay-root pointer-events-none absolute inset-0 z-[340] overflow-hidden transition-opacity ease-out',
                { 'opacity-0': fading }
            )}
            style={{ transitionDuration: `${fadeTime}ms` }}
        >
            <HideCards uuids={held} />
            {
                <>
                    <div
                        className={classNames(
                            'overlay-dim absolute inset-0',
                            major ? 'pointer-events-auto bg-black/75' : 'bg-black/55'
                        )}
                    />
                    <div className='absolute inset-0'>
                        {overlay.major === 'start' && (
                            <Start players={players} me={me} portrait={portrait} onClose={close} />
                        )}
                        {overlay.major === 'over' && (
                            <div className='pointer-events-auto h-full w-full'>
                                <Over
                                    players={players}
                                    me={me}
                                    portrait={portrait}
                                    winners={game?.winners ?? []}
                                    winReason={game?.winReason}
                                    buttons={buttons}
                                    onButtonClick={onButtonClick}
                                    onClose={close}
                                />
                            </div>
                        )}
                        {overlay.minor && (
                            <Minor
                                overlay={overlay}
                                players={players}
                                me={me}
                                portrait={portrait}
                                seconds={seconds}
                                released={released}
                                onLanded={close}
                            />
                        )}
                    </div>
                </>
            }
        </div>
    );
};

const BoardOverlays = ({ thisPlayer, otherPlayers, isPlaying, buttons, onButtonClick }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const hud = useHud();
    const mode = useLayoutMode();
    const overlays = overlaySettingsOf(hud);
    const players = [thisPlayer, ...otherPlayers].filter((player) => player?.faction);
    const melee = otherPlayers.length > 1;
    // The rounds ended so far, as the game's log announces the end of each
    const messages = currentGame?.messages;
    const roundsEnded = useMemo(
        () =>
            (messages ?? []).filter((entry) => entry?.message?.alert?.type === 'endofround').length,
        [messages]
    );
    const { current, done, waiting } = useOverlays({
        gameId: currentGame?.id,
        players,
        phase: thisPlayer?.phase,
        melee,
        gameOver: !!currentGame?.gameOver,
        roundsEnded,
        enabled: overlays.enabled
    });
    const me = isPlaying ? thisPlayer : null;
    const portrait = mode === 'narrow';

    if (!overlays.enabled) {
        return null;
    }
    if (current) {
        return (
            <>
                <HideCards uuids={waiting} />
                <OverlayView
                    key={current.key}
                    overlay={current}
                    players={players}
                    me={me}
                    game={currentGame}
                    buttons={buttons}
                    onButtonClick={onButtonClick}
                    portrait={portrait}
                    seconds={overlays.seconds}
                    onDone={done}
                />
            </>
        );
    }
    return <HideCards uuids={waiting} />;
};

export default BoardOverlays;
