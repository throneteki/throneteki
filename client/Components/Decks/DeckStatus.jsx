import React from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { Chip, Divider, Tooltip } from '@heroui/react';
import { deckStatusLabel } from './DeckHelper';
import LoadingSpinner from '../Site/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faExclamationCircle,
    faXmarkCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const DeckStatus = ({ className, compact = false, status }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const statusInfo = (status) => {
        const label = deckStatusLabel(status) || 'Loading...';
        let icon = <LoadingSpinner size='sm' label={false} />;
        switch (label) {
            case 'Invalid':
                icon = <FontAwesomeIcon icon={faExclamationCircle} />;
                break;
            case 'Not Legal':
                icon = <FontAwesomeIcon icon={faXmarkCircle} />;
                break;
            case 'Casual':
            case 'Legal':
                icon = <FontAwesomeIcon icon={faCircleCheck} />;
                break;
        }

        let color = 'default';
        if (label === 'Invalid' || label === 'Not Legal') {
            color = 'danger';
        } else if (label === 'Casual') {
            color = 'warning';
        } else if (label === 'Legal') {
            color = 'success';
        }

        return { label, icon, color };
    };

    const info = statusInfo(status);
    const chipClass = classNames('select-none pointer-events-none h-8', className);

    return (
        <Tooltip
            placement={'right'}
            showArrow={true}
            closeDelay={100}
            isOpen={isOpen}
            content={
                <div className='flex flex-col gap-1 max-w-64'>
                    <span className={`text-${info.color} flex flex-row gap-1 items-center`}>
                        {info.icon} <b>{info.label}</b>
                    </span>
                    <Divider />
                    <DeckStatusSummary status={status} />
                    {status.extendedStatus && status.extendedStatus.length !== 0 && (
                        <ul className='flex flex-col gap-1'>
                            {status.extendedStatus.map((error, index) => (
                                <>
                                    <Divider />
                                    <li key={index}>{error}</li>
                                </>
                            ))}
                        </ul>
                    )}
                </div>
            }
        >
            <div
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onTouchStart={() => setIsOpen(true)}
                onTouchEnd={() => setIsOpen(false)}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <Chip className={chipClass} color={info.color} radius='md'>
                    {compact ? (
                        info.icon
                    ) : (
                        <div className='flex flex-row gap-1 items-center'>
                            {info.icon}
                            {info.label}
                        </div>
                    )}
                </Chip>
            </div>
        </Tooltip>
    );
};

export default DeckStatus;
