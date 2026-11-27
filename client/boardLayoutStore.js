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

// Where the board hides the navbar, it slides in over the board while the game menu, or one of its own menus, is open.
// Keyed by who opened it: gameMenu, navMenu (the navbar's menu) or one of the navbar's dropdowns.
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

// Whether one of the navbar's own menus is open
export const navbarMenuOpen = (open) =>
    Object.entries(open).some(([key, isOpen]) => key !== 'gameMenu' && isOpen);
