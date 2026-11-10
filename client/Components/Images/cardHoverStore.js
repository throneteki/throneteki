import { useSyncExternalStore } from 'react';

const empty = { owner: null, type: null, code: null, notes: null };

let state = empty;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const cardHoverStore = {
    getState: () => state,
    show: (owner, { type, code, notes }) => {
        if (
            state.owner === owner &&
            state.type === type &&
            state.code === code &&
            state.notes === notes
        ) {
            return;
        }
        state = { owner, type, code, notes };
        emit();
    },
    clear: (owner) => {
        if (state === empty || (owner && state.owner !== owner)) {
            return;
        }
        state = empty;
        emit();
    }
};

export const useCardHover = (selector = (current) => current) =>
    useSyncExternalStore(subscribe, () => selector(state));
