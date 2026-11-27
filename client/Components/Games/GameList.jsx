import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import { Button } from '@heroui/react';
import GameActionButton from '../Site/GameActionButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import {
    joinPasswordGame,
    sendJoinGameMessage,
    sendRemoveGameMessage,
    sendWatchGameMessage
} from '../../redux/reducers/lobby';
import { GameFormats } from '../../constants';
import GameTypeMark from './GameTypeMark';
import ThronesIcon from '../GameBoard/ThronesIcon';
import UserAvatar from '../Site/UserAvatar';
import CardImage from '../Images/CardImage';
import CardHoverable from '../Images/CardHoverable';
import Tag from '../Site/Tag';

const labelFor = (list, name) => list.find((item) => item.name === name)?.label ?? name;

const gameAge = (createdAt) => {
    const minutes = Math.max(0, moment().diff(moment(createdAt), 'minutes'));
    if (minutes < 1) {
        return 'Just now';
    }

    return minutes < 60
        ? `${minutes} min`
        : `${Math.floor(minutes / 60)} hr ${String(minutes % 60).padStart(2, '0')}`;
};

const playersBySeat = (game) => Object.values(game.players).sort((a, b) => a.seatNo - b.seatNo);

const TypeAndFormat = ({ game }) => (
    <span className='flex shrink-0 items-center gap-1.5 text-sm font-medium'>
        <GameTypeMark gameType={game.gameType} />
        <span className='text-ink'>{labelFor(GameFormats, game.gameFormat)}</span>
    </span>
);

// The event and the game's options, after its type and format unless they are shown elsewhere
const GameDetails = ({ game, isAdmin, showType = true, className }) => {
    const flags = [
        game.needsPassword && (
            <Tag key='password' className='gap-1'>
                <FontAwesomeIcon icon={faLock} className='text-[0.8em]' />
                Password
            </Tag>
        ),
        game.useGameTimeLimit && <Tag key='time'>Time limit</Tag>,
        game.useChessClocks && <Tag key='clocks'>Chess clocks</Tag>,
        game.showHand && <Tag key='hands'>Shows hands</Tag>,
        !game.allowSpectators && <Tag key='spectators'>No spectators</Tag>,
        game.started && game.spectators?.length > 0 && (
            <Tag key='watching'>{game.spectators.length} watching</Tag>
        ),
        isAdmin && game.node && <Tag key='node'>{game.node}</Tag>
    ].filter(Boolean);

    if (!showType && !game.event?.name && flags.length === 0) {
        return null;
    }

    return (
        <div
            className={classNames(
                'flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-dim',
                className
            )}
        >
            {showType && <TypeAndFormat game={game} />}
            {game.event?.name && (
                <span className='inline-flex items-center gap-1.5 border border-gold-line px-1.5 py-px text-xs text-gold'>
                    <FontAwesomeIcon icon={faTrophy} className='text-[0.85em]' />
                    {game.event.name}
                </span>
            )}
            {flags}
        </div>
    );
};

const OpenGame = ({ game, canJoin, canWatch, isAdmin, onJoin, onWatch, onRemove }) => {
    const players = playersBySeat(game);
    const openSeats = Math.max(0, game.maxPlayers - players.length);
    const isStarting = !canJoin && game.full;

    return (
        <article
            className={classNames(
                'flex flex-col gap-2 border px-4 py-3.5',
                isStarting ? 'border-gold-hair bg-well' : 'border-gold-line bg-accent/[0.08]'
            )}
        >
            <div className='flex items-start justify-between gap-3'>
                <h3 className='min-w-0 break-words pt-1 font-medium text-ink'>{game.name}</h3>
                <div className='flex shrink-0 items-center gap-1'>
                    {isAdmin && (
                        <Button
                            size='sm'
                            variant='ghost'
                            className='text-danger'
                            onPress={onRemove}
                        >
                            Remove
                        </Button>
                    )}
                    {canJoin && (
                        <GameActionButton size='sm' onPress={onJoin}>
                            {game.maxPlayers > 2
                                ? `Join ${players.length}/${game.maxPlayers}`
                                : 'Join'}
                        </GameActionButton>
                    )}
                    {isStarting && canWatch && (
                        <GameActionButton size='sm' quiet onPress={onWatch}>
                            Watch
                        </GameActionButton>
                    )}
                </div>
            </div>
            <GameDetails game={game} isAdmin={isAdmin} />
            <div className='flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 text-sm'>
                {players.map((player) => (
                    <span key={player.name} className='flex min-w-0 items-center gap-1.5'>
                        <UserAvatar username={player.name} size='sm' />
                        <span className='truncate'>{player.name}</span>
                    </span>
                ))}
                {openSeats > 0 && (
                    <span className='italic text-ink-faint'>
                        {openSeats === 1 ? 'Open seat' : `${openSeats} open seats`}
                    </span>
                )}
                {isStarting && <span className='text-ink-faint'>Starting</span>}
                <span className='ms-auto text-xs tabular-nums text-ink-faint'>
                    {gameAge(game.createdAt)}
                </span>
            </div>
        </article>
    );
};

// A player's agenda as a card, with any further agendas (banners) fanned behind it and the faction as a badge on
// its corner. Hidden agendas (a private game) leave the faction on its own, in the same space.
const Seat = ({ player }) => {
    const agendas = player.agendas?.filter(Boolean) ?? [];

    return (
        <span className='flex min-w-0 items-center gap-1.5 sm:gap-2.5'>
            <span className='relative flex min-w-[2.35rem] shrink-0 py-0.5 sm:w-[2.9rem]'>
                {agendas.length > 0 ? (
                    agendas.map((code, index) => (
                        <span
                            key={code}
                            className={classNames('relative', index > 0 && '-ml-5')}
                            style={{ zIndex: agendas.length - index }}
                        >
                            <CardHoverable code={code}>
                                <CardImage
                                    code={code}
                                    className='rounded-sm shadow-[0_1px_3px_var(--frame-shadow)] [--card-scale:0.45]'
                                />
                            </CardHoverable>
                        </span>
                    ))
                ) : (
                    <span className='w-[1.8rem]' />
                )}
                {player.faction && (
                    <span
                        className={classNames(
                            'absolute flex items-center justify-center rounded-full',
                            agendas.length > 0
                                ? 'bottom-0 left-[1.05rem] z-10 h-5 w-5 border border-gold-hair bg-panel text-[0.8rem]'
                                : 'inset-y-0 left-0 w-[1.8rem] text-lg'
                        )}
                    >
                        <ThronesIcon icon={player.faction} />
                    </span>
                )}
            </span>
            <span className='truncate max-sm:text-sm' title={player.name}>
                {player.name}
            </span>
        </span>
    );
};

const GameInProgress = ({ game, canWatch, isAdmin, onWatch, onRemove }) => {
    const players = playersBySeat(game);
    const isJoust = players.length === 2;

    return (
        <li className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-gold-hair py-2.5 sm:col-span-4 sm:px-1 sm:grid-cols-subgrid'>
            <div className='col-span-2 grid min-w-0 grid-cols-2 items-center gap-x-2 sm:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] gap-y-1.5 sm:col-span-1 sm:gap-x-3'>
                {players.map((player, index) => (
                    <React.Fragment key={player.name}>
                        {index === 1 && isJoust && (
                            <span className='hidden text-center font-display text-xs text-ink-faint sm:block'>
                                vs
                            </span>
                        )}
                        <span
                            className={classNames(
                                'min-w-0',
                                index % 2 === 0 ? 'col-start-1' : 'col-start-2 sm:col-start-3'
                            )}
                        >
                            <Seat player={player} />
                        </span>
                    </React.Fragment>
                ))}
            </div>
            <div className='col-start-1 row-start-2 min-w-0 sm:col-start-auto sm:row-start-auto'>
                <div className='flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-2.5'>
                    <TypeAndFormat game={game} />
                    <span className='truncate text-sm text-ink-dim'>{game.name}</span>
                </div>
                <GameDetails game={game} isAdmin={isAdmin} showType={false} className='mt-1' />
            </div>
            <span className='hidden text-xs tabular-nums text-ink-faint sm:block'>
                {gameAge(game.createdAt)}
            </span>
            <div className='col-start-2 row-start-2 flex items-center justify-end gap-1 sm:col-start-auto sm:row-start-auto'>
                {isAdmin && (
                    <Button size='sm' variant='ghost' className='text-danger' onPress={onRemove}>
                        Remove
                    </Button>
                )}
                {canWatch && (
                    <GameActionButton size='sm' quiet onPress={onWatch}>
                        Watch
                    </GameActionButton>
                )}
            </div>
        </li>
    );
};

const SectionHeading = ({ children, count }) => (
    <h3 className='flex items-baseline gap-2 font-display text-lg font-semibold text-gold'>
        {children}
        <span className='font-sans text-sm font-normal tabular-nums text-ink-faint'>{count}</span>
    </h3>
);

const GameList = ({ gameFilter, games, onJoinOrWatch = () => true }) => {
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const isAdmin = !!user?.permissions?.canManageGames;

    const joinGame = useCallback(
        (game) => {
            if (!user) {
                toast.error('Please login before trying to join a game');
                return;
            }

            if (game.needsPassword) {
                dispatch(joinPasswordGame(game, 'Join'));
            } else {
                dispatch(sendJoinGameMessage(game.id));
            }
            onJoinOrWatch();
        },
        [user, dispatch, onJoinOrWatch]
    );

    const watchGame = useCallback(
        (game) => {
            if (!user) {
                toast.error('Please login before trying to watch a game');
                return;
            }

            if (game.needsPassword && !isAdmin) {
                dispatch(joinPasswordGame(game, 'Watch'));
            } else {
                dispatch(sendWatchGameMessage(game.id));
            }
            onJoinOrWatch();
        },
        [user, isAdmin, dispatch, onJoinOrWatch]
    );

    const canWatch = (game) => !currentGame && (game.allowSpectators || isAdmin);
    const canJoin = (game) => !currentGame && !game.started && !game.full;

    const { open, inProgress } = useMemo(() => {
        const visible = games.filter(
            (game) =>
                gameFilter[game.gameType] !== false &&
                gameFilter[game.gameFormat] !== false &&
                (game.started || !game.gamePrivate || isAdmin)
        );
        const newestFirst = (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        return {
            open: visible
                .filter((game) => !game.started)
                .sort((a, b) => Number(a.full) - Number(b.full) || newestFirst(a, b)),
            inProgress: visible.filter((game) => game.started).sort(newestFirst)
        };
    }, [games, gameFilter, isAdmin]);

    if (games.length === 0) {
        return (
            <p className='py-8 text-center text-sm text-ink-dim'>
                No one is playing right now. Start a new game and others can join it.
            </p>
        );
    }

    if (open.length === 0 && inProgress.length === 0) {
        return (
            <p className='py-8 text-center text-sm text-ink-dim'>No games match your filters.</p>
        );
    }

    const handlers = (game) => ({
        isAdmin,
        canWatch: canWatch(game),
        onWatch: () => watchGame(game),
        onRemove: () => dispatch(sendRemoveGameMessage(game.id))
    });

    return (
        <div className='flex flex-col gap-7'>
            <section className='flex flex-col gap-3'>
                <SectionHeading count={open.length}>Looking for players</SectionHeading>
                {open.length === 0 ? (
                    <p className='text-sm text-ink-dim'>
                        No games are looking for players. Start one with New game.
                    </p>
                ) : (
                    <div className='grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3'>
                        {open.map((game) => (
                            <OpenGame
                                key={game.id}
                                game={game}
                                canJoin={canJoin(game)}
                                onJoin={() => joinGame(game)}
                                {...handlers(game)}
                            />
                        ))}
                    </div>
                )}
            </section>
            {inProgress.length > 0 && (
                <section className='flex flex-col gap-2'>
                    <SectionHeading count={inProgress.length}>Being played</SectionHeading>
                    <ul className='border-t border-gold-hair sm:grid sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_4.5rem_minmax(7.5rem,max-content)] sm:gap-x-4'>
                        {inProgress.map((game) => (
                            <GameInProgress key={game.id} game={game} {...handlers(game)} />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default GameList;
