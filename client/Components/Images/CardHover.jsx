import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import CardImage from './CardImage';

const CardHover = ({ className, children, code, size = '3xl', radius = 'lg' }) => {
    const [pointerType, setPointerType] = useState(false);
    const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const containerCallback = useCallback((node) => {
        if (node) {
            const resizeObserver = new ResizeObserver(([entry]) => {
                const width = entry.target.clientWidth;
                const height = entry.target.clientHeight;
                setImageSize({ width, height });
            });
            resizeObserver.observe(node);
        }
    }, []);

    const imageStyle = useMemo(() => {
        let { x, y } = pointerPos;
        if (['touch', 'pen'].includes(pointerType)) {
            // Offset pointer position to place image above & center of touch point (rather than below & right)
            x -= imageSize.width / 2;
            y -= imageSize.height;
        }

        if (y < 0) {
            y = 0;
        } else if (y + imageSize.height >= window.innerHeight) {
            y = window.innerHeight - imageSize.height;
        }
        if (x < 0) {
            x = 0;
        } else if (x + imageSize.width >= window.innerWidth) {
            x = window.innerWidth - imageSize.width;
        }
        return { left: x + 'px', top: y + 'px' };
    }, [pointerPos, pointerType, imageSize]);

    // Used to hide the image until it is ready to be positioned in above memo
    const imageAvailable = imageSize.width > 0 && imageSize.height > 0;

    const wrapperClassName = useMemo(
        () =>
            classNames(className, {
                'select-none': ['touch', 'pen'].includes(pointerType) // Disables text selection on touch/pen devices, but not desktop
            }),
        [className, pointerType]
    );

    return (
        <div
            className={wrapperClassName}
            onPointerMove={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                } else if (e.pointerType === 'mouse') {
                    setPointerPos({ x: e.clientX, y: e.clientY });
                }
            }}
            onPointerEnter={(e) => {
                if (['touch', 'pen'].includes(e.pointerType)) {
                    e.preventDefault();
                    e.stopPropagation();
                    setPointerPos({ x: e.clientX, y: e.clientY });
                    setPointerType(e.pointerType);
                } else if (e.pointerType === 'mouse') {
                    setPointerType(e.pointerType);
                }
            }}
            onPointerLeave={() => setPointerType(null)}
            onContextMenu={(e) => e.preventDefault()}
        >
            {children}
            {!!pointerType && (
                <div
                    className={'fixed z-50 pointer-events-none'}
                    style={imageStyle}
                    ref={containerCallback}
                >
                    <CardImage
                        className={classNames('border-white border-2', {
                            hidden: !imageAvailable
                        })}
                        size={size}
                        radius={radius}
                        code={code}
                    />
                </div>
            )}
        </div>
    );
};

export default CardHover;
