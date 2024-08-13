import React from 'react';
import { Image } from '@nextui-org/react';

import Minus from '../../assets/img/Minus.png';
import Plus from '../../assets/img/Plus.png';
import { Constants } from '../../constants';
import StatButton from './StatButton';

console.info(Constants);

const StatDisplay = ({
    showControls = true,
    statCode,
    statName,
    statValue,
    onMinusClick,
    onPlusClick
}) => {
    return (
        <>
            {showControls && <StatButton image={Minus} onClick={onMinusClick} />}
            <div className='font-[Bombardier] text-medium'>{statValue}</div>
            <div className={`flex h-6 w-6 items-center justify-center ${statName}`}>
                <Image src={Constants.StatIconImagePaths[statCode]} />
            </div>
            {showControls && <StatButton image={Plus} onClick={onPlusClick} />}
        </>
    );
};

export default StatDisplay;
