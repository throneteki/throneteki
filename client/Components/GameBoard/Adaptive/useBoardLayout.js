import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { settleAutoCardScale } from '../../../cardScale';
import { computeHudScales, computeScreenScale, resolveHudSize } from '../../../hud';
import { boardLayoutStore } from '../../../boardLayoutStore';
import {
    applyScaleProperties,
    interfaceScaleProperties,
    removeScaleProperties
} from '../useHudScale';
import { classifyLayout, computeAdaptiveScales, widestRowUnits } from './adaptiveScale';

const BoardLayoutContext = createContext('wide');
export const BoardLayoutProvider = BoardLayoutContext.Provider;
export const useLayoutMode = () => useContext(BoardLayoutContext);

const scaleProperties = ['--card-scale', '--pile-scale', '--hand-scale'];
const allProperties = [...scaleProperties, ...Object.keys(interfaceScaleProperties(1))];

const isTextEntry = (element) =>
    !!element?.matches?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]');

// Measures the board area, picks the layout mode and fits the card scales to it. While a text box has focus the
// phone's keyboard shrinks the screen, so the board is left as it was until the keyboard goes away.
export const useBoardLayout = ({ containerRef, hud, players, ready }) => {
    const [mode, setMode] = useState(null);
    const modeRef = useRef(null);
    const widestRow = widestRowUnits(players);
    const widestRowRef = useRef(widestRow);
    widestRowRef.current = widestRow;
    const updateRef = useRef(null);
    const { cards, interface: interfaceSize, auto } = hud;

    useLayoutEffect(() => {
        if (!ready) {
            return;
        }

        const root = document.documentElement;
        const container = containerRef.current;
        const settled = {};
        let frozen = isTextEntry(document.activeElement);
        let frame = 0;

        const update = () => {
            if (frozen || !container) {
                return;
            }
            const size = { width: container.clientWidth, height: container.clientHeight };
            const next = classifyLayout(size, modeRef.current);
            if (next !== modeRef.current) {
                modeRef.current = next;
                Object.keys(settled).forEach((key) => delete settled[key]);
            }

            const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
            const fitted = computeAdaptiveScales({
                mode: next,
                ...size,
                rem,
                widestRow: widestRowRef.current,
                cardsSize: resolveHudSize('cards', cards)
            });
            for (const key of Object.keys(fitted)) {
                settled[key] = settleAutoCardScale(settled[key] ?? null, fitted[key]);
            }
            const interfaceScale = computeHudScales({
                hud: { cards, interface: interfaceSize, auto },
                screen: computeScreenScale({ width: window.innerWidth, height: window.innerHeight })
            }).interface;

            applyScaleProperties({
                '--card-scale': settled.card,
                '--pile-scale': settled.pile,
                '--hand-scale': settled.hand,
                ...interfaceScaleProperties(interfaceScale)
            });
            root.dataset.boardLayout = next;
            boardLayoutStore.set(next);
            setMode(next);
        };

        const schedule = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };
        updateRef.current = schedule;

        const onFocusIn = (event) => {
            frozen = isTextEntry(event.target);
        };
        const onFocusOut = () => {
            // Focus moving straight to another text box keeps the board frozen
            requestAnimationFrame(() => {
                frozen = isTextEntry(document.activeElement);
                if (!frozen) {
                    schedule();
                }
            });
        };

        update();
        const observer = container ? new ResizeObserver(schedule) : null;
        observer?.observe(container);
        window.addEventListener('resize', schedule);
        document.addEventListener('focusin', onFocusIn);
        document.addEventListener('focusout', onFocusOut);

        return () => {
            cancelAnimationFrame(frame);
            updateRef.current = null;
            observer?.disconnect();
            window.removeEventListener('resize', schedule);
            document.removeEventListener('focusin', onFocusIn);
            document.removeEventListener('focusout', onFocusOut);
            removeScaleProperties(allProperties);
            delete root.dataset.boardLayout;
            modeRef.current = null;
            boardLayoutStore.set(null);
            setMode(null);
        };
    }, [cards, interfaceSize, auto, containerRef, ready]);

    // Cards entering or leaving play can make the widest row wider or narrower
    useLayoutEffect(() => {
        updateRef.current?.();
    }, [widestRow]);

    return mode ?? 'wide';
};
