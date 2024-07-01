import React, { useState, useEffect, useRef, useCallback } from 'react';

const formattedSeconds = (sec) =>
    `${sec < 0 ? '-' : ''}${Math.floor(Math.abs(sec) / 60)}:${('0' + (Math.abs(sec) % 60)).slice(-2)}`;

const ChessClock = ({
    stateId: propStateId,
    mode: propMode,
    secondsLeft: propSecondsLeft,
    delayToStartClock: propDelayToStartClock
}) => {
    const [mode, setMode] = useState(undefined);
    const [secondsLeft, setSecondsLeft] = useState(undefined);
    const [delayToStartClock, setDelayToStartClock] = useState(undefined);
    const [stateId, setStateId] = useState(undefined);
    const timer = useRef(null);

    useEffect(() => {
        updateProps();
    }, [propStateId, propMode, propSecondsLeft, propDelayToStartClock, updateProps]);

    const updateProps = useCallback(() => {
        if (stateId === propStateId) {
            return;
        }
        if (propSecondsLeft === 0) {
            if (timer.current) {
                clearInterval(timer.current);
            }
            setSecondsLeft(0);
            return;
        }
        setStateId(propStateId);
        setMode(propMode);
        setSecondsLeft(propSecondsLeft);
        setDelayToStartClock(propDelayToStartClock);
        if (timer.current) {
            clearInterval(timer.current);
        }

        if (propMode !== 'stop') {
            timer.current = setInterval(() => {
                if (delayToStartClock > 0) {
                    setDelayToStartClock(delayToStartClock - 1);
                } else if (delayToStartClock <= 0) {
                    setSecondsLeft(secondsLeft - 1);
                }
            }, 1000);
        }
    }, [
        delayToStartClock,
        secondsLeft,
        stateId,
        propStateId,
        propMode,
        propSecondsLeft,
        propDelayToStartClock
    ]);

    if (mode !== 'inactive') {
        let timeLeftText = formattedSeconds(secondsLeft);
        let stateInfo = null;
        if (mode === 'down') {
            stateInfo = (
                <h1 className='chessclock-item'>
                    {delayToStartClock <= 0 ? (
                        <img src='/img/chess-clock.png' className='chessclock-icon' />
                    ) : (
                        <span className='chessclock-delay'>
                            +{formattedSeconds(delayToStartClock)}
                        </span>
                    )}
                </h1>
            );
        }
        return (
            <div className='chessclock-container'>
                <h1 className='chessclock-item'>{timeLeftText} </h1>
                {stateInfo}
            </div>
        );
    }
    return <div />;
};

export default ChessClock;
