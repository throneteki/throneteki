import { useEffect, useReducer, useSyncExternalStore } from 'react';

export const waitingShownAfter = 500;

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

export const serverWait = {
    sent(now = performance.now()) {
        sent++;
        sentAt.push(now);
        if (sentAt.length === 1) {
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
    oldest: () => sentAt[0] ?? null
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
