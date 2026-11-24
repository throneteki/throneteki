import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// A prompt button pressed and not yet answered
export const pendingButtonClass = 'ring-2 ring-inset ring-white/80';

const PendingMark = () => (
    <FontAwesomeIcon
        icon={faCircleNotch}
        spin
        title='Sent'
        className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] opacity-80'
    />
);

export default PendingMark;
