import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Image } from '@heroui/react';
import { Constants } from '../../constants';
import { cardClass } from '../../util';

const CardImage = ({
    code,
    orientation = 'vertical',
    className,
    size = 'normal',
    disableSkeleton = false,
    onLoad = () => true,
    onError = () => true
}) => {
    const containerClass = useMemo(
        () => classNames('overflow-hidden', className, cardClass(size, orientation)),
        [className, orientation, size]
    );

    // When "code" is faction, point to that path instead
    const src = Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;

    return (
        <div className={containerClass}>
            {/* Heroui forces an unnecessary "z-10" on the img tag, so we need to override it */}
            <Image
                key={src}
                src={src}
                radius='none'
                classNames={{ img: 'z-0' }}
                disableSkeleton={disableSkeleton}
                onLoad={onLoad}
                onError={onError}
            />
        </div>
    );
};

export default CardImage;
