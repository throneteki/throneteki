import React from 'react';
import classNames from 'classnames';
import { cardImageSrc, markImage, useImageStatus } from '../../imageCache';

const CardFace = ({ code, className, disableSkeleton = false, onLoad, onError }) => {
    const src = cardImageSrc(code);
    const status = useImageStatus(src);
    const ready = status === 'loaded';

    return (
        <>
            {!status && !disableSkeleton && (
                <div className='absolute inset-0 animate-pulse bg-default-100/60' />
            )}
            <img
                src={src}
                alt=''
                draggable={false}
                decoding={ready ? 'sync' : 'async'}
                className={classNames(
                    'absolute left-0 top-0 h-full w-full pointer-events-none select-none',
                    { 'opacity-0': !ready && status !== 'error' },
                    className
                )}
                onLoad={(event) => {
                    markImage(src, 'loaded');
                    onLoad && onLoad(event);
                }}
                onError={(event) => {
                    markImage(src, 'error');
                    onError && onError(event);
                }}
            />
        </>
    );
};

export default CardFace;
