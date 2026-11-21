import React, { useCallback, useEffect, useRef, useState } from 'react';
import CardImage from './CardImage';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { useCardHover } from './cardHoverStore';
import classNames from 'classnames';
import { createPortal } from 'react-dom';
import { useAdaptiveLayoutMode } from '../../boardLayoutStore';
import { remSize } from '../../cardScale';

// On the adaptive board a card held on a touch screen is shown as large as half the screen allows, in the half away
// from the finger, so the finger never covers it
const fittedPlacement = ({ x, y }, orientation) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const rem = remSize();
    const portrait = height >= width;
    const box = portrait
        ? { w: width * 0.92, h: height * 0.46 }
        : { w: width * 0.46, h: height * 0.9 };
    const units = orientation === 'horizontal' ? { w: 5.6, h: 4 } : { w: 4, h: 5.6 };
    const scale = Math.min(box.w / (units.w * rem), box.h / (units.h * rem));
    const cardWidth = units.w * rem * scale;
    const left = portrait
        ? (width - cardWidth) / 2
        : x > width / 2
          ? width * 0.02
          : width / 2 + width * 0.02;
    const top = portrait
        ? y > height / 2
            ? height * 0.02
            : height / 2 + height * 0.02
        : height * 0.05;
    return { scale, left, top, width: cardWidth };
};

const CardHover = ({ children, size = '3x-large' }) => {
    const wrapperRef = useRef(null);
    const mousePosRef = useRef({ x: 0, y: 0 });

    const { type, code, notes } = useCardHover();
    const adaptiveMode = useAdaptiveLayoutMode();
    const fitted = !!adaptiveMode && type === 'touch';

    const [isLoading, setIsLoading] = useState(false);
    const [failed, setFailed] = useState(false);
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

    const positionCallback = useCallback((width, height, type) => {
        if (wrapperRef.current && mousePosRef.current) {
            let { x, y } = mousePosRef.current;
            if (type === 'touch') {
                // Place card center & above touch position
                x -= width / 2;
                y -= height;
            }
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
            wrapperRef.current.style.top = `${y}px`;
            wrapperRef.current.style.left = `${x}px`;
        }
    }, []);

    // The card is kept hidden until its image has loaded or failed, so it never shows at the wrong shape
    useEffect(() => {
        setIsLoading(true);
        setFailed(false);
    }, [code]);

    // When the image fails, the card is drawn instead, and its shape comes from the card's details
    const { data: cards } = useGetCardsQuery({}, { skip: !failed });
    useEffect(() => {
        if (failed && cards?.[code]) {
            setOrientation(cards[code].type === 'plot' ? 'horizontal' : 'vertical');
        }
    }, [failed, cards, code]);

    // Update card position when any relevant values change
    useEffect(() => {
        positionCallback(imageSize.width, imageSize.height, type);
    }, [positionCallback, imageSize.height, imageSize.width, type]);

    // Update mouse position when pointer move or enter, then update card position
    const mousePosHandler = (e) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        positionCallback(imageSize.width, imageSize.height, type);
    };
    const imageClassName = classNames('transition-opacity', {
        'opacity-100': !isLoading,
        'opacity-0': isLoading
    });

    if (fitted && code) {
        const place = fittedPlacement(mousePosRef.current, orientation);
        return (
            <>
                <div
                    onPointerMove={mousePosHandler}
                    onPointerEnter={mousePosHandler}
                    className='w-full h-full'
                >
                    {children}
                </div>
                {createPortal(
                    <div
                        className='fixed z-[450] pointer-events-none'
                        style={{ left: place.left, top: place.top, width: place.width }}
                    >
                        <div className={imageClassName} style={{ '--card-scale': place.scale }}>
                            {!isLoading && notes?.length > 0 && (
                                <div className='mb-1.5 rounded-lg border border-default-300 bg-content1/95 px-3 py-1.5 text-xs'>
                                    {notes.map((note, index) => (
                                        <div key={index}>
                                            <span className='font-semibold text-warning'>
                                                {note.title}
                                            </span>{' '}
                                            <span className='text-default-500'>{note.reason}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <CardImage
                                code={code}
                                orientation={orientation}
                                className='rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.7)]'
                                onLoad={(e) => {
                                    setOrientation(
                                        e.target.naturalWidth > e.target.naturalHeight
                                            ? 'horizontal'
                                            : 'vertical'
                                    );
                                    setIsLoading(false);
                                }}
                                onError={() => {
                                    setFailed(true);
                                    setIsLoading(false);
                                }}
                                disableSkeleton={true}
                            />
                        </div>
                    </div>,
                    document.querySelector('[data-overlay-container="true"]')
                )}
            </>
        );
    }

    return (
        <>
            <div
                onPointerMove={mousePosHandler}
                onPointerEnter={mousePosHandler}
                className='w-full h-full'
            >
                {children}
            </div>
            {code &&
                createPortal(
                    <div ref={wrapperRef} className='fixed z-[450] pointer-events-none'>
                        <div ref={imageCallback} className={imageClassName}>
                            {!isLoading && notes?.length > 0 && (
                                <div className='mb-1.5 w-0 min-w-full overflow-hidden rounded-lg border border-default-300 bg-content1/95 shadow-lg shadow-black/60'>
                                    {notes.map((note, index) => (
                                        <div
                                            key={index}
                                            className='border-l-3 border-l-warning px-3 py-2 [&+&]:border-t [&+&]:border-t-default-200'
                                        >
                                            <div className='text-[10px] font-semibold uppercase tracking-wider text-warning'>
                                                {note.label}
                                            </div>
                                            <div className='text-sm font-semibold leading-snug text-foreground'>
                                                {note.title}
                                            </div>
                                            <div className='text-xs leading-snug text-default-500'>
                                                {note.reason}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <CardImage
                                size={size}
                                code={code}
                                orientation={orientation}
                                onLoad={(e) => {
                                    setOrientation(
                                        e.target.naturalWidth > e.target.naturalHeight
                                            ? 'horizontal'
                                            : 'vertical'
                                    );
                                    setIsLoading(false);
                                }}
                                onError={() => {
                                    setFailed(true);
                                    setIsLoading(false);
                                }}
                                disableSkeleton={true}
                            />
                        </div>
                    </div>,
                    document.querySelector('[data-overlay-container="true"]')
                )}
        </>
    );
};

export default CardHover;
