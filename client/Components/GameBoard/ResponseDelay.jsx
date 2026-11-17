import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@heroui/react';

// slim: just a thin line that runs down, for an edge of something else
const ResponseDelay = ({ duration, paused, slim = false }) => {
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

    if (slim) {
        return (
            <div
                role='progressbar'
                aria-label={paused ? 'Paused' : 'Passing automatically'}
                aria-valuenow={Math.round(remaining)}
                title={paused ? 'Paused' : 'Passing automatically'}
                className='h-0.5 w-full bg-white/10'
            >
                <div
                    className={paused ? 'h-full bg-default-400' : 'h-full bg-warning'}
                    style={{ width: `${remaining}%` }}
                />
            </div>
        );
    }

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
