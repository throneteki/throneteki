import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { settleAutoCardScale } from '../../../cardScale';
import { boardLayoutStore } from '../../../boardLayoutStore';
import { adaptiveScales, setBoardMeasure } from '../boardScales';
import {
    applyScaleProperties,
    interfaceScaleProperties,
    removeScaleProperties
} from '../useHudScale';
import { classifyLayout, stripExtraUnits, widestRowUnits } from './adaptiveScale';

const BoardLayoutContext = createContext('wide');
export const BoardLayoutProvider = BoardLayoutContext.Provider;
export const useLayoutMode = () => useContext(BoardLayoutContext);

const scaleProperties = ['--card-scale', '--pile-scale', '--hand-scale'];
const allProperties = [...scaleProperties, ...Object.keys(interfaceScaleProperties(1))];

// Only something typed into brings up the phone's keyboard: a switch, radio or slider does not
export const isTextEntry = (element) =>
    !!element?.matches?.(
        'input:not([type="checkbox"], [type="radio"], [type="range"], [type="button"], [type="submit"]), textarea, [contenteditable=""], [contenteditable="true"]'
    );

// Measures the board area, picks the layout mode and fits the card scales to it. While a text box has focus the
// phone's keyboard shrinks the screen, so the board is left as it was until the keyboard goes away.
export const useBoardLayout = ({ containerRef, hud, players, ready }) => {
    const [mode, setMode] = useState(null);
    const modeRef = useRef(null);
    const widestRow = widestRowUnits(players);
    const stripExtra = stripExtraUnits(players);
    const contentRef = useRef({ widestRow, stripExtra });
    contentRef.current = { widestRow, stripExtra };
    const updateRef = useRef(null);
    // The HUD settings are read when measuring, not set up with: changing one re-measures the board rather than
    // taking it down and putting it back, which would drop the layout for a moment
    const { cards, interface: interfaceSize, auto } = hud;
    const hudRef = useRef(hud);
    hudRef.current = { cards, interface: interfaceSize, auto };

    useLayoutEffect(() => {
        if (!ready) {
            return;
        }

        const root = document.documentElement;
        const container = containerRef.current;
        const settled = {};
        let measured = null;
        let measuredSetting = null;
        let frozen = isTextEntry(document.activeElement);
        let frame = 0;

        const update = () => {
            if (frozen || !container) {
                return;
            }
            const size = { width: container.clientWidth, height: container.clientHeight };
            const next = classifyLayout(size, modeRef.current);
            // Cards coming and going only grow the board's cards once they would grow by a clear step, so they do
            // not shrink and grow back as the rows change. A new size of board (the screen turned, the navbar
            // hidden), a new mode or new HUD settings are fitted to straight away.
            const settingKey = JSON.stringify(hudRef.current);
            const resized =
                !measured ||
                Math.abs(measured.width - size.width) > 2 ||
                Math.abs(measured.height - size.height) > 2 ||
                settingKey !== measuredSetting;
            measured = size;
            measuredSetting = settingKey;
            if (next !== modeRef.current || resized) {
                modeRef.current = next;
                Object.keys(settled).forEach((key) => delete settled[key]);
            }

            const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
            const measure = {
                container: size,
                viewport: { width: window.innerWidth, height: window.innerHeight },
                rem,
                mode: next,
                content: { ...contentRef.current }
            };
            setBoardMeasure(measure);
            const fitted = adaptiveScales(hudRef.current, measure);
            for (const key of ['cards', 'pile', 'hand']) {
                settled[key] = settleAutoCardScale(settled[key] ?? null, fitted[key]);
            }

            applyScaleProperties({
                '--card-scale': settled.cards,
                '--pile-scale': settled.pile,
                '--hand-scale': settled.hand,
                ...interfaceScaleProperties(fitted.interface)
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
            setBoardMeasure(null);
            delete root.dataset.boardLayout;
            modeRef.current = null;
            boardLayoutStore.set(null);
            setMode(null);
        };
    }, [containerRef, ready]);

    // Cards entering or leaving play, shadows or out of game change the room the rows and strips need, and a new
    // card or interface size changes how much of it to use
    useLayoutEffect(() => {
        updateRef.current?.();
    }, [widestRow, stripExtra, cards, interfaceSize, auto]);

    return mode ?? 'wide';
};
