import React from 'react';
import classNames from 'classnames';
import { cardImageSrc, markImage, useImageStatus } from '../../imageCache';
import CardFallback from './CardFallback';

const CardFace = ({ code, orientation, className, disableSkeleton = false, onLoad, onError }) => {
    const src = cardImageSrc(code);
    const status = useImageStatus(src);
    const ready = status === 'loaded';
    const failed = status === 'error';

    return (
        <div data-card-face='' className='absolute inset-0 overflow-hidden rounded-[inherit]'>
            {failed && <CardFallback code={code} orientation={orientation} />}
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
                    { 'opacity-0': !ready, hidden: failed },
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
        </div>
    );
};

export default CardFace;
