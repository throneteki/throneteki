import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Image } from '@heroui/react';
import { Constants } from '../../constants';

const CardImage = ({ code, className, size = 'md', radius = 'md', selected }) => {
    const [isRotated, setIsRotated] = useState(false);

    const imageCallback = useCallback((node) => {
        if (node) {
            const resizeObserver = new ResizeObserver(([e]) => {
                const width = e.target.clientWidth;
                const height = e.target.clientHeight;
                setIsRotated(width > height);
            });
            resizeObserver.observe(node);
        }
    }, []);

    const containerClass = useMemo(() => {
        return classNames('rounded-md', {
            'outline outline-4 outline-green-600': selected,
            'card-sm': !isRotated && size === 'sm',
            'card-md': !isRotated && size === 'md',
            'card-lg': !isRotated && size === 'lg',
            'card-xl': !isRotated && size === 'xl',
            'card-2xl': !isRotated && size === '2xl',
            'card-3xl': !isRotated && size === '3xl',
            'card-4xl': !isRotated && size === '4xl',
            'card-rotated-sm': isRotated && size === 'sm',
            'card-rotated-md': isRotated && size === 'md',
            'card-rotated-lg': isRotated && size === 'lg',
            'card-rotated-xl': isRotated && size === 'xl',
            'card-rotated-2xl': isRotated && size === '2xl',
            'card-rotated-3xl': isRotated && size === '3xl',
            'card-rotated-4xl': isRotated && size === '4xl'
        });
    }, [isRotated, selected, size]);

    // When "code" is faction, point to that path instead
    const src = Constants.FactionsImagePaths[code] || `/img/cards/${code}.png`;

    return (
        <div className={containerClass}>
            <Image className={className} src={src} radius={radius} ref={imageCallback} />
        </div>
    );
};

export default CardImage;
