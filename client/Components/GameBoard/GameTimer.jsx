import React from 'react';
import TimeLimitClock from './TimeLimitClock';
import ChessClock from './ChessClock';
import { useSelector } from 'react-redux';

const GameTimer = ({ thisPlayer, otherPlayer }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);

    const clockStack = [];
    if (currentGame.useChessClocks && otherPlayer.chessClock) {
        clockStack.push(
            <ChessClock
                key={`chess-clock-${otherPlayer.name}`}
                username={otherPlayer.user.username}
                delayPosition={'top'}
                active={otherPlayer.chessClock.active}
                paused={otherPlayer.chessClock.paused}
                timerStart={otherPlayer.chessClock.timerStart}
                timeLeft={otherPlayer.chessClock.timeLeft}
                delayLeft={otherPlayer.chessClock.delayLeft}
            />
        );
    }

    if (currentGame.useGameTimeLimit) {
        clockStack.push(
            <TimeLimitClock
                key={`game-clock`}
                active={currentGame.timeLimit.active}
                paused={currentGame.timeLimit.paused}
                timerStart={currentGame.timeLimit.timerStart}
                timeLeft={currentGame.timeLimit.timeLeft}
            />
        );
    }

    if (currentGame.useChessClocks && thisPlayer.chessClock) {
        clockStack.push(
            <ChessClock
                key={`chess-clock-${thisPlayer.name}`}
                username={thisPlayer.user.username}
                delayPosition={'bottom'}
                active={thisPlayer.chessClock.active}
                paused={thisPlayer.chessClock.paused}
                timerStart={thisPlayer.chessClock.timerStart}
                timeLeft={thisPlayer.chessClock.timeLeft}
                delayLeft={thisPlayer.chessClock.delayLeft}
            />
        );
    }

    if (!clockStack.length === 0) {
        return null;
    }
    return (
        <div className='absolute h-full w-full px-1 flex flex-col gap-5 justify-center items-end select-none pr-10'>
            {clockStack}
        </div>
    );
};

export default GameTimer;
