import React from 'react';
import classNames from 'classnames';
import { cardImageSrc, markImage, useImageStatus } from '../../imageCache';
import CardFallback from './CardFallback';

// An opaque card-shaped placeholder while the image loads: a frame, the art and the text box, gently pulsing
const CardSkeleton = ({ orientation }) => (
    <div
        aria-hidden
        data-card-skeleton=''
        className='absolute inset-0 rounded-[inherit] border border-zinc-700 bg-zinc-900'
    >
        <div
            className={classNames(
                'absolute inset-[7%] flex animate-pulse gap-[6%] rounded-[inherit]',
                orientation === 'horizontal' ? 'flex-row' : 'flex-col'
            )}
        >
            <div className='flex-[3] rounded-sm bg-zinc-800' />
            <div className='flex flex-[2] flex-col justify-center gap-[12%]'>
                <div className='h-[14%] w-4/5 rounded-full bg-zinc-800' />
                <div className='h-[14%] w-full rounded-full bg-zinc-800' />
                <div className='h-[14%] w-3/5 rounded-full bg-zinc-800' />
            </div>
        </div>
    </div>
);

const CardFace = ({ code, orientation, className, disableSkeleton = false, onLoad, onError }) => {
    const src = cardImageSrc(code);
    const status = useImageStatus(src);
    const ready = status === 'loaded';
    const failed = status === 'error';

    return (
        <div data-card-face='' className='absolute inset-0 overflow-hidden rounded-[inherit]'>
            {failed && <CardFallback code={code} orientation={orientation} />}
            {!ready && !failed && !disableSkeleton && <CardSkeleton orientation={orientation} />}
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
