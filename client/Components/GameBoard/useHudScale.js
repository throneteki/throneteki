import { useLayoutEffect } from 'react';
import { computeAutoCardScale, settleAutoCardScale } from '../../cardScale';
import { computeHudScales, computeScreenScale } from '../../hud';
import { holdFlip } from '../../flip';

const rescaleHold = 400;
let rescaleTimer = null;
const properties = { cards: ['--card-scale'], interface: ['--ui-scale', '--text-scale'] };

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
            let changed = false;
            for (const kind of Object.keys(properties)) {
                properties[kind].forEach((property) => {
                    const value = String(scales[kind]);
                    changed ||= root.style.getPropertyValue(property) !== value;
                    root.style.setProperty(property, value);
                });
            }
            if (changed) {
                // Resizing the board is not a card moving: nothing should glide or animate because of it
                holdFlip(rescaleHold);
                root.dataset.rescaling = '';
                clearTimeout(rescaleTimer);
                rescaleTimer = setTimeout(() => delete root.dataset.rescaling, rescaleHold);
            }
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
            for (const property of Object.values(properties).flat()) {
                root.style.removeProperty(property);
            }
        };
    }, [cards, interfaceSize, auto, containerRef, ready]);
};
