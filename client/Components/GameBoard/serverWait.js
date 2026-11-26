import { useEffect, useReducer, useSyncExternalStore } from 'react';

export const waitingShownAfter = 3000;

const sentAt = [];
let sent = 0;
let handled = 0;
const listeners = new Set();

const notify = () => {
    for (const listener of listeners) {
        listener();
    }
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

// The oldest message waited on. A quiet one (a click the board already shows does nothing, so it is not pressed) keeps
// its place in the count, so the server's handled count still lines up, but is never waited on.
const oldestWaited = () => sentAt.find((at) => at !== null) ?? null;

export const serverWait = {
    sent(now = performance.now(), { quiet = false } = {}) {
        const before = oldestWaited();
        sent++;
        sentAt.push(quiet ? null : now);
        if (oldestWaited() !== before) {
            notify();
        }
        return sent;
    },
    handled(count) {
        const target = Number.isInteger(count) ? Math.min(count, sent) : handled;
        if (target <= handled) {
            return;
        }

        sentAt.splice(0, target - handled);
        handled = target;
        notify();
    },
    reset() {
        sent = 0;
        handled = 0;
        if (sentAt.length > 0) {
            sentAt.length = 0;
            notify();
        }
    },
    handledCount: () => handled,
    oldest: oldestWaited
};

export const useWaitingForServer = () => {
    const oldest = useSyncExternalStore(subscribe, serverWait.oldest, () => null);
    const [, rerender] = useReducer((count) => count + 1, 0);

    useEffect(() => {
        if (oldest === null) {
            return;
        }

        const left = waitingShownAfter - (performance.now() - oldest);
        if (left > 0) {
            const timer = setTimeout(rerender, left);
            return () => clearTimeout(timer);
        }
    }, [oldest]);

    return oldest !== null && performance.now() - oldest >= waitingShownAfter;
};
