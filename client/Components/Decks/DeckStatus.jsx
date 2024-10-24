import React, { useState } from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import DeckStatusLabel from './DeckStatusLabel';

const DeckStatus = ({ className, status }) => {
    const [showPopup, setShowPopup] = useState(false);

    console.info(status);

    return (
        <Popover
            placement='right'
            className={className}
            isOpen={showPopup}
            onOpenChange={(open) => setShowPopup(open)}
        >
            <PopoverTrigger>
                <div onMouseOver={() => setShowPopup(true)} onMouseOut={() => setShowPopup(false)}>
                    <DeckStatusLabel status={status} />
                </div>
            </PopoverTrigger>
            <PopoverContent className='bg-background'>
                <div>
                    <DeckStatusSummary status={status} />
                    {status.errors && status.errors.length !== 0 && (
                        <ul className='mt-4 border-t pt-4'>
                            {status.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default DeckStatus;
