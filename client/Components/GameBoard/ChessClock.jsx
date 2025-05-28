import React, { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@heroui/react';

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) {
        return null;
    }
    const momentTime = moment.utc(seconds * 1000);
    const format = momentTime.hours() > 0 ? 'HH:mm:ss' : 'mm:ss';
    return momentTime.format(format);
};
const formatDelay = (seconds) => (seconds ? `+${seconds}s` : null);

const ChessClock = ({
    username,
    className,
    side,
    active,
    paused,
    timerStart,
    timeLeft: timeLeftProp,
    delayLeft: delayLeftProp
}) => {
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(timeLeftProp);
    const [delayLeft, setDelayLeft] = useState(null);

    useEffect(() => {
        // This logic must match the server-side ChessClock.js calculateTimeLeft to ensure both are in sync
        const calculateTimeLeft = () => {
            const delayEndTime = moment(timerStart).add(delayLeftProp, 'seconds');
            const delayDifference = moment.duration(delayEndTime.diff(moment())).asSeconds();
            const delayRemaining = Math.max(0, Math.round(delayDifference));
            if (delayRemaining > 0) {
                // If there is delay remaining, update that
                setDelayLeft(delayRemaining);
            } else {
                // Otherwise, update the time remaining
                setDelayLeft(null);
                const timeEndTime = delayEndTime
                    .add(timeLeftProp, 'seconds')
                    .add(-delayRemaining, 'seconds');
                const timeDifference = moment.duration(timeEndTime.diff(moment())).asSeconds();
                const timeRemaining = Math.max(0, Math.round(timeDifference));
                setTimeLeft(timeRemaining);
            }
        };

        if (active && !paused && !timer) {
            // Run once immediately, then every second
            calculateTimeLeft();
            const timerId = setInterval(calculateTimeLeft, 1000);
            setTimer(timerId);
        }

        // When inactive or paused, clear the timer
        if ((!active || paused) && timer) {
            clearInterval(timer);
            setTimer(null);
        }

        // When not active, clear the delay
        if (!active && !paused) {
            setDelayLeft(null);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }
        };
    }, [active, paused, timerStart, timeLeftProp, delayLeftProp, timer]);

    const icon = paused ? <FontAwesomeIcon icon={faPauseCircle} /> : null;

    const wrapperClassName = classNames(
        'flex w-fit px-2 py-1 rounded-md text-xl bg-black/40',
        {
            'flex-col-reverse': side === 'top',
            'flex-col': side === 'bottom'
        },
        className
    );
    const time = formatTime(timeLeft);
    const delay = formatDelay(delayLeft);
    return (
        <div className={wrapperClassName}>
            <div className='flex items-center gap-2'>
                <Avatar
                    src={`/img/avatar/${username}.png`}
                    showFallback
                    className='w-7 h-7 text-tiny'
                />
                <span className='text-2xl'>{time}</span>
                {icon && <div className='w-5'>{icon}</div>}
            </div>
            {delay && (
                <span className='flex gap-1 justify-end text-right p-1'>
                    {delay}
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                </span>
            )}
        </div>
    );
};

export default ChessClock;
