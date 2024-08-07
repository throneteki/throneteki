import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import GamePlayer from './GamePlayer';
import { createGameTitle } from './GameHelper';

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
                    className={classNames('game-player-row', {
                        'first-player': players.length % 2 === 0,
                        'other-player': players.length % 2 === 1
                    })}
                >
                    <div className='game-faction-row other-player'>
                        <button
                            className='btn btn-primary gamelist-button img-responsive'
                            onClick={onJoinGame}
                        >
                            Join
                        </button>
                    </div>
                </div>
            );
        }

        if (players.length % 2 === 1) {
            players.push(
                <div key={`game-${game.id}-empty`} className='game-faction-row other-player' />
            );
        }

        return players;
    };

    let players = getPlayers(game);
    let gameMiddles = [];
    for (let i = 0; i < players.length; i += 2) {
        gameMiddles.push(
            <div key={`game-middle-${i}`} className='game-middle-row'>
                {players[i]}
                {players[i + 1]}
            </div>
        );
    }

    let rowClass = classNames('game-row', {
        [game.node]: game.node && isAdmin
    });

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

    return (
        <div key={game.id}>
            <hr />
            <div className={rowClass}>
                <div className={`game-header-row ${game.gameType}`}>
                    <span className='game-type'>({game.gameType})</span>
                    <span className='game-title'>
                        <b>{title}</b>
                    </span>
                    <span className='game-time'>{`[${formattedTime}]`}</span>
                    <span className='game-icons'>
                        {game.showHand && (
                            <img
                                src='/img/ShowHandIcon.png'
                                className='game-list-icon'
                                alt='Show hands to spectators'
                            />
                        )}
                        {game.needsPassword && (
                            <span className='password-game glyphicon glyphicon-lock' />
                        )}
                        {game.useGameTimeLimit && (
                            <img
                                src='/img/Timelimit.png'
                                className='game-list-icon'
                                alt='Time limit used'
                            />
                        )}
                        {game.useChessClocks && (
                            <img
                                src='/img/chess-clock.png'
                                className='game-list-icon'
                                alt='Chess clocks used'
                            />
                        )}
                    </span>
                </div>
                {gameMiddles}
                <div className='game-row-buttons'>
                    {showWatchButton && (
                        <button
                            className='btn btn-primary gamelist-lower-button'
                            onClick={onWatchGame}
                        >
                            Watch
                        </button>
                    )}
                    {isAdmin && (
                        <button
                            className='btn btn-primary gamelist-lower-button'
                            onClick={onRemoveGame}
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
