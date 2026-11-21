import { useSyncExternalStore } from 'react';
import { useHud } from './hudStore';

let media;
const reducedMotion = () => (media ??= window.matchMedia('(prefers-reduced-motion: reduce)'));

const subscribe = (listener) => {
    reducedMotion().addEventListener('change', listener);
    return () => reducedMotion().removeEventListener('change', listener);
};

export const useBrowserReducedMotion = () =>
    useSyncExternalStore(
        subscribe,
        () => reducedMotion().matches,
        () => false
    );

export const isMotionEnabled = ({ animations, reducedMotion }) =>
    animations !== false && !reducedMotion;

export const useMotionEnabled = () => {
    const hud = useHud();
    const reducedMotion = useBrowserReducedMotion();

    return isMotionEnabled({ animations: hud.animations, reducedMotion });
};
