import { useSyncExternalStore } from 'react';
import { useHud } from './hudStore';

const query = '(prefers-reduced-motion: reduce)';

const subscribe = (listener) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
};

export const useBrowserReducedMotion = () =>
    useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    );

export const isMotionEnabled = ({ animations, reducedMotion }) =>
    animations !== false && !reducedMotion;

export const useMotionEnabled = () => {
    const hud = useHud();
    const reducedMotion = useBrowserReducedMotion();

    return isMotionEnabled({ animations: hud.animations, reducedMotion });
};
