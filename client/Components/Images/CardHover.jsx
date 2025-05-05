import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardImage from './CardImage';
import { Spinner } from '@heroui/react';
import { CardHoverContext } from './CardHoverContext';
import classNames from 'classnames';

const CardHover = ({ className, children, size = '3x-large' }) => {
    const wrapperRef = useRef(null);
    const spinnerRef = useRef(null);
    const mousePosRef = useRef({ x: 0, y: 0 });

    const [type, setType] = useState(null);
    const [code, setCode] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [imageSize, setImageSize] = useState({});
    const [orientation, setOrientation] = useState(null);

    const imageCallback = useCallback((node) => {
        if (node) {
            const resizeObserver = new ResizeObserver(([entry]) => {
                const width = entry.target.clientWidth;
                const height = entry.target.clientHeight;
                setImageSize({ width, height });
            });
            resizeObserver.observe(node);
        }
    }, []);

    const positionCallback = useCallback((width, height, type, isLoading) => {
        if (wrapperRef.current && mousePosRef.current) {
            let { x, y } = mousePosRef.current;
            if (isLoading) {
                // Center the loading spinner to pointer
                x -= (spinnerRef.current?.clientWidth || 0) / 2;
                y -= (spinnerRef.current?.clientHeight || 0) / 2;
            } else if (type === 'touch') {
                // Place card center & above touch position
                x -= width / 2;
                y -= height;
            }
            if (!isLoading) {
                if (y < 0) {
                    y = 0;
                } else if (y + height >= window.innerHeight) {
                    y = window.innerHeight - height;
                }
                if (x < 0) {
                    x = 0;
                } else if (x + width >= window.innerWidth) {
                    x = window.innerWidth - width;
                }
            }
            wrapperRef.current.style.top = `${y}px`;
            wrapperRef.current.style.left = `${x}px`;
        }
    }, []);

    // Update loading status when card code changes
    useEffect(() => {
        setIsLoading(true);
    }, [code]);

    // Update card position when any relevant values change
    useEffect(() => {
        positionCallback(imageSize.width, imageSize.height, type, isLoading);
    }, [positionCallback, imageSize.height, imageSize.width, isLoading, type]);

    // Update mouse position when pointer move or enter, then update card position
    const mousePosHandler = (e) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        positionCallback(imageSize.width, imageSize.height, type, isLoading);
    };
    const imageClassName = classNames('transition-opacity', {
        'opacity-100': !isLoading,
        'opacity-0': isLoading
    });

    return (
        <CardHoverContext.Provider value={{ type, setType, code, setCode }}>
            <div
                onPointerMove={mousePosHandler}
                onPointerEnter={mousePosHandler}
                className={className}
            >
                {children}
            </div>
            <div ref={wrapperRef} className='fixed z-[250] pointer-events-none'>
                {code && (
                    <>
                        {isLoading && <Spinner ref={spinnerRef} size='lg' color='white' />}
                        <CardImage
                            ref={imageCallback}
                            className={imageClassName}
                            size={size}
                            code={code}
                            orientation={orientation}
                            onLoad={(e) => {
                                setOrientation(
                                    e.target.width > e.target.height ? 'horizontal' : 'vertical'
                                );
                                setIsLoading(false);
                            }}
                            disableSkeleton={true}
                        />
                    </>
                )}
            </div>
        </CardHoverContext.Provider>
    );
};

export default CardHover;
