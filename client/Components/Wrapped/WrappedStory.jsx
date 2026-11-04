import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import Logo from '../../assets/img/main_header_logo.png';
import useWrappedCards from './useWrappedCards';
import { renderCard, shareImage } from './shareCard';

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
                `throneteki-wrapped-${wrapped.year}-${card.key}.png`,
                `My ${wrapped.year} on The Iron Throne`
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
                    background: card.background
                }}
            >
                <div className='absolute inset-x-[5cqw] top-[4cqw] z-10 flex gap-[1.2cqw]'>
                    {cards.map((item, itemIndex) => (
                        <div
                            key={item.key}
                            className={`h-[0.9cqw] flex-1 rounded-full ${
                                itemIndex <= index ? 'bg-white/90' : 'bg-white/30'
                            }`}
                        />
                    ))}
                </div>

                <div
                    key={card.key}
                    className='absolute inset-0 motion-safe:animate-[wrapped-in_350ms_ease-out]'
                >
                    <div className='relative h-full px-[8cqw] pb-[14cqw] pt-[12cqw]'>
                        {card.content}
                    </div>
                </div>

                <div className='absolute inset-x-[8cqw] bottom-[5cqw] z-10 flex items-end justify-between gap-[3cqw] text-[3.4cqw] leading-[1.2] text-white/70'>
                    <img alt='The Iron Throne' className='h-[3cqw] w-auto opacity-85' src={Logo} />
                    {card.note && <span className='shrink-0 text-right'>{card.note}</span>}
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
                    Share this card
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
