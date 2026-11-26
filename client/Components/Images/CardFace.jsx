import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { cardImageSrc } from '../../cardImageSrc';
import { Constants } from '../../constants';
import CardFallback, { slowWatermark } from './CardFallback';
import CardSkeleton, { skeletonKind } from './CardSkeleton';

// An image still loading after this long has the card drawn from its details under it, as a failed one does
const slowImageMs = 3000;

// Images that have loaded on this page. The browser has them, but may still check with the server (Firefox, where they
// are sent no-cache) or decode them before a new copy is drawn, which must not bring the placeholder back.
const loadedImages = new Set();

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
    const known = (image) => (loadedImages.has(image) ? 'loaded' : 'loading');
    const [status, setStatus] = useState(() => ({ src, value: known(src) }));
    const current = status.src === src ? status.value : known(src);
    const ready = current === 'loaded';
    const failed = current === 'error';
    const [slowSrc, setSlowSrc] = useState(null);
    const slow = !ready && !failed && slowSrc === src;

    useEffect(() => {
        if (ready || failed) {
            return;
        }
        const timer = setTimeout(() => setSlowSrc(src), slowImageMs);
        return () => clearTimeout(timer);
    }, [src, ready, failed]);

    // An image the browser already has is complete before its load event, so it shows at once with no placeholder
    useLayoutEffect(() => {
        const image = imageRef.current;
        if (loadedImages.has(src) || (image?.complete && image.naturalWidth > 0)) {
            setStatus({ src, value: 'loaded' });
        }
    }, [src]);

    return (
        <div data-card-face='' className='absolute inset-0 overflow-hidden rounded-[inherit]'>
            {failed && <CardFallback code={code} orientation={orientation} />}
            {slow && (
                <CardFallback code={code} orientation={orientation} watermark={slowWatermark} />
            )}
            {!ready && !failed && !slow && !disableSkeleton && (
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
            {/* Shown while it loads, over the placeholder, so it reveals itself as it arrives */}
            <img
                ref={imageRef}
                src={src}
                alt=''
                draggable={false}
                decoding={ready ? 'sync' : 'async'}
                className={classNames(
                    'absolute left-0 top-0 h-full w-full pointer-events-none select-none',
                    { hidden: failed },
                    className
                )}
                onLoad={(event) => {
                    loadedImages.add(src);
                    setStatus({ src, value: 'loaded' });
                    onLoad && onLoad(event);
                }}
                onError={(event) => {
                    loadedImages.delete(src);
                    setStatus({ src, value: 'error' });
                    onError && onError(event);
                }}
            />
        </div>
    );
};

export default CardFace;
