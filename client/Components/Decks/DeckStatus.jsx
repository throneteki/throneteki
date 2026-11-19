import React, { useMemo, useState } from 'react';
import DeckStatusSummary from './DeckStatusSummary';
import { Chip, Separator, Tooltip } from '@heroui/react';
import { deckStatusLabel } from './DeckHelper';
import LoadingSpinner from '../Site/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faExclamationCircle,
    faXmarkCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { GameFormats } from '../../constants';

const DeckStatus = ({ className, showDeckDetails = true, compact = false, deck }) => {
    const [pointerType, setPointerType] = useState(false);
    const status = deck.status;
    const formatInfo = GameFormats.find((gf) => gf.name === status.format);
    const formatLabel = formatInfo?.label;
    const variantLabel = formatInfo?.variants?.find((gv) => gv.name === status.variant)?.label;

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

    const wrapperClass = useMemo(
        () =>
            classNames({
                'select-none': ['touch', 'pen'].includes(pointerType) // Disables text selection on touch/pen devices, but not desktop
            }),
        [pointerType]
    );

    const chipClass = classNames('pointer-events-none h-7 whitespace-nowrap', className);

    let labelClass = null;
    // Compacts if true, or at the provided size step
    if (compact === true) {
        labelClass = 'hidden';
    } else if (typeof compact === 'string') {
        labelClass = `${compact}:hidden`;
    }

    if (!status || !status.format || !status.variant || !status.legality) {
        return null;
    }

    return (
        <Tooltip delay={0} closeDelay={100} isOpen={!!pointerType}>
            <Tooltip.Trigger>
                <div
                    className={wrapperClass}
                    onPointerEnter={(e) => setPointerType(e.pointerType)}
                    onPointerLeave={() => setPointerType(null)}
                >
                    <Chip className={chipClass} color={info.color} variant='soft'>
                        <div className='flex flex-row gap-1 items-center'>
                            <span>{info.icon}</span>
                            <span className={labelClass}>{info.label}</span>
                        </div>
                    </Chip>
                </div>
            </Tooltip.Trigger>
            <Tooltip.Content placement='right' showArrow>
                <div className='flex flex-col gap-1 max-w-64'>
                    <span className={`text-${info.color} flex flex-row gap-1 items-center`}>
                        {info.icon}
                        <b>
                            {info.label} ({variantLabel} {formatLabel})
                        </b>
                    </span>
                    <Separator />
                    <DeckStatusSummary status={status} />
                    {showDeckDetails && status.extendedStatus?.length > 0 && (
                        <ul className='flex flex-col gap-1'>
                            {status.extendedStatus.map((error, index) => (
                                <li key={index}>
                                    <Separator />
                                    {error}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Tooltip.Content>
        </Tooltip>
    );
};

export default DeckStatus;
