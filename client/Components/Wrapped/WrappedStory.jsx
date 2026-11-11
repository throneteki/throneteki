import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import Logo from '../../assets/img/main_header_logo.png';
import useWrappedCards, { Gold, Ink } from './useWrappedCards';
import { renderCard, shareImage } from './shareCard';

const PageBackground = 'radial-gradient(ellipse at 50% 35%, #fbf6e9 0%, #f1e6c9 55%, #e1cfa3 100%)';
const CoverBackground =
    'radial-gradient(ellipse at 50% 30%, #fdfcf8 0%, #f0ece2 50%, #d9d2c1 100%)';

// The site logo is light, for the dark header, so it's darkened to read on parchment
const InkLogo = { filter: 'brightness(0.3) sepia(0.6)' };

const WrappedStory = ({ wrapped, username }) => {
    const cards = useWrappedCards(wrapped, username);
    const [index, setIndex] = useState(0);
    const [isSharing, setIsSharing] = useState(false);
    const frameRef = useRef(null);

    const card = cards[Math.min(index, cards.length - 1)];
    const go = useCallback(
        (step) => setIndex((current) => Math.min(Math.max(current + step, 0), cards.length - 1)),
        [cards.length]
    );

    useEffect(() => {
        const onKeyDown = (event) => {
            const target = event.target;
            if (target.closest?.('input, textarea, select, [contenteditable="true"]')) {
                return;
            }

            // Space only moves on when nothing is focused, so it still presses whichever button is
            const isSpace = event.key === ' ' && (target === document.body || target === document);

            if (event.key === 'ArrowRight' || isSpace) {
                event.preventDefault();
                go(1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                go(-1);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go]);

    const share = async () => {
        setIsSharing(true);

        try {
            const blob = await renderCard(frameRef.current);
            const result = await shareImage(
                blob,
                `white-book-${wrapped.year}-${card.key}.png`,
                `My ${wrapped.year} page in the White Book`
            );

            if (result === 'downloaded') {
                toast.success('Image saved');
            }
        } catch {
            toast.error('The image could not be made. Please try again.');
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className='flex w-full flex-col items-center gap-3 py-2'>
            <div
                ref={frameRef}
                className='relative aspect-[9/16] select-none overflow-hidden rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
                style={{
                    width: 'min(100%, calc((100dvh - 10rem) * 9 / 16))',
                    containerType: 'inline-size',
                    background: card.cover ? CoverBackground : PageBackground
                }}
            >
                <div
                    className='pointer-events-none absolute inset-[4cqw] rounded-[1.5cqw]'
                    style={{
                        border: `${card.cover ? 1.4 : 0.9}cqw double ${Gold}`,
                        boxShadow: 'inset 0 0 6cqw rgba(120, 90, 40, 0.18)'
                    }}
                />
                <div
                    className='absolute right-[11cqw] top-0 z-10 h-[15cqw] w-[6.5cqw] shadow-[0_0.6cqw_1.2cqw_rgba(42,31,20,0.35)]'
                    style={{
                        background: card.accent,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)'
                    }}
                />
                <div
                    className='absolute left-[10cqw] right-[22cqw] top-[1.8cqw] z-10 flex gap-[1cqw]'
                    data-share-exclude
                >
                    {cards.map((item, itemIndex) => (
                        <div
                            key={item.key}
                            className='h-[0.7cqw] flex-1 rounded-full'
                            style={{
                                background: itemIndex <= index ? `${Ink}bb` : `${Ink}26`
                            }}
                        />
                    ))}
                </div>

                <div
                    key={card.key}
                    className='absolute inset-0 motion-safe:animate-[wrapped-in_350ms_ease-out]'
                >
                    <div className='relative h-full px-[11cqw] pb-[15cqw] pt-[14cqw]'>
                        {card.content}
                    </div>
                </div>

                <div
                    className="absolute inset-x-[10cqw] bottom-[7cqw] z-10 flex items-end justify-between gap-[3cqw] font-['EB_Garamond'] text-[3.6cqw] italic leading-[1.2]"
                    style={{ color: Gold }}
                >
                    <img
                        alt='The Iron Throne'
                        className='h-[2.8cqw] w-auto'
                        src={Logo}
                        style={InkLogo}
                    />
                    {!card.cover && (
                        <span className='flex shrink-0 flex-col items-end gap-[0.8cqw] text-right'>
                            {card.note && <span>{card.note}</span>}
                            <span>
                                Page {index} of {cards.length - 1}
                            </span>
                        </span>
                    )}
                </div>

                <button
                    aria-label='Previous'
                    className='absolute inset-y-0 left-0 z-20 w-[30%] cursor-w-resize'
                    data-share-exclude
                    type='button'
                    onClick={() => go(-1)}
                />
                <button
                    aria-label='Next'
                    className='absolute inset-y-0 right-0 z-20 w-[70%] cursor-e-resize'
                    data-share-exclude
                    type='button'
                    onClick={() => go(1)}
                />
            </div>

            <div className='flex items-center gap-2'>
                <Button
                    aria-label='Previous'
                    isDisabled={index === 0}
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={() => go(-1)}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button
                    color='primary'
                    isLoading={isSharing}
                    size='sm'
                    startContent={!isSharing && <FontAwesomeIcon icon={faShareNodes} />}
                    onPress={share}
                >
                    Share this page
                </Button>
                <Button
                    aria-label='Next'
                    isDisabled={index === cards.length - 1}
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={() => go(1)}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </div>
        </div>
    );
};

export default WrappedStory;
