import React, { useState } from 'react';
import {
    faDownLeftAndUpRightToCenter,
    faUpRightAndDownLeftFromCenter
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@heroui/react';
import screenfull from 'screenfull';

const FullScreenButton = () => {
    const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
    return (
        <Button
            onPress={() => {
                if (screenfull.isEnabled) {
                    screenfull.toggle();
                    setIsFullscreen(!isFullscreen);
                }
            }}
            aria-label={isFullscreen ? 'Leave full screen' : 'Full screen'}
            className='text-gold'
            isIconOnly
            size='sm'
            variant='ghost'
        >
            {
                <FontAwesomeIcon
                    icon={
                        isFullscreen ? faDownLeftAndUpRightToCenter : faUpRightAndDownLeftFromCenter
                    }
                />
            }
        </Button>
    );
};

export default FullScreenButton;
