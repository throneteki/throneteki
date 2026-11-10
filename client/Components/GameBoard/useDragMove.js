import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

const readSavedPosition = (storageKey) => {
    try {
        const parsed = JSON.parse(localStorage.getItem(storageKey));
        if (!parsed) {
            return null;
        }
        const x = parsed.x ?? parsed.left;
        const y = parsed.y ?? parsed.top;
        return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
    } catch {
        return null;
    }
};

const clampToViewport = (element, { x, y }) => ({
    x: Math.max(0, Math.min(x, window.innerWidth - element.offsetWidth)),
    y: Math.max(0, Math.min(y, window.innerHeight - element.offsetHeight))
});

export const useDragMove = ({ storageKey, getDefaultPosition }) => {
    const panelRef = useRef(null);
    const handleRef = useRef(null);
    const position = useRef({ x: 0, y: 0 });
    const frame = useRef(0);
    const getDefaultRef = useRef(getDefaultPosition);
    getDefaultRef.current = getDefaultPosition;

    const apply = useCallback((next) => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }
        position.current = clampToViewport(panel, next);
        panel.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
    }, []);

    useLayoutEffect(() => {
        const panel = panelRef.current;
        if (!panel) {
            return;
        }
        apply(readSavedPosition(storageKey) ?? getDefaultRef.current(panel));
    }, [apply, storageKey]);

    useEffect(() => {
        let pending = 0;
        const onResize = () => {
            cancelAnimationFrame(pending);
            pending = requestAnimationFrame(() => apply(position.current));
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(pending);
            window.removeEventListener('resize', onResize);
        };
    }, [apply]);

    useEffect(() => {
        const handle = handleRef.current;
        if (!handle) {
            return;
        }

        let origin = null;
        let latest = null;

        const onPointerDown = (event) => {
            if (event.button !== 0 || event.target.closest('[data-no-drag]')) {
                return;
            }
            origin = {
                pointerX: event.clientX,
                pointerY: event.clientY,
                x: position.current.x,
                y: position.current.y
            };
            handle.setPointerCapture(event.pointerId);
            handle.style.cursor = 'grabbing';
        };

        const onPointerMove = (event) => {
            if (!origin) {
                return;
            }
            latest = {
                x: origin.x + event.clientX - origin.pointerX,
                y: origin.y + event.clientY - origin.pointerY
            };
            cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(() => apply(latest));
        };

        const onPointerEnd = (event) => {
            if (!origin) {
                return;
            }
            origin = null;
            cancelAnimationFrame(frame.current);
            if (latest) {
                apply(latest);
                latest = null;
            }
            handle.style.cursor = '';
            if (handle.hasPointerCapture(event.pointerId)) {
                handle.releasePointerCapture(event.pointerId);
            }
            localStorage.setItem(storageKey, JSON.stringify(position.current));
        };

        handle.addEventListener('pointerdown', onPointerDown);
        handle.addEventListener('pointermove', onPointerMove);
        handle.addEventListener('pointerup', onPointerEnd);
        handle.addEventListener('pointercancel', onPointerEnd);

        return () => {
            cancelAnimationFrame(frame.current);
            handle.removeEventListener('pointerdown', onPointerDown);
            handle.removeEventListener('pointermove', onPointerMove);
            handle.removeEventListener('pointerup', onPointerEnd);
            handle.removeEventListener('pointercancel', onPointerEnd);
        };
    }, [apply, storageKey]);

    return { panelRef, handleRef };
};
