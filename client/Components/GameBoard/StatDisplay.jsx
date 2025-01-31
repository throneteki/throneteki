import React from 'react';
import { Image, Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Constants } from '../../constants';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const StatDisplay = ({
    showControls = true,
    statCode,
    statName,
    statValue,
    onMinusClick,
    onPlusClick
}) => {
    return (
        <div className={`${statName} min-w-12 flex justify-center items-center`}>
            {showControls && (
                <div className='flex'>
                    <Button
                        isIconOnly
                        title={`Reduce ${statName}`}
                        variant='light'
                        size='sm'
                        radius='none'
                        className='flex-col p-1.5 w-9'
                        onPress={onMinusClick}
                    >
                        <FontAwesomeIcon className='self-start' icon={faMinus} />
                    </Button>
                    <Button
                        isIconOnly
                        title={`Raise ${statName}`}
                        variant='light'
                        size='sm'
                        radius='none'
                        className='flex-col p-1.5 w-9'
                        onPress={onPlusClick}
                    >
                        <FontAwesomeIcon className='self-end' icon={faPlus} />
                    </Button>
                </div>
            )}
            <div className='absolute pointer-events-none'>
                <Image className='h-8 w-8 z-0' src={Constants.StatIconImagePaths[statCode]} />
                <div className='absolute inset-0 flex justify-center items-center'>
                    <p
                        className='stat-value font-[PoppinsMedium] text-large text-center select-none text-shadow-sm shadow-black'
                        style={{
                            lineHeight: 'initial',
                            WebkitTextStroke: '0.15em black',
                            paintOrder: 'stroke fill'
                        }}
                    >
                        {statValue}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StatDisplay;
