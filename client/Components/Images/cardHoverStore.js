import { useSyncExternalStore } from 'react';

// details: the card's summary, for what is happening to it now (strength, power, tokens); optional
const empty = { owner: null, type: null, code: null, notes: null, details: null };

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
    show: (owner, { type, code, notes, details = null }) => {
        if (
            suppressed ||
            (state.owner === owner &&
                state.type === type &&
                state.code === code &&
                state.notes === notes &&
                state.details === details)
        ) {
            return;
        }
        state = { owner, type, code, notes, details };
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
