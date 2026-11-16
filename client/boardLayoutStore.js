import { useSyncExternalStore } from 'react';

// The adaptive board's current layout mode, for the parts of the page outside the board (such as the navbar).
// Null while the adaptive board is not showing.
let mode = null;
const listeners = new Set();

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const boardLayoutStore = {
    set(next) {
        if (next === mode) {
            return;
        }
        mode = next;
        listeners.forEach((listener) => listener());
    },
    get: () => mode
};

export const useAdaptiveLayoutMode = () => useSyncExternalStore(subscribe, boardLayoutStore.get);

export const hidesNavbar = (layoutMode) => ['narrow', 'short'].includes(layoutMode);
