import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '@heroui/react';

const ResponseDelay = ({ duration }) => {
    const startTime = useRef(Date.now());
    const [remaining, setRemaining] = useState(100);

    useEffect(() => {
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
    }, [duration]);

    return (
        <div className='mx-2 my-1'>
            <Progress aria-label='Response delay' size='sm' value={remaining} disableAnimation />
        </div>
    );
};

export default ResponseDelay;
