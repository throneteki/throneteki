import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { cardImageSrc } from '../../cardImageSrc';
import { Constants } from '../../constants';
import CardFallback from './CardFallback';
import CardSkeleton, { skeletonKind } from './CardSkeleton';

// type: the card's type, for its placeholder to follow that type's layout while the image loads
const CardFace = ({
    code,
    type,
    orientation,
    className,
    disableSkeleton = false,
    onLoad,
    onError
}) => {
    const src = cardImageSrc(code);
    const imageRef = useRef(null);
    const [status, setStatus] = useState({ src, value: 'loading' });
    const current = status.src === src ? status.value : 'loading';
    const ready = current === 'loaded';
    const failed = current === 'error';

    // An image the browser already has is complete before its load event, so it shows at once with no placeholder
    useLayoutEffect(() => {
        const image = imageRef.current;
        if (image?.complete && image.naturalWidth > 0) {
            setStatus({ src, value: 'loaded' });
        }
    }, [src]);

    return (
        <div data-card-face='' className='absolute inset-0 overflow-hidden rounded-[inherit]'>
            {failed && <CardFallback code={code} orientation={orientation} />}
            {!ready && !failed && !disableSkeleton && (
                <CardSkeleton
                    kind={skeletonKind(
                        code,
                        type,
                        orientation,
                        !!Constants.FactionsImagePaths[code]
                    )}
                    orientation={orientation}
                />
            )}
            <img
                ref={imageRef}
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
                    setStatus({ src, value: 'loaded' });
                    onLoad && onLoad(event);
                }}
                onError={(event) => {
                    setStatus({ src, value: 'error' });
                    onError && onError(event);
                }}
            />
        </div>
    );
};

export default CardFace;
