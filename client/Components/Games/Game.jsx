import React from 'react';
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
    const getPlayerSlots = function (game) {
        // TODO: Update this to fetch from game once Melee implemented
        const maxPlayers = 2;
        const perRow = 2;
        // Divide by number of players which can be displayed per row
        const playerSlots = [...Array(Math.ceil(maxPlayers / perRow) * perRow)];
        Object.values(game.players).forEach((player, i) => (playerSlots[i] = player));
        return Object.values(playerSlots).map((player, i) => {
            return (
                <GamePlayerSlot
                    key={player ? player.name : `slot-${i}`}
                    player={player}
                    showJoinButton={showJoinButton && !player && i === playerSlots.length - 1}
                    onJoinGame={onJoinGame}
                    position={i % 2 === 0 ? 'left' : 'right'}
                />
            );
        });
    };

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
                <div className='flex justify-center'>{getPlayerSlots(game)}</div>
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
