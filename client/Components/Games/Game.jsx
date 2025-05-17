import React, { useCallback } from 'react';
import classNames from 'classnames';
import moment from 'moment';

import GamePlayerSlot from './GamePlayerSlot';
import { createGameTitle } from './GameHelper';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const Game = ({
    game,
    isAdmin,
    onJoinGame,
    onRemoveGame,
    onWatchGame,
    showJoinButton,
    showWatchButton
}) => {
    const getPlayersInSlotOrder = (game) => {
        const playersInSeatOrder = Object.values(game.players).sort((a, b) => a.seatNo - b.seatNo);

        const numPlayers = playersInSeatOrder.length;
        const ownerIndex = playersInSeatOrder.findIndex((p) => p.owner);
        for (let i = 0; i < ownerIndex; i++) {
            playersInSeatOrder.push(playersInSeatOrder.shift());
        }
        const players = [];
        for (let i = 0; i < numPlayers; i++) {
            if (i % 2 === 0) {
                players.push(playersInSeatOrder.pop());
            } else {
                players.push(playersInSeatOrder.shift());
            }
        }
        return players;
    };
    const getPlayerSlots = useCallback(
        (game) => {
            const slots = getPlayersInSlotOrder(game).map((player, index) => (
                <GamePlayerSlot
                    key={player.name}
                    player={player}
                    position={index % 2 === 0 ? 'left' : 'right'}
                />
            ));

            // If player can join, then add join button on latest slot
            if (slots.length < game.maxPlayers && showJoinButton) {
                const joinClassName = classNames('flex', {
                    'justify-end': slots.length % 2 === 0
                });
                slots.push(
                    <div key={'slot_join'} className={joinClassName}>
                        <div className='bg-default-100/50 rounded-lg flex justify-center items-center max-w-52 h-full min-h-20 flex-grow'>
                            <Button size='sm' color='primary' onPress={onJoinGame}>
                                {game.maxPlayers > 2
                                    ? `Join (${slots.length}/${game.maxPlayers})`
                                    : 'Join'}
                            </Button>
                        </div>
                    </div>
                );
            }

            return slots;
        },
        [onJoinGame, showJoinButton]
    );

    const rowClass = classNames(
        'min-h-32 py-3 px-2 hover:border-info hover:bg-info/20 bg-black/20',
        {
            'bg-yellow-700/20': game.node === 'node1' && isAdmin,
            'bg-red-700/20': game.node === 'node2' && isAdmin
        }
    );

    const timeDifference = Math.max(0, moment().diff(moment(game.createdAt)));
    const formattedTime = moment.utc(timeDifference).format('HH:mm');

    const title = createGameTitle(
        game.name,
        game.event.name,
        (game.restrictedList && game.restrictedList.cardSet) || 'redesign'
    );

    const gameHeaderClass = classNames(
        'flex gap-2 justify-center content-center flex-wrap items-center text-small text-white p-1 rounded-md',
        {
            'bg-warning/40': game.gameType === 'casual',
            'bg-success/60': game.gameType === 'beginner',
            'bg-danger/50': game.gameType === 'competitive'
        }
    );

    const slots = getPlayerSlots(game);

    return (
        <div key={game.id}>
            <hr />
            <div className={rowClass}>
                <div className={gameHeaderClass}>
                    <span className='capitalize'>({`${game.gameType} ${game.gameFormat}`})</span>
                    <span className='text-white leading-normal self-start'>
                        <b>{title}</b>
                    </span>
                    <span>{`[${formattedTime}]`}</span>
                    <span className='flex gap-1.5 items-center'>
                        {game.showHand && (
                            <img
                                src='/img/ShowHandIcon.png'
                                className='h-6 w-6 invert'
                                alt='Show hands to spectators'
                            />
                        )}
                        {game.needsPassword && <FontAwesomeIcon icon={faLock} />}
                        {game.useGameTimeLimit && (
                            <img
                                src='/img/Timelimit.png'
                                className='h-6 w-6 invert p-1'
                                alt='Time limit used'
                            />
                        )}
                        {game.useChessClocks && (
                            <img
                                src='/img/chess-clock.png'
                                className='h-6 w-6 invert'
                                alt='Chess clocks used'
                            />
                        )}
                    </span>
                </div>
                <div
                    className='grid grid-cols-2 px-2 py-4 gap-2'
                    dir={Object.values(game.players).length <= 1 ? 'auto' : 'rtl'}
                >
                    {slots}
                </div>
                <div className='flex justify-center gap-2'>
                    {showWatchButton && (
                        <Button color='primary' size='sm' onPress={onWatchGame}>
                            Watch
                        </Button>
                    )}
                    {isAdmin && (
                        <Button color='danger' size='sm' onPress={onRemoveGame}>
                            Remove
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
