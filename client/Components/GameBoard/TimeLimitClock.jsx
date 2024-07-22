import React, { useEffect, useState } from 'react';
import moment from 'moment';

const TimeLimitClock = ({ timeLimitStarted, timeLimitStartedAt, timeLimit }) => {
    const [timer, setTimer] = useState(null);
    const [timeLeft, setTimeLeft] = useState(undefined);

    useEffect(() => {
        if (timeLimitStarted && !timer) {
            let timerId = setInterval(() => {
                let endTime = moment(timeLimitStartedAt).add(timeLimit, 'seconds');
                let time = moment.utc(endTime.diff(moment()));
                let timeDisplay = time.hours() > 0 ? time.format('HH:mm:ss') : time.format('mm:ss');
                setTimeLeft(timeDisplay);
            }, 1000);

            setTimer(timerId);
        }

        if (!timeLimitStarted && timer) {
            clearInterval(timer);
            setTimer(null);
        }

        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [timeLimitStarted, timeLimitStartedAt, timeLimit, timer]);

    return (
        <div>
            <h1>{timeLeft}</h1>
        </div>
    );
};

export default TimeLimitClock;
