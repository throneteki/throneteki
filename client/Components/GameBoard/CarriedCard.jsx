import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import CardImage from '../Images/CardImage';
import { elevation } from '../../tableFeel';
import { dragStore, useUnderTarget } from './dragStore';
import { motionOff } from '../../flip';
import { cardScaleOf, remSize } from '../../cardScale';

const tuckTime = 160;

const overlayHost = () => document.body;

const stackOf = (uuid) => document.querySelector(`[data-flip="${CSS.escape(uuid)}"]`);
const stripOf = (stack) =>
    [...stack.children].find((child) => child.querySelector(':scope > .underneath'));

// One card width at the board's card size, in pixels
const cardUnit = () => (cardScaleOf(document.documentElement) ?? 1) * remSize();

// Where a card placed underneath this stack will lie. The cards underneath are drawn after the card and its
// attachments, peeking out below the last of them, each a sixth of a card further right than the one before.
const underneathSpot = (stack, carriedUuid) => {
    const unit = cardUnit();
    const width = 4 * unit;
    const height = 5.6 * unit;
    const panel = stripOf(stack)?.querySelector(':scope > .underneath');
    if (panel) {
        const count = [...panel.querySelectorAll(':scope > [data-flip]')].filter(
            (card) => card.dataset.flip !== carriedUuid
        ).length;
        const rect = panel.getBoundingClientRect();
        return { left: rect.left + (count * width) / 6, top: rect.top, width, height };
    }

    const layers = [...stack.children].filter((child) =>
        child.matches('[data-flip-slot], .card-attachment')
    );
    const last = layers[layers.length - 1] ?? stack;
    return {
        left: stack.getBoundingClientRect().left,
        top: last.getBoundingClientRect().bottom - 5.04 * unit,
        width,
        height
    };
};

// The stack is drawn again above the carried card, so it shows tucked beneath as it will lie once dropped
const coverWith = (stack) => {
    const rect = stack.getBoundingClientRect();
    const cover = stack.cloneNode(true);
    stripOf(cover)?.remove();
    for (const el of [cover, ...cover.querySelectorAll('*')]) {
        for (const name of el.getAttributeNames()) {
            if (name.startsWith('data-flip')) {
                el.removeAttribute(name);
            }
        }
    }
    cover.style.cssText += `;position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;margin:0;z-index:401;pointer-events:none;filter:drop-shadow(0 6px 10px rgba(0,0,0,0.55))`;
    overlayHost().append(cover);
    return cover;
};

// The card follows the pointer straight from pointer events, so layout changes while dragging cannot offset it
const CarriedCard = ({ uuid: carriedUuid, code, orientation, start, grab, scale, rectRef }) => {
    const ref = useRef(null);
    const pointer = useRef(start);
    const tucked = useRef(false);
    const under = useUnderTarget();

    useLayoutEffect(() => {
        const element = ref.current;
        const place = (x, y) => {
            pointer.current = { x, y };
            if (tucked.current) {
                return;
            }
            const left = x - grab.x;
            const top = y - grab.y;
            element.style.translate = `${left}px ${top}px`;
            rectRef.current = { left, top, width: grab.width, height: grab.height };
        };

        place(start.x, start.y);
        const onMove = (event) => place(event.clientX, event.clientY);
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, [grab, rectRef, start]);

    useLayoutEffect(() => {
        const element = ref.current;
        const stack = under && stackOf(under);
        if (!stack) {
            return;
        }

        const spot = underneathSpot(stack, carriedUuid);
        const cover = coverWith(stack);
        const glide = motionOff()
            ? 'none'
            : `translate ${tuckTime}ms ease-out, scale ${tuckTime}ms ease-out, rotate ${tuckTime}ms ease-out`;
        // A knelt card is carried on its side; cards underneath lie upright, so it is turned to stand up.
        // Scaled and turned about its centre, so the card is moved to where its centre will be.
        const sideways = grab.width > grab.height;
        const fit = spot.width / (sideways ? grab.height : grab.width);
        const left = spot.left + (spot.width - grab.width) / 2;
        const top = spot.top + (spot.height - grab.height) / 2;
        element.style.transition = glide;
        element.style.translate = `${left}px ${top}px`;
        element.style.scale = String(fit);
        element.style.rotate = sideways ? '-90deg' : '0deg';
        rectRef.current = {
            left: spot.left,
            top: spot.top,
            width: spot.width,
            height: spot.height
        };
        tucked.current = true;

        return () => {
            // Dropped here, the stack keeps covering the card until the server puts it underneath
            if (dragStore.ghostTarget() === 'underneath') {
                cover.querySelector('.under-target')?.remove();
                dragStore.holdCover(cover);
            } else {
                cover.remove();
            }
            tucked.current = false;
            const back = { x: pointer.current.x - grab.x, y: pointer.current.y - grab.y };
            element.style.translate = `${back.x}px ${back.y}px`;
            element.style.scale = String(elevation.carried);
            element.style.rotate = '0deg';
            rectRef.current = { left: back.x, top: back.y, width: grab.width, height: grab.height };
            setTimeout(() => {
                element.style.transition = '';
            }, tuckTime);
        };
    }, [under, grab, rectRef, carriedUuid]);

    // A knelt card's image is an upright box with the picture turned onto its side within it, so the card is
    // scaled, stood up and turned over about the middle of what is seen, not the middle of that box
    const middle = `${grab.width / 2}px ${grab.height / 2}px`;

    return createPortal(
        <div
            ref={ref}
            data-carried=''
            className='fixed left-0 top-0 z-[400] pointer-events-none'
            style={{
                scale: String(elevation.carried),
                transformOrigin: middle,
                '--card-scale': scale
            }}
        >
            {/* Turned face down while it shows where it would go under a card, as it will lie there */}
            <div
                className='relative'
                style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: middle,
                    transform: `perspective(700px) rotateY(${under ? 180 : 0}deg)`,
                    transition: motionOff() ? 'none' : `transform ${tuckTime}ms ease-in-out`
                }}
            >
                <div data-carried-face='' style={{ backfaceVisibility: 'hidden' }}>
                    <CardImage
                        code={code}
                        orientation={orientation}
                        className='shadow-[0_14px_22px_rgba(0,0,0,0.5)]'
                    />
                </div>
                <div
                    data-carried-back=''
                    className='absolute inset-0'
                    style={{
                        backfaceVisibility: 'hidden',
                        transformOrigin: middle,
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <CardImage
                        code='cardback'
                        orientation={orientation}
                        className='shadow-[0_14px_22px_rgba(0,0,0,0.5)]'
                    />
                </div>
            </div>
        </div>,
        overlayHost()
    );
};

export default CarriedCard;
