import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { sendLeaveGameMessage } from '../../../redux/reducers/game';
import classNames from 'classnames';
import PlayerAvatar from './PlayerAvatar';
import CardImage from '../../Images/CardImage';
import { useHud } from '../../../hudStore';
import { overlaySettingsOf } from '../../../hud';
import { claimFlights, motionSettingOff, setFlipPaused } from '../../../flip';
import { aroundTheTable } from '../seatOrder';
import { useLayoutMode } from './useBoardLayout';
import { remSize } from '../../../cardScale';
import { nameOf } from './followTarget';
import { Heading, OverlayBackdrop, OverlayButton, zoom } from './OverlayParts';
import { Constants } from '../../../constants';

// The board's overlays: the game's start and end (major: wait for a button) and what happens in it (minor: continue
// on a timer). Each shows once per game (kept in sessionStorage, so a refresh does not repeat it).

// The game menu's View result: the end overlay again, played from the start
const replayListeners = new Set();
export const replayEndOverlay = () => replayListeners.forEach((listener) => listener());

const eliminatedReasons = {
    decked: 'Ran out of cards',
    concede: 'Conceded',
    left: 'Left the game',
    disconnected: 'Disconnected',
    time: 'Ran out of time'
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
const useOverlays = ({
    gameId,
    players,
    phase,
    melee,
    gameOver,
    roundsEnded,
    initiativeRound,
    enabled
}) => {
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

    useEffect(() => {
        if (!enabled || !gameOver) {
            return;
        }
        const replay = () => {
            queued.current.add('over');
            setQueue((current) =>
                current.some((item) => item.key === 'over')
                    ? current
                    : [...current.filter((item) => item.major), { key: 'over', major: 'over' }]
            );
        };
        replayListeners.add(replay);
        return () => replayListeners.delete(replay);
    }, [enabled, gameOver]);

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
        last.current = { plots, plotOf, titles, eliminated, roundsEnded, initiativeRound };
        if (revealed) {
            // Tells this reveal's initiative from the last one
            add({
                key: revealKey,
                minor: 'plots',
                cards: revealed,
                initiativeBefore: before?.initiativeRound
            });
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
        initiativeRound,
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

const cardRound = 'rounded-[calc(var(--card-scale)*0.25rem)]';
const cardShadow = `${cardRound} shadow-[0_8px_22px_rgba(0,0,0,0.7)]`;

// A player's faction card with their agendas tucked behind, tossed in at toss ms, the agendas just after
const agendaGap = 110;
const agendasOf = (player) => (player.agendas || []).filter((agenda) => agenda?.code);
const cardsOf = (player, toss) => {
    const name = nameOf(player);
    return [
        {
            id: `${name}:faction`,
            code: player.faction?.code || 'cardback',
            type: 'faction',
            toss
        },
        ...agendasOf(player).map((agenda, index) => ({
            id: `${name}:${agenda.code}:${index}`,
            code: agenda.code,
            type: 'agenda',
            toss: toss + agendaGap * (index + 1)
        }))
    ];
};
// Where each card lies. Stacked: the faction in front, the agendas tucked behind it in a line, each a little askew.
// Fanned: side by side in the same order, gap px apart (less than nothing where room is short, so they overlap).
const cardWidthRem = 4;
const placeStyle = (cards, place, fanGap) => {
    const card = cards[place];
    const zIndex = 10 - place;
    if (fanGap !== undefined) {
        return {
            zIndex,
            marginLeft: place === 0 ? '0px' : `${fanGap}px`,
            marginTop: '0px',
            rotate: `${tiltOf(card.id, 0, 1.5)}deg`,
            '--nudge': 0
        };
    }
    // --nudge: how far towards its fanned place a card leans under a mouse (overlay-fan-card)
    if (place === 0) {
        return {
            zIndex,
            marginLeft: '0px',
            marginTop: '0px',
            rotate: `${tiltOf(card.id, -3)}deg`,
            '--nudge': 0
        };
    }
    // Every agenda at the same drop and nearly the same tilt, so they lie level with each other: a card tilted more
    // lifts its corner higher
    return {
        zIndex,
        marginLeft: 'calc(var(--card-scale) * -2.6rem)',
        marginTop: 'calc(var(--card-scale) * 0.9rem)',
        rotate: `${tiltOf(card.id, 4, 1)}deg`,
        '--nudge': place
    };
};
// fanRoom: px for the cards to fan out across, or nothing to keep them stacked
// shadow false: the cards cast none of their own, where one is cast round the whole arrangement
const PlayerCards = ({ player, out = false, scale, toss, fanRoom, shadow = true, className }) => {
    const cards = cardsOf(player, toss);
    const look = shadow ? cardShadow : cardRound;
    const width = cardWidthRem * remSize() * scale;
    const fanGap =
        fanRoom === undefined
            ? undefined
            : Math.min(
                  0.5 * remSize() * scale,
                  (fanRoom - cards.length * width) / Math.max(1, cards.length - 1)
              );
    return (
        <div
            className={classNames('relative flex shrink-0', className, {
                'grayscale brightness-50': out
            })}
            style={{ '--card-scale': scale }}
        >
            {cards.map((card, place) => (
                <div
                    key={card.id}
                    className='overlay-fan-card relative'
                    style={placeStyle(cards, place, fanGap)}
                >
                    {toss === undefined ? (
                        <CardImage code={card.code} type={card.type} className={look} />
                    ) : (
                        <Toss id={card.id} group={nameOf(player)} delay={card.toss}>
                            <CardImage code={card.code} type={card.type} className={look} />
                        </Toss>
                    )}
                </div>
            ))}
        </div>
    );
};

// The width of an element, kept up to date
const useWidth = (ref) => {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }
        const measure = () => setWidth(element.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [ref]);
    return width;
};

// A player's place at the start or end: their cards and name. With agendas, pressing it fans the cards out side by
// side (fanned, onFan; one player's at a time), and again stacks them; under a mouse a gold outline round the cards
// says so. fanRoom: px the fanned cards may take. crown: the winner's crown over the cards and a glow behind them,
// from crown ms. fade: the cards dim from fade ms (a loser's). children: what shows under the name.
const Seat = ({
    player,
    you,
    scale,
    toss,
    out = false,
    crown,
    fade,
    fanned = false,
    fanRoom,
    onFan,
    children
}) => {
    const count = 1 + agendasOf(player).length;
    const fans = count > 1 && !!onFan;
    const content = (
        <>
            <div className='relative flex flex-col items-center'>
                {crown !== undefined && (
                    <>
                        <div
                            aria-hidden
                            className='overlay-glory pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 rounded-full'
                            style={after(crown)}
                        />
                        {/* Set on the front card's top edge (a card is 4rem across at scale 1), a little askew */}
                        <Crown
                            className='overlay-crown pointer-events-none absolute z-20'
                            style={{
                                ...after(crown),
                                width: `${scale * 2.6}rem`,
                                left: `${scale * 0.5}rem`,
                                top: `${scale * -1.55}rem`,
                                rotate: '-10deg'
                            }}
                        />
                    </>
                )}
                <div
                    className={classNames({ 'overlay-dimmed': fade !== undefined })}
                    style={fade !== undefined ? after(fade) : undefined}
                >
                    {/* The ring outlines the cards themselves, so their shadow is cast outside it */}
                    <div className='[filter:drop-shadow(0_8px_14px_rgba(0,0,0,0.7))]'>
                        <div className={classNames({ 'overlay-ring': fans })}>
                            <PlayerCards
                                player={player}
                                scale={scale}
                                toss={toss}
                                out={out}
                                fanRoom={fans && fanned ? fanRoom : undefined}
                                shadow={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Name
                player={player}
                you={you}
                className='overlay-after'
                style={after(groupLanded(player, toss))}
            />
            {children}
        </>
    );
    const seatClass = 'flex min-w-0 max-w-full flex-col items-center gap-5';
    if (!fans) {
        return <div className={seatClass}>{content}</div>;
    }
    return (
        <button
            type='button'
            onClick={() => onFan(fanned ? null : nameOf(player))}
            aria-expanded={fanned}
            aria-label={
                fanned ? `Stack ${nameOf(player)}'s cards` : `Show all of ${nameOf(player)}'s cards`
            }
            title={fanned ? 'Stack the cards' : 'Show all the cards'}
            className={classNames(
                seatClass,
                'group pointer-events-auto cursor-pointer rounded-xl outline-none [-webkit-tap-highlight-color:transparent]'
            )}
        >
            {content}
        </button>
    );
};

// An avatar and a name, which shortens to fit the room it has; avatar false where a larger one is shown already
const Name = ({ player, size = 1.1, you = false, avatar = true, className, style }) => (
    <div
        className={classNames('flex min-w-0 max-w-full items-center', className)}
        style={{ gap: ui(0.5), ...style }}
        title={nameOf(player)}
    >
        {avatar && (
            <PlayerAvatar
                name={nameOf(player)}
                className='shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.6)]'
                style={{ width: ui(size * 1.75), height: ui(size * 1.75) }}
            />
        )}
        <span
            className={classNames(
                'min-w-0 truncate font-display font-semibold [text-shadow:0_2px_8px_#000]',
                you ? 'text-gold' : 'text-ink'
            )}
            style={{ fontSize: ui(size) }}
        >
            {nameOf(player)}
        </span>
    </div>
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
            className='hud-zoom pointer-events-auto relative min-w-[9rem] overflow-hidden rounded-md border border-gold bg-panel/90 px-6 py-1.5 text-sm font-semibold text-ink hover:bg-panel/90'
        >
            <span
                aria-hidden
                className='absolute inset-0 origin-left bg-gold/35'
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

// How tall an overlay's laid-out content is, padding included. Absolutely placed parts (the embers, a flash) are left
// out: they fill the overlay whatever its content.
const contentHeight = (root) => {
    const parts = [...root.children].filter(
        (child) => getComputedStyle(child).position !== 'absolute'
    );
    if (parts.length === 0) {
        return 0;
    }
    const boxes = parts.map((part) => part.getBoundingClientRect());
    const style = getComputedStyle(root);
    return (
        Math.max(...boxes.map((box) => box.bottom)) -
        Math.min(...boxes.map((box) => box.top)) +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom)
    );
};

// The overlay's card scale: a first guess from how many card widths across and rem tall it needs, then smaller until
// everything fits, as its text and buttons are zoomed by the interface's scale. Below a fair size for the cards, the
// overlay's interface gives way too (its own --ui-scale, a share of the page's), so neither is squeezed to nothing.
const minCardScale = 0.35;
const fairCardScale = 0.6;
const minInterfaceShare = 0.6;
const useCardScale = (rootRef, across, tall) => {
    const [scale, setScale] = useState(1);
    const [share, setShare] = useState(1);
    // Each measure is checked for fit, even where the first guess comes out as it was
    const [measured, setMeasured] = useState(0);
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
            setScale(Math.max(minCardScale, Math.min(2.4, Math.round(fit * 20) / 20)));
            setShare(1);
            setMeasured((count) => count + 1);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(root);
        return () => observer.disconnect();
    }, [rootRef, across, tall]);
    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        const page = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--ui-scale')
        );
        if (share < 1 && page) {
            root.style.setProperty('--ui-scale', String(page * share));
        } else {
            root.style.removeProperty('--ui-scale');
        }
        const need = contentHeight(root);
        const have = root.clientHeight;
        const atLeast = scale <= minCardScale && share <= minInterfaceShare;
        // Where even the least does not fit, the overlay scrolls from its top rather than cut off its ends
        const scrolls = atLeast && need > have + 2;
        root.style.justifyContent = scrolls ? 'flex-start' : '';
        root.style.overflowY = scrolls ? 'auto' : '';
        if (need <= have + 2 || atLeast) {
            return;
        }
        const step = Math.max(0.8, have / need);
        if (scale > fairCardScale) {
            setScale(Math.max(fairCardScale, Math.floor(scale * step * 20) / 20));
        } else if (share > minInterfaceShare) {
            setShare(Math.max(minInterfaceShare, Math.floor(share * step * 20) / 20));
        } else if (scale > minCardScale) {
            setScale(Math.max(minCardScale, Math.floor(scale * step * 20) / 20));
        }
    }, [rootRef, scale, share, measured]);
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

// Embers drifting up behind the start's table, as from a fire. Each one's place, size and pace is fixed, not random,
// so a render does not move them; steps of the golden ratio spread them evenly without lining them up.
const emberCount = 22;
const spread = (index, step) => (index * step * 0.618034) % 1;
const Embers = ({ ash = false }) => (
    <div aria-hidden className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        {Array.from({ length: emberCount }, (_, index) => {
            const duration = 7 + spread(index, 3) * 6;
            const size = 2 + (index % 3);
            return (
                <span
                    key={index}
                    className={classNames(
                        'overlay-ember absolute -bottom-2 rounded-full',
                        ash ? 'bg-white/25' : 'bg-gold'
                    )}
                    style={{
                        left: `${spread(index, 1) * 100}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        boxShadow: ash
                            ? '0 0 4px 1px rgba(161,161,170,0.4)'
                            : '0 0 6px 2px rgba(251,146,60,0.7)',
                        '--ember-x': `${Math.round(spread(index, 5) * 120 - 60)}px`,
                        '--ember-o': 0.35 + spread(index, 7) * 0.5,
                        animationDuration: `${duration.toFixed(2)}s`,
                        animationDelay: `-${(spread(index, 2) * duration).toFixed(2)}s`
                    }}
                />
            );
        })}
    </div>
);

// Two longswords crossed, swinging in to cross at delay ms, then glowing slowly as if in firelight. size: rem.
const CrossedSwords = ({ size, delay }) => {
    const sword = (side) => (
        <g className='overlay-sword' style={{ '--sword-side': side, animationDelay: `${delay}ms` }}>
            <path d='M50 4 L54.5 13 L54.5 66 L45.5 66 L45.5 13 Z' fill='url(#overlay-blade)' />
            <path d='M50 14 L50 63' stroke='rgba(0,0,0,0.35)' strokeWidth='1.2' />
            <rect x='33' y='65' width='34' height='5' rx='2.5' fill='url(#overlay-gilt)' />
            <rect x='47.5' y='70' width='5' height='17' rx='1.5' fill='#4a2a12' />
            <circle cx='50' cy='91' r='4.5' fill='url(#overlay-gilt)' />
        </g>
    );
    return (
        <svg
            aria-hidden
            viewBox='0 0 100 100'
            className='overlay-swords pointer-events-none overflow-visible'
            style={{
                width: ui(size),
                height: ui(size),
                animationDelay: `${delay}ms, ${delay + 600}ms`
            }}
        >
            <defs>
                <linearGradient id='overlay-blade' x1='0' x2='1'>
                    <stop offset='0' stopColor='#f4f4f5' />
                    <stop offset='0.5' stopColor='#a1a1aa' />
                    <stop offset='1' stopColor='#52525b' />
                </linearGradient>
                <linearGradient id='overlay-gilt' x1='0' x2='0' y1='0' y2='1'>
                    <stop offset='0' stopColor='#fde68a' />
                    <stop offset='1' stopColor='#b45309' />
                </linearGradient>
            </defs>
            {sword(1)}
            {sword(-1)}
        </svg>
    );
};

// How wide a player's cards may fan out: a seat's share of the table (the overlay is padded 1rem each side). In a
// joust across the screen each seat takes at most 40%; in a melee a column of Rows, gap rem apart.
const fanRoomOf = (width, { melee, portrait, columns, gap }) => {
    const inner = width - 2 * remSize();
    if (melee) {
        return (inner - (columns - 1) * gap * remSize()) / columns;
    }
    return portrait ? inner : inner * 0.4;
};

// The players sit down: their cards tossed in, then their names, and in a joust VS between them. Pressing a player's
// cards fans them out.
const Start = ({ players, me, portrait, onClose }) => {
    const rootRef = useRef(null);
    const width = useWidth(rootRef);
    const [fanned, setFanned] = useState(null);
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
    const fanRoom = fanRoomOf(width, { melee, portrait, columns: columnsOf(rows), gap: 2.5 });
    const seat = (player, index) => (
        <Seat
            player={player}
            you={player === me}
            scale={scale}
            toss={tossOf(index)}
            fanned={fanned === nameOf(player)}
            fanRoom={fanRoom}
            onFan={setFanned}
        />
    );
    return (
        <div
            ref={rootRef}
            className='relative isolate flex h-full w-full flex-col items-center justify-center gap-6 p-4'
        >
            <Embers />
            {melee && (
                <div className='flex flex-col items-center'>
                    <CrossedSwords size={4.5} delay={0} />
                    <Heading className='overlay-after text-xl' style={after(0)}>
                        Melee · {players.length} players
                    </Heading>
                </div>
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
                                <div className='relative flex shrink-0 items-center justify-center'>
                                    <div className='absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2'>
                                        <CrossedSwords size={9} delay={allLanded} />
                                    </div>
                                    <div
                                        className='overlay-stamp font-display text-5xl font-semibold text-gold [text-shadow:0_0_24px_rgba(201,164,92,0.6),0_4px_0_#5a3c08]'
                                        style={{ animationDelay: `${allLanded}ms` }}
                                    >
                                        VS
                                    </div>
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

// A crown of gold, for the winner
const Crown = ({ className, style }) => (
    <svg aria-hidden viewBox='0 0 100 72' className={className} style={style}>
        <defs>
            <linearGradient id='overlay-crown-gold' x1='0' x2='0' y1='0' y2='1'>
                <stop offset='0' stopColor='#fef3c7' />
                <stop offset='0.45' stopColor='#fbbf24' />
                <stop offset='1' stopColor='#b45309' />
            </linearGradient>
        </defs>
        <path
            d='M10 58 L5 20 L29 40 L50 9 L71 40 L95 20 L90 58 Z'
            fill='url(#overlay-crown-gold)'
            stroke='#78350f'
            strokeWidth='2.5'
            strokeLinejoin='round'
        />
        <rect
            x='9'
            y='56'
            width='82'
            height='11'
            rx='3'
            fill='url(#overlay-crown-gold)'
            stroke='#78350f'
            strokeWidth='2.5'
        />
        {[
            [5, 20],
            [50, 9],
            [95, 20]
        ].map(([cx, cy]) => (
            <circle
                key={cx}
                cx={cx}
                cy={cy}
                r='4.5'
                fill='#fef3c7'
                stroke='#78350f'
                strokeWidth='2'
            />
        ))}
        <circle cx='50' cy='45' r='6' fill='#dc2626' stroke='#7f1d1d' strokeWidth='1.5' />
        <circle cx='29' cy='51' r='3.5' fill='#2563eb' stroke='#1e3a8a' strokeWidth='1.2' />
        <circle cx='71' cy='51' r='3.5' fill='#16a34a' stroke='#14532d' strokeWidth='1.2' />
    </svg>
);

const placeNames = ['1st', '2nd', '3rd'];
const placeOf = (standing) => placeNames[standing - 1] ?? `${standing}th`;

// The game's end: who won, said plainly, over everyone's cards (in a joust both players, the winner's larger and
// crowned; in a melee everyone, by place), each with their power. Rematch and Continue playing when the game offers
// them.
const Over = ({ players, me, portrait, winners, buttons, onButtonClick, onClose }) => {
    const dispatch = useDispatch();
    const rootRef = useRef(null);
    const width = useWidth(rootRef);
    const [fanned, setFanned] = useState(null);
    const melee = players.length > 2;
    const won = (player) => winners.includes(nameOf(player));
    const winning = players.filter(won);
    const placed = [...players].sort((a, b) => (a.standing ?? 99) - (b.standing ?? 99));
    const rows = melee ? orderedRows(placed, portrait) : null;
    // In a joust the winner leads: first across, on top in portrait
    const joust = melee ? [] : [...players].sort((a, b) => Number(won(b)) - Number(won(a)));
    const across = melee
        ? columnsOf(rows) * (widestGroup(players) + 2)
        : portrait
          ? widestGroup(players) + 2
          : players.reduce((sum, player) => sum + groupWidth(player), 0) + 10;
    const tall = melee ? 12 + rows.length * 13 : portrait ? 38 : 21;
    const scale = useCardScale(rootRef, across, tall);
    useToss(rootRef);
    const iWon = me && won(me);
    const title =
        winning.length === 0 ? 'No winner' : me ? (iWon ? 'Victory' : 'Defeat') : 'Game over';
    const winnerNames = winning.map((player) => (player === me ? 'You' : nameOf(player)));
    const headline =
        winning.length === 0
            ? 'The game ended without a winner'
            : `${winnerNames.join(' and ')} ${winning.length > 1 || winning[0] === me ? 'win' : 'wins'} the game`;
    // The losers' cards land first, the winner's last
    const order = melee ? [...placed].reverse() : [...joust].reverse();
    const tossOf = (player) => 150 + order.indexOf(player) * tossGap * 2.2;
    const allLanded = Math.max(
        300,
        ...players.map((player) => groupLanded(player, tossOf(player)))
    );
    const button = (arg) => buttons?.find((candidate) => candidate.arg === arg);
    const press = (arg) => {
        const found = button(arg);
        if (found) {
            onButtonClick(found);
        }
        onClose();
    };
    const sizeOf = (player) =>
        scale * (winning.length === 0 ? 1 : won(player) ? (melee ? 1.15 : 1.1) : melee ? 0.9 : 0.8);
    const fanRoom = fanRoomOf(width, {
        melee,
        portrait,
        columns: melee ? columnsOf(rows) : 1,
        gap: 2
    });
    const seat = (player) => {
        const winner = won(player);
        return (
            <Seat
                player={player}
                you={player === me}
                scale={sizeOf(player)}
                toss={tossOf(player)}
                fanned={fanned === nameOf(player)}
                fanRoom={fanRoom}
                onFan={setFanned}
                out={player.eliminated}
                crown={winner ? allLanded : undefined}
                fade={!winner && winning.length > 0 && !player.eliminated ? allLanded : undefined}
            >
                <div
                    className='overlay-after hud-zoom -mt-2 flex flex-col items-center gap-1'
                    style={after(groupLanded(player, tossOf(player)) + 100)}
                >
                    <span
                        className={classNames(
                            'flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-sm font-semibold tabular-nums',
                            winner
                                ? 'border-gold bg-gold/20 text-ink shadow-[0_0_12px_rgba(201,164,92,0.35)]'
                                : 'border-white/25 bg-panel/90 text-ink'
                        )}
                    >
                        {melee && player.standing && (
                            <span className={winner ? 'text-gold' : 'text-ink-faint'}>
                                {placeOf(player.standing)} ·
                            </span>
                        )}
                        {!melee && winner && <span className='text-gold'>Winner ·</span>}
                        {powerOf(player)} power
                    </span>
                    {player.eliminated && (
                        <span className='text-xs text-danger [text-shadow:0_1px_4px_#000]'>
                            {eliminatedReasons[player.eliminatedReason] ?? 'Eliminated'}
                        </span>
                    )}
                </div>
            </Seat>
        );
    };

    return (
        <div
            ref={rootRef}
            className={classNames(
                'relative isolate flex h-full w-full flex-col items-center justify-center gap-5 p-4 text-center',
                { 'pb-12': portrait }
            )}
        >
            <Embers />
            <div className='flex max-w-full flex-col items-center gap-2'>
                <div
                    className={classNames(
                        'overlay-stamp max-w-full break-words font-display font-semibold [text-shadow:0_0_24px_rgba(201,164,92,0.45),0_4px_0_#000]',
                        zoom,
                        melee ? 'text-4xl' : 'text-5xl',
                        me && !iWon && winning.length > 0 ? 'text-danger' : 'text-gold'
                    )}
                    style={{ animationDelay: `${allLanded}ms` }}
                >
                    {title}
                </div>
                <div
                    className='overlay-after hud-zoom max-w-full break-words font-display text-xl font-semibold text-ink [text-shadow:0_2px_8px_#000]'
                    style={after(allLanded + 250)}
                >
                    {headline}
                </div>
            </div>
            {melee ? (
                <Rows rows={rows} gap={2} keyOf={nameOf} render={seat} />
            ) : (
                <div
                    className={classNames(
                        'flex w-full items-center justify-center',
                        portrait ? 'flex-col gap-8' : 'gap-16'
                    )}
                    style={{ paddingTop: `${scale}rem` }}
                >
                    {joust.map((player) => (
                        <div
                            key={nameOf(player)}
                            className={classNames(
                                'flex min-w-0 justify-center',
                                portrait ? 'max-w-full' : 'max-w-[40%]'
                            )}
                        >
                            {seat(player)}
                        </div>
                    ))}
                </div>
            )}
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
            {/* The game is over, so leaving needs no confirming. Small and set apart from the buttons, so it is not
                pressed by mistake: on a phone in portrait, at the foot of the screen. */}
            <button
                type='button'
                onClick={() => dispatch(sendLeaveGameMessage())}
                className={classNames(
                    'overlay-after hud-zoom pointer-events-auto flex items-center gap-1 rounded px-2 py-1 text-[0.6rem] font-semibold text-danger [text-shadow:0_1px_4px_#000] hover:text-danger hover:underline',
                    portrait
                        ? 'absolute bottom-[calc(0.5rem+var(--safe-bottom))] left-1/2 -translate-x-1/2'
                        : 'mt-3'
                )}
                style={after(allLanded + 600)}
            >
                <FontAwesomeIcon icon={faRightFromBracket} />
                Leave game
            </button>
        </div>
    );
};

// Standings on power, most first (ties in seat order), each with their progress towards winning
const winningPower = 15;
const byPower = (players) =>
    aroundTheTable(players[0], players).sort((a, b) => powerOf(b) - powerOf(a));
const standingToss = (index) => 150 + index * tossGap;

// Each player in turn, by avatar and name, their power counting up once they are in. leads: ahead on power, shown
// by a small crown once their power has counted up, and a faint glow on their bar.
const standingShown = (index) => standingToss(index) + 420;
const countTime = 800;
const Standing = ({ player, me, portrait, index, leads = false }) => {
    const landed = standingShown(index);
    return (
        <div
            className={classNames(
                'overlay-after flex min-w-0 max-w-full',
                portrait
                    ? 'w-full items-center justify-between gap-3'
                    : 'flex-col items-center gap-2'
            )}
            style={after(standingToss(index))}
        >
            <Name player={player} size={portrait ? 1.1 : 1.3} you={player === me} />
            <div
                className={classNames(
                    'flex min-w-0 shrink-0 flex-col gap-1',
                    portrait ? 'items-end' : 'items-center'
                )}
            >
                <div className={classNames('flex items-baseline gap-2 leading-none', zoom)}>
                    {leads && (
                        <Crown
                            className='overlay-pop w-6 self-center'
                            style={{ ...after(landed + countTime), rotate: '-10deg' }}
                        />
                    )}
                    <span className='font-display text-3xl font-semibold tabular-nums text-gold'>
                        <CountUp value={powerOf(player)} delay={landed} />
                    </span>
                    <span className='text-xs font-semibold text-ink-faint [text-shadow:0_1px_4px_#000]'>
                        power
                    </span>
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
                            className={classNames('overlay-grow h-full rounded-full', {
                                'bg-gold': !leads,
                                'bg-gold shadow-[0_0_8px_rgba(201,164,92,0.8)]': leads
                            })}
                            style={after(landed)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Whoever has the most power leads, unless everyone is level
const leadersOf = (ranked) => {
    const top = powerOf(ranked[0] ?? {});
    const leaders = ranked.filter((player) => powerOf(player) === top);
    return top > 0 && leaders.length < ranked.length ? leaders : [];
};
const Standings = ({ ranked, me, portrait }) => {
    const leaders = leadersOf(ranked);
    return portrait ? (
        <div className='flex w-full max-w-md flex-col items-stretch gap-3'>
            {ranked.map((player, index) => (
                <Standing
                    key={nameOf(player)}
                    player={player}
                    me={me}
                    portrait
                    index={index}
                    leads={leaders.includes(player)}
                />
            ))}
        </div>
    ) : (
        <Rows
            rows={orderedRows(ranked)}
            gap={2.5}
            keyOf={nameOf}
            render={(player, index) => (
                <Standing player={player} me={me} index={index} leads={leaders.includes(player)} />
            )}
        />
    );
};

const SwordsIcon = ({ className }) => (
    <svg
        aria-hidden
        viewBox='0 0 20 20'
        className={className}
        style={{ width: '1em', height: '1em' }}
    >
        <g fill='currentColor'>
            <path d='M2 2 L5 2 L13.5 10.5 L10.5 13.5 L2 5 Z' />
            <path d='M18 2 L15 2 L6.5 10.5 L9.5 13.5 L18 5 Z' />
            <path d='M10.5 12 L15 16.5 L16.5 15 L12 10.5 Z M3.5 15 L5 16.5 L9.5 12 L8 10.5 Z' />
            <circle cx='16.8' cy='16.8' r='1.6' />
            <circle cx='3.2' cy='16.8' r='1.6' />
        </g>
    </svg>
);
const relationLooks = {
    Rivals: {
        icon: SwordsIcon,
        row: 'border-danger/70 bg-danger/15 text-danger [--relation-glow:rgb(229_122_114)]',
        label: 'text-danger'
    },
    Supports: {
        icon: ({ className }) => <FontAwesomeIcon icon={faHandshake} className={className} />,
        row: 'border-success/70 bg-success/15 text-success [--relation-glow:rgb(95_167_119)]',
        label: 'text-success'
    }
};
// Whom a player's title rivals and supports among the players still in, a pill each with every player's avatar
const Relations = ({ player, live, me, delay }) => {
    const among = (titles) =>
        live.filter((other) => other !== player && titles?.includes(other.title?.name));
    const lines = [
        { label: 'Rivals', players: among(player.title?.rivals) },
        { label: 'Supports', players: among(player.title?.supports) }
    ].filter((line) => line.players.length > 0);
    if (lines.length === 0) {
        return null;
    }
    return (
        <div
            className='flex min-w-0 max-w-full flex-col items-center'
            style={{ gap: ui(0.375), fontSize: ui(0.75) }}
        >
            {lines.map((line, index) => {
                const look = relationLooks[line.label];
                return (
                    <div
                        key={line.label}
                        className='overlay-pop flex min-w-0 max-w-full'
                        style={after(delay + index * 160)}
                    >
                        <div
                            className={classNames(
                                'overlay-relation relative flex min-w-0 max-w-full items-center rounded-full border shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
                                look.row
                            )}
                            style={{
                                gap: ui(0.375),
                                padding: `${ui(0.125)} ${ui(0.5)} ${ui(0.125)} ${ui(0.375)}`,
                                '--relation-delay': `${delay + index * 160}ms`
                            }}
                            title={`${line.label} ${line.players.map(nameOf).join(', ')}`}
                        >
                            <look.icon className={look.label} />
                            <span className={classNames('shrink-0 font-bold', look.label)}>
                                {line.label}
                            </span>
                            <span className='flex min-w-0 items-center' style={{ gap: ui(0.5) }}>
                                {line.players.map((other) => (
                                    <span
                                        key={nameOf(other)}
                                        className='flex min-w-0 items-center'
                                        style={{ gap: ui(0.25) }}
                                    >
                                        <PlayerAvatar
                                            name={nameOf(other)}
                                            className='shrink-0'
                                            style={{ width: ui(1.125), height: ui(1.125) }}
                                        />
                                        <span
                                            className={classNames('truncate font-semibold', {
                                                'text-gold': other === me
                                            })}
                                        >
                                            {other === me ? 'You' : nameOf(other)}
                                        </span>
                                    </span>
                                ))}
                            </span>
                        </div>
                    </div>
                );
            })}
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

// When each initiative step shows (ms from the overlay opening): the totals, then for a tie the tied totals, the tied
// players' power, and where power ties too, the coin
const initiativePlan = (result, from) => {
    const top = Math.max(...result.values.map((value) => value.initiative));
    const tied = result.initiativeTied
        ? result.values.filter((value) => value.initiative === top).map((value) => value.name)
        : [];
    const pillsAt = from;
    if (tied.length === 0) {
        const decideAt = pillsAt + 400;
        return { tied, powerTied: [], pillsAt, decideAt, doneAt: decideAt + 350 };
    }
    const tiedAt = pillsAt + 350;
    const powerAt = tiedAt + 300;
    const tiedValues = result.values.filter((value) => tied.includes(value.name));
    const lowest = Math.min(...tiedValues.map((value) => value.power));
    const powerTied =
        result.powerTied && !result.chosenBy
            ? tiedValues.filter((value) => value.power === lowest).map((value) => value.name)
            : [];
    const powerTiedAt = powerAt + 250;
    const strikeAt = powerTied.length > 0 ? powerTiedAt + 200 : undefined;
    const coinAt = strikeAt !== undefined ? strikeAt + 200 : undefined;
    const decideAt =
        coinAt !== undefined
            ? coinAt + coinTime + 50
            : result.chosenBy
              ? tiedAt + 300
              : powerAt + 300;
    return {
        tied,
        powerTied,
        pillsAt,
        tiedAt,
        powerAt,
        powerTiedAt,
        strikeAt,
        coinAt,
        decideAt,
        doneAt: decideAt + 350
    };
};

// A stat pill: ringed gold as tied from markAt, green or faded from winAt. The rings and colours sit on inner spans,
// as the pop-in animation holds the outer one.
const InitiativeStat = ({ stat, value, delay, markAt, winAt, win }) => (
    <span className='overlay-pop inline-flex' style={after(delay)}>
        <span
            className={classNames(
                'inline-flex rounded-full',
                markAt !== undefined && [
                    'overlay-tie',
                    win ? 'overlay-tie-won' : 'overlay-tie-lost'
                ]
            )}
            style={{ '--tie-delay': `${markAt ?? 0}ms`, '--win-delay': `${winAt}ms` }}
        >
            <span
                className={classNames(
                    'inline-flex items-center rounded-full border border-white/25 bg-panel/90 font-bold tabular-nums text-ink',
                    win ? 'overlay-win' : 'overlay-lose'
                )}
                style={{
                    gap: ui(0.25),
                    padding: `${ui(0.125)} ${ui(0.5)} ${ui(0.125)} ${ui(0.25)}`,
                    fontSize: ui(1)
                }}
                title={stat === 'initiative' ? 'Initiative' : 'Power'}
            >
                <img
                    src={Constants.StatIconImagePaths[stat]}
                    alt=''
                    style={{ width: ui(1.25), height: ui(1.25) }}
                />
                {value}
            </span>
        </span>
    </span>
);

// The coin for a tie nothing else broke. Both faces show "?" while it spins; only the winner's avatar shows once it
// lands, so a tie of any size shows one face.
const coinTime = 800;
const coinFace =
    'absolute inset-0 flex items-center justify-center overflow-hidden rounded-full border-[3px] border-gold bg-[radial-gradient(circle_at_35%_30%,#fde68a,#d97706_60%,#92400e)] font-display font-semibold text-gold shadow-[0_6px_16px_rgba(0,0,0,0.6)] [backface-visibility:hidden]';
const Coin = ({ winner, delay }) => (
    <div
        className='relative'
        style={{
            width: ui(3.5),
            height: ui(3.5),
            perspective: ui(30),
            '--coin-delay': `${delay}ms`
        }}
    >
        <div
            aria-hidden
            className='overlay-coin-slam pointer-events-none absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold'
        />
        <div className='overlay-coin-toss h-full w-full'>
            <div className='overlay-coin relative h-full w-full [transform-style:preserve-3d]'>
                <div className={coinFace}>
                    <span style={{ fontSize: ui(1.5) }}>?</span>
                </div>
                <div className={classNames(coinFace, '[transform:rotateX(180deg)]')}>
                    <span style={{ fontSize: ui(1.5) }}>?</span>
                    <PlayerAvatar
                        name={winner}
                        className='overlay-coin-face absolute inset-0 h-full w-full'
                    />
                </div>
            </div>
        </div>
    </div>
);

// A player's initiative, and their power where a tie came down to it
const InitiativeStats = ({ value, plan, win, showPower }) => {
    const tied = plan.tied.includes(value.name);
    return (
        <div className='flex items-center' style={{ gap: ui(0.375) }}>
            <InitiativeStat
                stat='initiative'
                value={value.initiative}
                delay={plan.pillsAt}
                markAt={tied ? plan.tiedAt : undefined}
                winAt={plan.decideAt}
                win={win}
            />
            {tied && showPower && (
                <InitiativeStat
                    stat='totalPower'
                    value={value.power}
                    delay={plan.powerAt}
                    markAt={plan.powerTied.includes(value.name) ? plan.powerTiedAt : undefined}
                    winAt={plan.decideAt}
                    win={win}
                />
            )}
        </div>
    );
};

const verdictLine =
    'overlay-after max-w-full text-center text-xs font-semibold text-gold/90 [text-shadow:0_1px_6px_#000]';
// Under the plots: the tie line (struck through when a coin decides), the coin, then who won
const InitiativeVerdict = ({ result, plan, me }) => {
    const nameFor = (name) => (me && name === nameOf(me) ? 'You' : name);
    const winner = nameFor(result.winner);
    const chooser = result.chosenBy && nameFor(result.chosenBy);
    return (
        <div className='hud-zoom flex max-w-full flex-col items-center gap-1.5'>
            {plan.tied.length > 0 && (
                <div className={verdictLine} style={after(plan.tiedAt)}>
                    <span
                        className={classNames('relative inline-block', {
                            'overlay-strike': plan.strikeAt !== undefined
                        })}
                        style={{ '--strike-delay': `${plan.strikeAt ?? 0}ms` }}
                    >
                        {chooser
                            ? `Tied · ${chooser} ${chooser === 'You' ? 'choose' : 'chooses'}`
                            : 'Tied · lowest power wins'}
                    </span>
                </div>
            )}
            {plan.strikeAt !== undefined && (
                <div className={verdictLine} style={after(plan.strikeAt)}>
                    Still tied · winner chosen at random
                </div>
            )}
            {plan.coinAt !== undefined && <Coin winner={result.winner} delay={plan.coinAt} />}
            <div
                className='overlay-after max-w-full text-center font-display text-lg font-semibold text-gold [text-shadow:0_1px_6px_#000]'
                style={after(plan.decideAt)}
            >
                {`${winner} ${winner === 'You' ? 'win' : 'wins'} initiative`}
            </div>
        </div>
    );
};

// The overlays during the game: plots revealed, titles chosen, the end of a round, a player eliminated. Continue's
// time starts once each has played out.
const Minor = ({ overlay, initiative, players, me, portrait, seconds, released, onLanded }) => {
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
        plots: [columns * 7.2, 10 + seats.length * 9],
        titles: [columns * 6, 7 + seats.length * 12.5],
        round: portrait
            ? [14, 4 + live.length * 7]
            : [columnsOf(rankedRows) * 7.5, 5 + rankedRows.length * 13],
        out: [out ? groupWidth(out) + 4 : 10, 16]
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

    // An eliminated player's cards are tossed in before the seal comes down on them (overlay-seal, from 750ms)
    const outToss = 100;
    const flipOf = (index) => flyTime + 80 + index * 130;
    const titleLanded = (index) => flyTime + 60 + index * 90;
    const fresh =
        overlay.minor === 'plots' && initiative && initiative.round !== overlay.initiativeBefore
            ? initiative
            : null;
    const plan = fresh && initiativePlan(fresh, flipOf(live.length - 1) + flipTime);
    const valueOf = (player) => fresh?.values.find((value) => value.name === nameOf(player));
    const intro = {
        plots: plan ? plan.doneAt : flipOf(live.length - 1) + flipTime,
        titles: titleLanded(live.length - 1) + 400,
        round: standingShown(ranked.length - 1),
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
                'relative isolate flex h-full w-full flex-col items-center justify-center gap-5 p-4',
                {
                    'overlay-leaving': leaving,
                    'overlay-landed': released
                }
            )}
            style={{ '--card-scale': scale }}
        >
            {out && <Embers ash />}
            {out && (
                <div
                    aria-hidden
                    className='overlay-flash pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(229,122,114,0.4),transparent_60%)]'
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
                            {plan && valueOf(player) && (
                                <InitiativeStats
                                    value={valueOf(player)}
                                    plan={plan}
                                    win={fresh.winner === nameOf(player)}
                                    showPower={!fresh.chosenBy}
                                />
                            )}
                        </div>
                    )}
                />
            )}
            {plan && <InitiativeVerdict result={fresh} plan={plan} me={me} />}
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
                                <CardImage
                                    code={player.title?.code}
                                    type='title'
                                    className={cardShadow}
                                />
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
            {overlay.minor === 'round' && <Standings ranked={ranked} me={me} portrait={portrait} />}
            {out && (
                <div className='overlay-quake flex min-w-0 max-w-full flex-col items-center gap-6'>
                    <div className='relative'>
                        <div className='overlay-thud'>
                            <div className='overlay-ashen'>
                                <PlayerCards player={out} scale={scale} toss={outToss} />
                            </div>
                        </div>
                        <div
                            className='overlay-seal pointer-events-none absolute left-1/2 top-1/2 z-30'
                            style={{
                                translate: '-50% -50%',
                                rotate: `${tiltOf(`${nameOf(out)}:seal`, -14, 4)}deg`
                            }}
                        >
                            <div className='rounded-md border-[3px] border-danger bg-danger/15 p-[3px] shadow-[0_0_0_2px_rgba(0,0,0,0.45),0_12px_30px_rgba(0,0,0,0.85)]'>
                                <div
                                    className='rounded-sm border border-danger/80 px-3 py-0.5 font-display font-semibold text-danger [text-shadow:0_1px_0_rgba(0,0,0,0.6)]'
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
                        className='overlay-after hud-zoom flex max-w-full flex-wrap items-center justify-center gap-x-2 rounded-full border border-danger/40 bg-panel/90 px-4 py-1.5 text-sm font-medium text-ink shadow-[0_6px_20px_rgba(0,0,0,0.6)]'
                        style={after(1350)}
                    >
                        <span className='text-danger'>
                            {eliminatedReasons[out.eliminatedReason] ?? 'Eliminated'}
                        </span>
                        <span aria-hidden className='text-danger'>
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
            data-board-surface=''
            className={classNames(
                'overlay-root pointer-events-none absolute inset-0 overflow-hidden transition-opacity ease-out',
                { 'opacity-0': fading }
            )}
            style={{ transitionDuration: `${fadeTime}ms` }}
        >
            <HideCards uuids={held} />
            {
                <>
                    <OverlayBackdrop major={major} />
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
                                    buttons={buttons}
                                    onButtonClick={onButtonClick}
                                    onClose={close}
                                />
                            </div>
                        )}
                        {overlay.minor && (
                            <Minor
                                overlay={overlay}
                                initiative={game?.initiative}
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
        initiativeRound: currentGame?.initiative?.round,
        enabled: overlays.enabled
    });
    const me = isPlaying ? thisPlayer : null;
    const portrait = mode === 'narrow';
    const showing = overlays.enabled && !!current;
    useLayoutEffect(() => {
        setFlipPaused(showing);
        return () => setFlipPaused(false);
    }, [showing]);

    if (!overlays.enabled) {
        return null;
    }
    if (current) {
        // Over the whole screen, above the board's panels and popups and the site's own (the chat and navbar too):
        // they are drawn outside the board, so nothing inside it could stand above them
        return (
            <>
                <HideCards uuids={waiting} />
                {createPortal(
                    <div className='pointer-events-none fixed inset-0 z-[440]'>
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
                    </div>,
                    document.body
                )}
            </>
        );
    }
    return <HideCards uuids={waiting} />;
};

export default BoardOverlays;
