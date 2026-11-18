import { useSyncExternalStore } from 'react';

const empty = { owner: null, type: null, code: null, notes: null };

let state = empty;
let suppressed = false;
const listeners = new Set();

const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const cardHoverStore = {
    getState: () => state,
    // No preview is shown while another card is being carried
    suppress: (value) => {
        suppressed = value;
        if (value && state !== empty) {
            state = empty;
            emit();
        }
    },
    show: (owner, { type, code, notes }) => {
        if (
            suppressed ||
            (state.owner === owner &&
                state.type === type &&
                state.code === code &&
                state.notes === notes)
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
