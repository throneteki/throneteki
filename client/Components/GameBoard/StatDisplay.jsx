import React from 'react';
import Button from '../Site/Button';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Constants } from '../../constants';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

// A stat's icon and value, with a small round - and + either side of it when it can be changed
const StatDisplay = ({
    showControls = true,
    statCode,
    statName,
    statValue,
    onMinusClick,
    onPlusClick,
    compact = false,
    iconClassName
}) => {
    const changeButton = (label, icon, onPress) => (
        <Button
            isIconOnly
            title={`${label} ${statName}`}
            variant='tertiary'
            size='sm'
            className='h-5 w-5 min-w-5 shrink-0 rounded-full border border-edge bg-quiet text-[10px] text-ink data-[hovered=true]:bg-quiet-hover'
            onPress={onPress}
        >
            <FontAwesomeIcon icon={icon} />
        </Button>
    );
    return (
        <div
            className={classNames(
                statName,
                'relative flex items-center justify-center',
                compact ? 'min-w-8' : 'min-w-12',
                { 'px-2': showControls }
            )}
        >
            {showControls && changeButton('Reduce', faMinus, onMinusClick)}
            <div data-theme='dark' className='pointer-events-none relative mx-1'>
                <img
                    className={iconClassName ?? (compact ? 'h-6 w-6' : 'h-8 w-8')}
                    src={Constants.StatIconImagePaths[statCode]}
                    alt=''
                />
                {/* The value is sized from the icon's height (cqh), one ratio at every size */}
                <div className='absolute inset-0 flex justify-center items-center @container-size'>
                    <p className='stat-value font-medium text-ink text-[53.3cqh] text-center select-none text-stroke-sm leading-[initial] [text-shadow:0_0_2px_#000,0_0_2px_#000,0_1px_3px_#000]'>
                        {statValue}
                    </p>
                </div>
            </div>
            {showControls && changeButton('Raise', faPlus, onPlusClick)}
        </div>
    );
};

export default StatDisplay;
