import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@heroui/react';

const ResponseDelay = ({ duration, paused }) => {
    const startTime = useRef(Date.now());
    const [remaining, setRemaining] = useState(100);

    useEffect(() => {
        if (paused) {
            return;
        }

        let frame;
        const tick = () => {
            const elapsed = Date.now() - startTime.current;
            setRemaining(Math.max(0, 100 - (elapsed / duration) * 100));
            if (elapsed < duration) {
                frame = requestAnimationFrame(tick);
            }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [duration, paused]);

    return (
        <div className='mx-2 my-1'>
            <Progress
                aria-label='Response delay'
                label={paused ? 'Paused' : 'Passing automatically'}
                classNames={{ label: 'text-xs md:text-small italic' }}
                size='sm'
                color={paused ? 'default' : 'warning'}
                value={remaining}
                disableAnimation
            />
        </div>
    );
};

export default ResponseDelay;
