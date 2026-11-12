import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import CardFace from './CardFace';
import { cardBoxClass, resolveImageScale } from '../../cardScale';

const CardImage = forwardRef(function CardImage(
    { code, orientation = 'vertical', className, size, disableSkeleton = false, onLoad, onError },
    ref
) {
    const scale = size === undefined ? null : resolveImageScale(size);
    const style = useMemo(() => (scale === null ? undefined : { '--card-scale': scale }), [scale]);

    return (
        <div
            className={classNames('relative overflow-hidden', cardBoxClass(orientation), className)}
            style={style}
            ref={ref}
        >
            <CardFace
                code={code}
                orientation={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
                disableSkeleton={disableSkeleton}
                onLoad={onLoad}
                onError={onError}
            />
        </div>
    );
});
export default CardImage;
