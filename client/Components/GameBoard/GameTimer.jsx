import React from 'react';
import TimeLimitClock from './TimeLimitClock';
import ChessClock from './ChessClock';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

const GameTimer = ({ className, player, isMe, side }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    if (!isMe && !player?.chessClock) {
        return null;
    }
    const wrapperClassName = classNames(
        'flex h-full justify-between gap-1',
        {
            'flex-col-reverse': side === 'top',
            'flex-col': side === 'bottom'
        },
        className
    );
    return (
        <div className={wrapperClassName}>
            {currentGame.useChessClocks && player.chessClock && (
                <ChessClock
                    username={player.user.username}
                    side={side}
                    active={player.chessClock.active}
                    paused={player.chessClock.paused}
                    timerStart={player.chessClock.timerStart}
                    timeLeft={player.chessClock.timeLeft}
                    delayLeft={player.chessClock.delayLeft}
                />
            )}
            {currentGame.useGameTimeLimit && isMe && (
                <TimeLimitClock
                    active={currentGame.timeLimit.active}
                    paused={currentGame.timeLimit.paused}
                    timerStart={currentGame.timeLimit.timerStart}
                    timeLeft={currentGame.timeLimit.timeLeft}
                />
            )}
        </div>
    );
};

export default GameTimer;
