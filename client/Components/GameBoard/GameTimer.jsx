import React from 'react';
import TimeLimitClock from './TimeLimitClock';
import ChessClock from './ChessClock';
import { useSelector } from 'react-redux';

const GameTimer = ({ thisPlayer, otherPlayer }) => {
    const currentGame = useSelector((state) => state.lobby.currentGame);

    let timeLimitClock;

    if (currentGame.useGameTimeLimit) {
        timeLimitClock = (
            <TimeLimitClock
                timeLimitStarted={currentGame.gameTimeLimitStarted}
                timeLimitStartedAt={currentGame.gameTimeLimitStartedAt}
                timeLimit={currentGame.gameTimeLimitTime}
            />
        );
    } else if (currentGame.useChessClocks) {
        let chessClockOtherPlayer;
        if (otherPlayer.chessClock) {
            chessClockOtherPlayer = (
                <ChessClock
                    delayToStartClock={otherPlayer.chessClock.delayToStartClock}
                    mode={otherPlayer.chessClock.mode}
                    secondsLeft={otherPlayer.chessClock.timeLeft}
                    stateId={otherPlayer.chessClock.stateId}
                />
            );
        }
        let chessClockThisPlayer;
        if (thisPlayer.chessClock) {
            chessClockThisPlayer = (
                <ChessClock
                    delayToStartClock={thisPlayer.chessClock.delayToStartClock}
                    mode={thisPlayer.chessClock.mode}
                    secondsLeft={thisPlayer.chessClock.timeLeft}
                    stateId={thisPlayer.chessClock.stateId}
                />
            );
        }
        timeLimitClock = (
            <div className='chessclock-group'>
                {chessClockOtherPlayer}
                {chessClockThisPlayer}
            </div>
        );
    }

    return timeLimitClock;
};

export default GameTimer;
