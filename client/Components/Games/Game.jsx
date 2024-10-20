import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import GamePlayer from './GamePlayer';
import { createGameTitle } from './GameHelper';
import { Button } from '@nextui-org/react';
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
    let getPlayers = function (game) {
        let players = Object.values(game.players).map((player, i) => {
            return <GamePlayer key={player.name} player={player} firstPlayer={i % 2 === 0} />;
        });

        if (showJoinButton) {
            players.push(
                <div
                    key={`game-${game.id}-join`}
                    className={classNames('flex flex-col flex-1', {
                        'mr-2 items-end': players.length % 2 === 0,
                        'ml-2 items-start': players.length % 2 === 1
                    })}
                >
                    <div className='flex items-center flex-1'>
                        <Button
                            size='sm'
                            color='primary'
                            className='gamelist-button img-responsive'
                            onClick={onJoinGame}
                        >
                            Join
                        </Button>
                    </div>
                </div>
            );
        }

        if (players.length % 2 === 1) {
            players.push(
                <div key={`game-${game.id}-empty`} className='flex items-center flex-1' />
            );
        }

        return players;
    };

    let players = getPlayers(game);
    let gameMiddles = [];
    for (let i = 0; i < players.length; i += 2) {
        gameMiddles.push(
            <div key={`game-middle-${i}`} className='my-3 flex justify-center items-center'>
                {players[i]}
                {players[i + 1]}
            </div>
        );
    }

    let rowClass = classNames(
        'min-h-32 py-3 px-2 hover:border-info hover:bg-info hover:bg-opacity-20',
        {
            [game.node]: game.node && isAdmin
        }
    );

    let timeDifference = moment().diff(moment(game.createdAt));
    if (timeDifference < 0) {
        timeDifference = 0;
    }

    let formattedTime = moment.utc(timeDifference).format('HH:mm');

    const title = createGameTitle(
        game.name,
        game.event.name,
        (game.restrictedList && game.restrictedList.cardSet) || 'redesign'
    );

    const gameTypeClass = classNames(
        'flex gap-2 justify-center items-center text-small text-white',
        {
            'bg-warning bg-opacity-40': game.gameType === 'casual',
            'bg-success bg-opacity-40': game.gameType === 'beginner',
            'bg-danger bg-opacity-40': game.gameType === 'competitive'
        }
    );

    return (
        <div key={game.id}>
            <hr />
            <div className={rowClass}>
                <div className={gameTypeClass}>
                    <span className='capitalize'>({game.gameType})</span>
                    <span className='text-white'>
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
                {gameMiddles}
                <div className='game-row-buttons'>
                    {showWatchButton && (
                        <Button
                            color='primary'
                            size='sm'
                            className='btn btn-primary gamelist-lower-button'
                            onClick={onWatchGame}
                        >
                            Watch
                        </Button>
                    )}
                    {isAdmin && (
                        <Button
                            color='primary'
                            className='gamelist-lower-button p-1 ml-1 mt-1'
                            size='sm'
                            onClick={onRemoveGame}
                        >
                            Remove
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
