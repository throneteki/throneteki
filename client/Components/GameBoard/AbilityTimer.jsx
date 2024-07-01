import React, { useState, useEffect, useRef, useCallback } from 'react';

const AbilityTimer = ({ limit, startTime }) => {
    const [remaining, setRemaining] = useState(limit);
    const requestRef = useRef();

    const tick = useCallback(() => {
        // Subtract an offset factor to ensure timer reaches 0 before the
        // component is unmounted.
        const timeOffset = 0.25;
        let now = new Date();
        let elapsed = (now - startTime) / 1000;
        let remainingTime = limit - elapsed - timeOffset;

        if (remainingTime < 0) {
            remainingTime = 0;
        }

        setRemaining(remainingTime);
        requestRef.current = requestAnimationFrame(tick);
    }, [limit, startTime]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(requestRef.current);
    }, [tick]);

    let remainingPercent = ((remaining / limit) * 100).toFixed() + '%';
    return (
        <div>
            <span>Auto passing in {remaining.toFixed()}...</span>
            <div className='progress'>
                <div
                    className='progress-bar progress-bar-success'
                    role='progressbar'
                    style={{ width: remainingPercent }}
                />
            </div>
        </div>
    );
};

export default AbilityTimer;
