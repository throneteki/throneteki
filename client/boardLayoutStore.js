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

// Where the board hides the navbar, it slides in over the board while the game menu, or its own menu, is open
let navbarOpen = { gameMenu: false, navMenu: false };
const navbarListeners = new Set();

const subscribeNavbar = (listener) => {
    navbarListeners.add(listener);
    return () => navbarListeners.delete(listener);
};

export const boardNavbarStore = {
    set(key, open) {
        if (navbarOpen[key] === open) {
            return;
        }
        navbarOpen = { ...navbarOpen, [key]: open };
        navbarListeners.forEach((listener) => listener());
    },
    get: () => navbarOpen
};

export const useBoardNavbar = () => useSyncExternalStore(subscribeNavbar, boardNavbarStore.get);
