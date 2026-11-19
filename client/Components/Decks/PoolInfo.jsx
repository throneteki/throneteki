import React, { useMemo, useState } from 'react';
import { Chip, Separator, Tooltip } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const PoolInfo = ({ className, compact = false, isPool = false }) => {
    const [pointerType, setPointerType] = useState(false);

    const info = {
        label: 'Limited',
        icon: <FontAwesomeIcon icon={faExclamationCircle} />,
        color: 'warning'
    };

    const wrapperClass = useMemo(
        () =>
            classNames({
                'select-none': ['touch', 'pen'].includes(pointerType) // Disables text selection on touch/pen devices, but not desktop
            }),
        [pointerType]
    );

    const chipClass = isPool
        ? classNames('pointer-events-none h-7 whitespace-nowrap', className)
        : 'hidden';

    let labelClass = null;
    // Compacts if true, or at the provided size step
    if (compact === true) {
        labelClass = 'hidden';
    } else if (typeof compact === 'string') {
        labelClass = `${compact}:hidden`;
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
                        <b>{info.label}</b>
                    </span>
                    <Separator />
                    <span className={`text-${info.color} flex flex-row gap-1 items-center`}>
                        This deck is limited to cards from the drafted card pool.
                    </span>
                </div>
            </Tooltip.Content>
        </Tooltip>
    );
};

export default PoolInfo;
