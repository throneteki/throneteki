import React from 'react';
import TimeLimitClock from './TimeLimitClock';
import ChessClock from './ChessClock';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

const GameTimer = ({ className, player, isMe, side }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);
    if (!isMe && !player.chessClock) {
        return null;
    }
    const wrapperClassName = classNames('flex flex-col h-full justify-between gap-1', className);
    return (
        <div className={wrapperClassName}>
            {currentGame.useGameTimeLimit && isMe && (
                <TimeLimitClock
                    active={currentGame.timeLimit.active}
                    paused={currentGame.timeLimit.paused}
                    timerStart={currentGame.timeLimit.timerStart}
                    timeLeft={currentGame.timeLimit.timeLeft}
                />
            )}
            {currentGame.useChessClocks && player.chessClock && (
                <ChessClock
                    username={player.user.username}
                    delayPosition={side === 'top' ? 'bottom' : 'top'}
                    active={player.chessClock.active}
                    paused={player.chessClock.paused}
                    timerStart={player.chessClock.timerStart}
                    timeLeft={player.chessClock.timeLeft}
                    delayLeft={player.chessClock.delayLeft}
                />
            )}
        </div>
    );
};

export default GameTimer;
