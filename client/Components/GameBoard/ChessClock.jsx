import React, { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faClockRotateLeft, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@nextui-org/react';

const formatTime = (seconds) => {
    if (!seconds) {
        return null;
    }
    const momentTime = moment.utc(seconds * 1000);
    const format = momentTime.hours() > 0 ? 'HH:mm:ss' : 'mm:ss';
    return momentTime.format(format);
};
const formatDelay = (seconds) => (seconds ? `+${seconds}s` : null);

const ChessClock = ({
    username,
    delayPosition,
    active,
    paused,
    timerStart,
    timeLeft: timeLeftProp,
    delayLeft: delayLeftProp
}) => {
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(() => timeLeftProp);
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

    let icon = null;

    if (paused) {
        icon = <FontAwesomeIcon icon={faPauseCircle} />;
    } else if (active && delayLeft > 0) {
        icon = <FontAwesomeIcon icon={faClockRotateLeft} />;
    } else if (active) {
        icon = <FontAwesomeIcon icon={faClock} />;
    }
    const className = classNames(
        'flex',
        delayPosition === 'bottom' ? 'flex-col' : 'flex-col-reverse'
    );
    return (
        <div className={className}>
            <div className='flex items-center gap-2'>
                <Avatar
                    src={`/img/avatar/${username}.png`}
                    showFallback
                    className='w-7 h-7 text-tiny'
                />
                <div className='text-2xl'>{formatTime(timeLeft)}</div>
                <div className='text-xl w-5'>{icon}</div>
            </div>
            <div className='text-right text-xl pr-7 h-7'>{formatDelay(delayLeft)}</div>
        </div>
    );
};

export default ChessClock;
