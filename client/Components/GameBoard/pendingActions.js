import { useSyncExternalStore } from 'react';

// How the board shows an action waiting on the game server, in milliseconds after it was sent
export const pendingTiming = {
    // The element acted on pulses from then, so a quick answer shows nothing
    pulseAfter: 150,
    // A chip in the prompt bar says the board is waiting for the server
    chipAfter: 8000,
    // The chip offers to reload the page
    reloadAfter: 15000,
    // Past this the action is forgotten, answered or not
    forgetAfter: 60000
};

// What an action acted on, as the keys its element looks itself up by: a card, a prompt (and the button pressed in
// it), a stat, or a pile's deck command
export const pendingKeys = {
    card: (uuid) => `card:${uuid}`,
    prompt: (promptId) => `prompt:${promptId}`,
    button: ({ promptId, method, arg }) => `button:${promptId}:${method}:${arg}`,
    stat: (type, amount) => `stat:${type}:${amount}`,
    deck: (command) => `deck:${command}`,
    menu: (item) => `menu:${item}`
};

// Whether the server says clicking the card does something now: it can be chosen, or it is the player's own and has
// an action or can be played. In manual mode any click may kneel or stand a card.
export const clickDoesSomething = (card, manualMode) =>
    !!(manualMode || card?.selectable || card?.selected || card?.canPlay);

// The pulse on an element whose action is waiting (index.css), starting after pulseAfter
export const pendingLook = (pending) =>
    pending
        ? {
              className: 'board-pending',
              style: { '--pending-after': `${pendingTiming.pulseAfter}ms` }
          }
        : { className: undefined, style: undefined };

const sentAt = new Map();
const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const pendingStore = {
    // Marks the keys as waiting, until done() (the server answered) or forgetAfter
    add(keys) {
        const now = performance.now();
        keys.forEach((key) => sentAt.set(key, now));
        emit();
        const timer = setTimeout(() => pendingStore.done(keys, now), pendingTiming.forgetAfter);
        return () => {
            clearTimeout(timer);
            pendingStore.done(keys, now);
        };
    },
    // Only clears what this send marked, so a later send of the same action stays pending
    done(keys, at) {
        let changed = false;
        keys.forEach((key) => {
            if (sentAt.get(key) === at) {
                sentAt.delete(key);
                changed = true;
            }
        });
        if (changed) {
            emit();
        }
    },
    clear() {
        if (sentAt.size > 0) {
            sentAt.clear();
            emit();
        }
    },
    has: (key) => sentAt.has(key),
    oldest: () => (sentAt.size > 0 ? Math.min(...sentAt.values()) : null)
};

export const usePending = (key) =>
    useSyncExternalStore(
        subscribe,
        () => !!key && sentAt.has(key),
        () => false
    );

export const useOldestPending = () =>
    useSyncExternalStore(subscribe, pendingStore.oldest, () => null);
