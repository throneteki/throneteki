import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Image } from '@heroui/react';
import { Constants } from '../../constants';
import { cardClass } from '../../util';

const CardImage = ({ code, orientation = 'vertical', className, size = 'normal' }) => {
    const containerClass = useMemo(
        () => classNames('overflow-hidden', className, cardClass(size, orientation)),
        [className, orientation, size]
    );

    // When "code" is faction, point to that path instead
    const src = Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;

    return (
        <div className={containerClass}>
            <Image src={src} radius='none' />
        </div>
    );
};

export default CardImage;
