import { useLayoutEffect } from 'react';

// While the adaptive board shows, it draws under a phone's notch and rounded corners (padding itself clear of
// them) and the page cannot be pulled to refresh or bounce. Only for the board: every other page keeps the
// browser's safe default.
export const useAdaptivePage = (active) => {
    useLayoutEffect(() => {
        if (!active) {
            return;
        }

        const meta = document.querySelector('meta[name="viewport"]');
        const viewport = meta?.getAttribute('content');
        meta?.setAttribute('content', `${viewport}, viewport-fit=cover`);

        const html = document.documentElement;
        const body = document.body;
        const overscroll = [html.style.overscrollBehavior, body.style.overscrollBehavior];
        html.style.overscrollBehavior = 'none';
        body.style.overscrollBehavior = 'none';

        return () => {
            if (meta && viewport !== null) {
                meta.setAttribute('content', viewport);
            }
            [html.style.overscrollBehavior, body.style.overscrollBehavior] = overscroll;
        };
    }, [active]);
};
