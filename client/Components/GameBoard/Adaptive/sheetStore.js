import { useSyncExternalStore } from 'react';

const maxRecent = 4;

// Only one sheet is open at a time: opening one closes the last. The piles opened lately are kept, so the open
// sheet can offer them as tabs to go back to.
let state = { open: null, recent: [] };
const listeners = new Set();

const change = (next) => {
    state = next;
    listeners.forEach((listener) => listener());
};

export const sheetStore = {
    opened(sheet) {
        if (state.open && state.open.id !== sheet.id) {
            state.open.close();
        }
        const recent = [sheet, ...state.recent.filter((entry) => entry.id !== sheet.id)].slice(
            0,
            maxRecent
        );
        change({ open: sheet, recent });
    },
    closed(id) {
        if (state.open?.id === id) {
            change({ ...state, open: null });
        }
    },
    // A sheet whose pile has left the board (such as a card that left play) can no longer be gone back to
    forget(id) {
        if (state.recent.some((entry) => entry.id === id) || state.open?.id === id) {
            change({
                open: state.open?.id === id ? null : state.open,
                recent: state.recent.filter((entry) => entry.id !== id)
            });
        }
    },
    reset() {
        change({ open: null, recent: [] });
    }
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useRecentSheets = () => useSyncExternalStore(subscribe, () => state.recent);
