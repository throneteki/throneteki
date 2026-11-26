import React from 'react';
import Button from '../Site/Button';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Constants } from '../../constants';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const StatDisplay = ({
    showControls = true,
    statCode,
    statName,
    statValue,
    onMinusClick,
    onPlusClick,
    compact = false,
    reach,
    flank = false
}) => {
    // flank (adaptive board): a small round - and + either side of the stat, rather than under its edges
    const flankButton = (label, icon, onPress) => (
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
        // Positioned itself, so the icon stays with its stat when the bar around it scrolls
        <div
            className={classNames(
                statName,
                'relative flex items-center justify-center',
                compact ? 'min-w-8' : 'min-w-12',
                { 'px-2': flank && showControls }
            )}
        >
            {showControls && flank && flankButton('Reduce', faMinus, onMinusClick)}
            {showControls && !flank && (
                <div className='flex'>
                    <Button
                        isIconOnly
                        title={`Reduce ${statName}`}
                        size='sm'
                        className='flex-col p-1.5 w-9'
                        onPress={onMinusClick}
                        variant='ghost'
                    >
                        <FontAwesomeIcon className='self-start' icon={faMinus} />
                    </Button>
                    <Button
                        isIconOnly
                        title={`Raise ${statName}`}
                        size='sm'
                        className='flex-col p-1.5 w-9'
                        onPress={onPlusClick}
                        variant='ghost'
                    >
                        <FontAwesomeIcon className='self-end' icon={faPlus} />
                    </Button>
                </div>
            )}
            {/* reach: the icon stands a little proud of its bar towards the board ('up' or 'down'), as the avatar does,
                its edge at the screen's side staying where it is */}
            <div
                className={classNames('pointer-events-none', flank ? 'relative mx-1' : 'absolute', {
                    'origin-bottom scale-[1.15]': reach === 'up',
                    'origin-top scale-[1.15]': reach === 'down'
                })}
            >
                <img
                    className={compact ? 'h-6 w-6' : 'h-8 w-8'}
                    src={Constants.StatIconImagePaths[statCode]}
                    alt=''
                />
                <div className='absolute inset-0 flex justify-center items-center'>
                    <p
                        className={`stat-value font-medium ${compact ? 'text-base' : 'text-lg'} text-center select-none text-stroke-sm leading-[initial] [text-shadow:0_0_2px_#000,0_0_2px_#000,0_1px_3px_#000]`}
                    >
                        {statValue}
                    </p>
                </div>
            </div>
            {showControls && flank && flankButton('Raise', faPlus, onPlusClick)}
        </div>
    );
};

export default StatDisplay;
