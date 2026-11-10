import { useSyncExternalStore } from 'react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { normalizeHud } from './hud';

let override = null;
const listeners = new Set();

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const hudStore = {
    set(next) {
        override = next;
        listeners.forEach((listener) => listener());
    },
    reset() {
        this.set(null);
    }
};

export const useHud = () => {
    const settings = useSelector((state) => state.auth.user?.settings);
    const current = useSyncExternalStore(subscribe, () => override);
    const saved = useMemo(() => normalizeHud(settings), [settings]);

    return current || saved;
};
