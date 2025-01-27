import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPauseCircle } from '@fortawesome/free-solid-svg-icons';

const formatTime = (seconds) => {
    if (!seconds) {
        return null;
    }
    const momentTime = moment.utc(seconds * 1000);
    const format = momentTime.hours() > 0 ? 'HH:mm:ss' : 'mm:ss';
    return momentTime.format(format);
};

const TimeLimitClock = ({ active, paused, timerStart, timeLeft: timeLeftProp }) => {
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(timeLeftProp);

    useEffect(() => {
        // This logic must match the server-side timeLimit.js calculateTimeLeft to ensure both are in sync
        const calculateTimeLeft = () => {
            const endTime = moment(timerStart).add(timeLeftProp, 'seconds');
            const difference = moment.duration(endTime.diff(moment())).asSeconds();
            const remaining = Math.max(0, Math.round(difference));
            setTimeLeft(remaining);
        };

        if (active && !paused && !timer) {
            // Run once immediately, then every second
            calculateTimeLeft();
            const timerId = setInterval(calculateTimeLeft, 1000);
            setTimer(timerId);
        }

        if ((!active || paused) && timer) {
            clearInterval(timer);
            setTimer(null);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                setTimer(null);
            }
        };
    }, [active, paused, timerStart, timeLeftProp, timer]);

    let icon = null;

    if (paused) {
        icon = <FontAwesomeIcon icon={faPauseCircle} />;
    } else if (active) {
        icon = <FontAwesomeIcon icon={faClock} />;
    }

    return (
        <div className='flex items-center gap-2'>
            <div className='text-3xl'>{formatTime(timeLeft)}</div>
            <div className='text-xl w-5'>{icon}</div>
        </div>
    );
};

export default TimeLimitClock;
