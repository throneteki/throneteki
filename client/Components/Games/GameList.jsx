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
import { useGetCardsQuery } from '../../redux/middleware/api';
import { GameFormats } from '../../constants';
import GameTypeMark from './GameTypeMark';
import ThronesIcon from '../GameBoard/ThronesIcon';
import UserAvatar from '../Site/UserAvatar';

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

const GameDetails = ({ game, isAdmin, className }) => {
    const flags = [
        game.needsPassword && (
            <span key='password' className='flex items-center gap-1'>
                <FontAwesomeIcon icon={faLock} className='text-[0.7em]' />
                Password
            </span>
        ),
        game.useGameTimeLimit && <span key='time'>Time limit</span>,
        game.useChessClocks && <span key='clocks'>Chess clocks</span>,
        game.showHand && <span key='hands'>Shows hands</span>,
        game.started && game.spectators?.length > 0 && (
            <span key='watching'>{game.spectators.length} watching</span>
        ),
        isAdmin && game.node && <span key='node'>{game.node}</span>
    ].filter(Boolean);

    return (
        <div
            className={classNames(
                'flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-sm text-ink-dim',
                className
            )}
        >
            {game.event?.name && (
                <span className='inline-flex items-center gap-1.5 border border-gold-line px-1.5 py-px text-xs text-gold'>
                    <FontAwesomeIcon icon={faTrophy} className='text-[0.85em]' />
                    {game.event.name}
                </span>
            )}
            <GameTypeMark gameType={game.gameType} />
            <span>{labelFor(GameFormats, game.gameFormat)}</span>
            {flags.length > 0 && (
                <span className='flex flex-wrap items-center gap-x-2.5 text-xs text-ink-faint'>
                    {flags}
                </span>
            )}
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
                isStarting
                    ? 'border-gold-hair bg-white/[0.02]'
                    : 'border-gold-line bg-accent/[0.08]'
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

const GameInProgress = ({ game, cards, canWatch, isAdmin, onWatch, onRemove }) => {
    const players = playersBySeat(game);
    const agendaLabel = (player) =>
        player.agendas
            ?.map((code) => cards?.[code]?.label)
            .filter(Boolean)
            .join(', ');

    return (
        <li className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-gold-hair px-1 py-2.5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_4.5rem_7.5rem] sm:gap-x-4'>
            <div className='flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5'>
                {players.map((player, index) => (
                    <React.Fragment key={player.name}>
                        {index > 0 && players.length === 2 && (
                            <span className='font-display text-xs text-ink-faint'>vs</span>
                        )}
                        <span className='flex min-w-0 items-center gap-2'>
                            {player.faction && (
                                <ThronesIcon icon={player.faction} className='text-lg' />
                            )}
                            <span className='flex min-w-0 flex-col leading-tight'>
                                <span className='truncate'>{player.name}</span>
                                {agendaLabel(player) && (
                                    <span className='truncate text-xs text-ink-faint'>
                                        {agendaLabel(player)}
                                    </span>
                                )}
                            </span>
                        </span>
                    </React.Fragment>
                ))}
            </div>
            <div className='col-start-1 row-start-2 min-w-0 sm:col-start-auto sm:row-start-auto'>
                <span className='block truncate text-sm text-ink-dim'>{game.name}</span>
                <GameDetails game={game} isAdmin={isAdmin} className='text-xs sm:text-sm' />
            </div>
            <span className='hidden text-xs tabular-nums text-ink-faint sm:block'>
                {gameAge(game.createdAt)}
            </span>
            <div className='col-start-2 row-span-2 row-start-1 flex items-center justify-end gap-1 sm:col-start-auto sm:row-span-1 sm:row-start-auto'>
                {isAdmin && (
                    <Button size='sm' variant='ghost' className='text-danger' onPress={onRemove}>
                        Remove
                    </Button>
                )}
                {canWatch ? (
                    <GameActionButton size='sm' quiet onPress={onWatch}>
                        Watch
                    </GameActionButton>
                ) : (
                    !game.allowSpectators && (
                        <span className='text-xs text-ink-faint'>No spectators</span>
                    )
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
    const { data: cards } = useGetCardsQuery({});

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
                    <ul className='border-t border-gold-hair'>
                        {inProgress.map((game) => (
                            <GameInProgress
                                key={game.id}
                                game={game}
                                cards={cards}
                                {...handlers(game)}
                            />
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
};

export default GameList;
