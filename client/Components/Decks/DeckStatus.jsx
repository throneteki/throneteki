import React from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import DeckStatusLabel from './DeckStatusLabel';

const DeckStatus = ({ className, status }) => {
    return (
        <Popover placement='right' className={className}>
            <PopoverTrigger>
                <div>
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
