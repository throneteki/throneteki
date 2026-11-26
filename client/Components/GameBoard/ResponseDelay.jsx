import React, { useEffect, useRef, useState } from 'react';
import { Label, ProgressBar } from '@heroui/react';

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
                    className={paused ? 'h-full bg-white/35' : 'h-full bg-warning'}
                    style={{ width: `${remaining}%` }}
                />
            </div>
        );
    }

    return (
        <div className='mx-2 my-1'>
            <ProgressBar
                aria-label='Response delay'
                size='sm'
                color={paused ? 'default' : 'warning'}
                value={remaining}
            >
                <Label className='text-xs italic md:text-sm'>
                    {paused ? 'Paused' : 'Passing automatically'}
                </Label>
                <ProgressBar.Track>
                    <ProgressBar.Fill className='transition-none' />
                </ProgressBar.Track>
            </ProgressBar>
        </div>
    );
};

export default ResponseDelay;
