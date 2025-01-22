import React from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { Tooltip } from "@heroui/react";
import DeckStatusLabel from './DeckStatusLabel';

const DeckStatus = ({ className, status }) => {
    return (
        <Tooltip
            className={className}
            placement={'right'}
            showArrow={true}
            closeDelay={100}
            content={
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
            }
        >
            <div>
                <DeckStatusLabel status={status} />
            </div>
        </Tooltip>
    );
};

export default DeckStatus;
