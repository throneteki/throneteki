import React, { useEffect, useState } from 'react';
import screenfull from 'screenfull';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter
} from '@fortawesome/free-solid-svg-icons';

const useFullscreen = () => {
    const [full, setFull] = useState(() => screenfull.isEnabled && screenfull.isFullscreen);
    useEffect(() => {
        if (!screenfull.isEnabled) {
            return;
        }
        const onChange = () => setFull(screenfull.isFullscreen);
        screenfull.on('change', onChange);
        return () => screenfull.off('change', onChange);
    }, []);
    return full;
};

// Into and out of full screen, where the browser allows it (not iPhones, which keep it for videos)
const FullscreenToggle = () => {
    const full = useFullscreen();
    if (!screenfull.isEnabled) {
        return null;
    }
    return (
        <Button
            isIconOnly
            size='sm'
            variant='light'
            className='h-7 w-7 min-w-7'
            title={full ? 'Leave full screen' : 'Full screen'}
            onPress={() => screenfull.toggle().catch(() => {})}
        >
            <FontAwesomeIcon
                icon={full ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter}
                className='text-base'
            />
        </Button>
    );
};

export default FullscreenToggle;
