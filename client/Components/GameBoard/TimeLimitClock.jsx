import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) {
        return null;
    }
    const momentTime = moment.utc(seconds * 1000);
    const format = momentTime.hours() > 0 ? 'HH:mm:ss' : 'mm:ss';
    return momentTime.format(format);
};

const TimeLimitClock = ({ className, active, paused, timerStart, timeLeft: timeLeftProp }) => {
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

    const icon = paused ? <FontAwesomeIcon icon={faPauseCircle} /> : null;

    const wrapperClassName = classNames(
        'flex items-center gap-2 w-fit bg-black/40 rounded-md px-2 py-1 text-2xl',
        className
    );
    return (
        <div className={wrapperClassName}>
            <FontAwesomeIcon icon={faClock} />
            <div className='text-3xl'>{formatTime(timeLeft)}</div>
            {icon && <div className='w-5'>{icon}</div>}
        </div>
    );
};

export default TimeLimitClock;
