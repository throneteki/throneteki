import { useLayoutEffect } from 'react';
import { computeAutoCardScale, settleAutoCardScale } from '../../cardScale';
import { computeHudScales, computeScreenScale } from '../../hud';
import { holdFlip } from '../../flip';

const rescaleHold = 400;
let rescaleTimer = null;
const properties = { cards: ['--card-scale'], interface: ['--ui-scale', '--text-scale'] };

// Sent on the window when the board's scales change, for parts that measure themselves in cards
export const boardRescaleEvent = 'boardrescale';

// Sets the board's scale variables on the page. Resizing the board is not a card moving: nothing should glide or
// animate because of it
export const applyScaleProperties = (values) => {
    const root = document.documentElement;
    let changed = false;
    for (const [property, value] of Object.entries(values)) {
        const text = String(value);
        changed ||= root.style.getPropertyValue(property) !== text;
        root.style.setProperty(property, text);
    }
    if (changed) {
        holdFlip(rescaleHold);
        root.dataset.rescaling = '';
        clearTimeout(rescaleTimer);
        rescaleTimer = setTimeout(() => delete root.dataset.rescaling, rescaleHold);
        window.dispatchEvent(new Event(boardRescaleEvent));
    }
};

export const removeScaleProperties = (names) => {
    for (const property of names) {
        document.documentElement.style.removeProperty(property);
    }
};

export const interfaceScaleProperties = (scale) =>
    Object.fromEntries(properties.interface.map((property) => [property, scale]));

export const useHudScale = (hud, containerRef, ready = true) => {
    const { cards, interface: interfaceSize, auto } = hud;

    useLayoutEffect(() => {
        if (!ready) {
            return;
        }

        const root = document.documentElement;
        const container = containerRef.current;
        const setting = { cards, interface: interfaceSize, auto };
        let cardFit = null;
        let frame = 0;

        const apply = () => {
            const scales = computeHudScales({
                hud: setting,
                cardFit: cardFit ?? 1,
                screen: computeScreenScale({ width: window.innerWidth, height: window.innerHeight })
            });
            applyScaleProperties({
                '--card-scale': scales.cards,
                ...interfaceScaleProperties(scales.interface)
            });
        };

        const update = () => {
            if (auto && container) {
                const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
                cardFit = settleAutoCardScale(
                    cardFit,
                    computeAutoCardScale({
                        width: container.clientWidth,
                        height: container.clientHeight,
                        rem
                    })
                );
            }
            apply();
        };

        update();
        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        const observer = auto && container ? new ResizeObserver(schedule) : null;
        observer?.observe(container);
        window.addEventListener('resize', schedule);

        return () => {
            cancelAnimationFrame(frame);
            observer?.disconnect();
            window.removeEventListener('resize', schedule);
            removeScaleProperties(Object.values(properties).flat());
        };
    }, [cards, interfaceSize, auto, containerRef, ready]);
};
