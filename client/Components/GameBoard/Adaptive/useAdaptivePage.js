import { useLayoutEffect } from 'react';
import { isTextEntry } from './useBoardLayout';

// While the adaptive board shows, it draws under a phone's notch (padding itself clear) and the page cannot scroll,
// pull to refresh or bounce
export const useAdaptivePage = (active) => {
    useLayoutEffect(() => {
        if (!active) {
            return;
        }

        const meta = document.querySelector('meta[name="viewport"]');
        const viewport = meta?.getAttribute('content');
        // The keyboard covers the page rather than shrinking it, so the board and the stats rail keep their size
        // while something is typed into. The chat, which covers the whole screen, alone follows the keyboard.
        meta?.setAttribute(
            'content',
            `${viewport}, viewport-fit=cover, interactive-widget=resizes-visual`
        );

        const html = document.documentElement;
        // Firefox for Android reports the system navigation bar as a bottom safe area even though the page stops
        // above it, which would leave a gap under the board as tall as the bar
        const phantomBottom = /Android.*Firefox\//.test(navigator.userAgent);
        if (phantomBottom) {
            html.style.setProperty('--safe-bottom', '0px');
        }
        // In full screen on Android the page runs under the camera cut-out, and the top safe area is the cut-out's
        // height. Portrait keeps clear of it, the top bar's background filling it; landscape lets the board run
        // under it (index.css)
        const android = /Android/.test(navigator.userAgent);
        if (android) {
            html.dataset.androidBoard = '';
        }
        // How much of the screen the keyboard leaves, which the chat fills (--visual-height), so its input stays above
        // the keyboard. Firefox for Android in full screen never reports the keyboard (Mozilla bug 1886881).
        const visual = window.visualViewport;
        const fit = () => html.style.setProperty('--visual-height', `${visual.height}px`);
        if (visual) {
            visual.addEventListener('resize', fit);
            fit();
        }
        // The page itself never scrolls under the board: a touch-drag on the board would otherwise scroll it, leaving
        // a gap below the board (the board is fixed to the screen, but the page behind it is not)
        const body = document.body;
        const locked = ['overscrollBehavior', 'overflow', 'height'];
        const saved = locked.map((key) => [html.style[key], body.style[key]]);
        for (const el of [html, body]) {
            el.style.overscrollBehavior = 'none';
            el.style.overflow = 'hidden';
            el.style.height = '100%';
        }
        // Except while something is typed into: the browser may scroll to keep the field above the keyboard, and the
        // page goes back once the keyboard closes
        const typing = () => isTextEntry(document.activeElement);
        const stay = () => {
            if (!typing() && (window.scrollX || window.scrollY)) {
                window.scrollTo(0, 0);
            }
        };
        // Where the browser shrinks the page for the keyboard anyway, the board keeps the height it had before it
        // opened while something is typed into, so the keyboard covers its bottom rather than squeezing it
        const holdHeight = (event) => {
            if (isTextEntry(event.target) && !html.style.getPropertyValue('--board-height')) {
                html.style.setProperty('--board-height', `${window.innerHeight}px`);
            }
        };
        const releaseHeight = () => {
            if (!typing()) {
                html.style.removeProperty('--board-height');
            }
        };
        const afterTyping = () =>
            setTimeout(() => {
                releaseHeight();
                stay();
            }, 0);
        stay();
        window.addEventListener('scroll', stay, { passive: true });
        document.addEventListener('focusin', holdHeight);
        document.addEventListener('focusout', afterTyping);

        return () => {
            if (meta && viewport !== null) {
                meta.setAttribute('content', viewport);
            }
            locked.forEach((key, index) => {
                [html.style[key], body.style[key]] = saved[index];
            });
            window.removeEventListener('scroll', stay);
            document.removeEventListener('focusin', holdHeight);
            document.removeEventListener('focusout', afterTyping);
            html.style.removeProperty('--board-height');
            visual?.removeEventListener('resize', fit);
            html.style.removeProperty('--visual-height');
            if (phantomBottom) {
                html.style.removeProperty('--safe-bottom');
            }
            if (android) {
                delete html.dataset.androidBoard;
            }
        };
    }, [active]);
};
