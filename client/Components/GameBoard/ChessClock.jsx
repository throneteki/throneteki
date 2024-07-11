import React, { useState, useEffect, useRef, useMemo } from 'react';

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
    const [endTime, setEndTime] = useState(undefined);
    const [delayEndTime, setDelayEndTime] = useState(undefined);
    const timer = useRef(null);

    useEffect(() => {
        if (propMode !== 'stop' && delayEndTime) {
            if (timer.current) {
                clearInterval(timer.current);
            }
            timer.current = setInterval(() => {
                const delta = Math.round((delayEndTime.getTime() - Date.now()) / 1000);
                if (delta >= 0) {
                    setDelayToStartClock(delta);
                } else if (delta < 0) {
                    const endDelta = Math.round((endTime.getTime() - Date.now()) / 1000);
                    setSecondsLeft(endDelta);
                }
            }, 1000);
        }

        return () => clearInterval(timer.current);
    }, [propMode, delayEndTime, endTime]);

    useEffect(() => {
        if (propStateId !== stateId) {
            if (propSecondsLeft === 0) {
                setSecondsLeft(0);
                return;
            }
            setStateId(propStateId);
            setMode(propMode);
            setSecondsLeft(propSecondsLeft);
            setDelayEndTime(new Date(Date.now() + propDelayToStartClock * 1000));
            setEndTime(new Date(Date.now() + (propDelayToStartClock + propSecondsLeft) * 1000));
            setDelayToStartClock(propDelayToStartClock);
        }
    }, [propDelayToStartClock, propMode, propSecondsLeft, propStateId, stateId]);

    const timeLeftText = useMemo(() => {
        return formattedSeconds(secondsLeft);
    }, [secondsLeft]);

    const delayText = useMemo(() => {
        return formattedSeconds(delayToStartClock);
    }, [delayToStartClock]);

    if (mode !== 'inactive') {
        let stateInfo = null;
        if (mode === 'down') {
            stateInfo = (
                <h1 className='chessclock-item'>
                    {delayToStartClock <= 0 ? (
                        <img src='/img/chess-clock.png' className='chessclock-icon' />
                    ) : (
                        <span className='chessclock-delay'>+{delayText}</span>
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
