import React from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { PopoverContent, PopoverTrigger } from '@nextui-org/react';
import DeckStatusLabel from './DeckStatusLabel';
import MouseOverPopover from '../Site/MouseOverPopover';

const DeckStatus = ({ className, status }) => {
    return (
        <MouseOverPopover placement='right' className={className}>
            <PopoverTrigger>
                <DeckStatusLabel status={status} />
            </PopoverTrigger>
            <PopoverContent>
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
        </MouseOverPopover>
    );
};

export default DeckStatus;
