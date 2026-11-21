import { useLayoutEffect } from 'react';
import { computeAutoCardScale, remSize, settleAutoCardScale } from '../../cardScale';
import { classicScales, setBoardMeasure } from './boardScales';
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

        const container = containerRef.current;
        const setting = { cards, interface: interfaceSize, auto };
        let cardFit = null;
        let frame = 0;

        const update = () => {
            const rem = remSize();
            const size = container
                ? { width: container.clientWidth, height: container.clientHeight }
                : null;
            if (auto && size) {
                cardFit = settleAutoCardScale(cardFit, computeAutoCardScale({ ...size, rem }));
            }
            const measure = {
                container: size,
                viewport: { width: window.innerWidth, height: window.innerHeight },
                rem
            };
            setBoardMeasure({ ...measure, cardFit: auto ? cardFit : null });
            const scales = classicScales(setting, { ...measure, cardFit: cardFit ?? 1 });
            applyScaleProperties({
                '--card-scale': scales.cards,
                ...interfaceScaleProperties(scales.interface)
            });
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
            setBoardMeasure(null);
        };
    }, [cards, interfaceSize, auto, containerRef, ready]);
};
