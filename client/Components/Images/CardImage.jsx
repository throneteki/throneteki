import React, { forwardRef, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Constants } from '../../constants';
import { cardClass } from '../../util';

const CardImage = forwardRef(function CardImage(
    {
        code,
        orientation = 'vertical',
        className,
        size = 'normal',
        disableSkeleton = false,
        onLoad = () => true,
        onError = () => true
    },
    ref
) {
    const containerClass = useMemo(
        () => classNames('overflow-hidden', className, cardClass(size, orientation)),
        [className, orientation, size]
    );

    // When "code" is faction, point to that path instead
    const src = Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;
    const [loadedSrc, setLoadedSrc] = useState(null);
    const isLoaded = loadedSrc === src;

    return (
        <div className={containerClass} ref={ref}>
            <img
                key={src}
                src={src}
                alt=''
                className={classNames('pointer-events-none h-full w-full', {
                    'animate-pulse bg-white/5': !disableSkeleton && !isLoaded
                })}
                onLoad={(event) => {
                    setLoadedSrc(src);
                    onLoad(event);
                }}
                onError={onError}
            />
        </div>
    );
});
export default CardImage;
