import { useCallback, useEffect, useReducer, useRef } from 'react';
import { isChatMessage } from '../chatMessages';

export const logMinimum = 1500;
const logMaximum = 4000;

const initial = { current: null, queue: [] };

const reducer = (state, action) => {
    switch (action.type) {
        case 'add':
            return { ...state, queue: [...state.queue, ...action.messages] };
        case 'next':
            return state.queue.length > 0
                ? {
                      current: { message: state.queue[0], shownAt: action.now, id: action.id },
                      queue: state.queue.slice(1)
                  }
                : { current: null, queue: [] };
        case 'hold':
            return state.current?.id === action.id && state.current.hold !== action.time
                ? { ...state, current: { ...state.current, hold: action.time } }
                : state;
        case 'clear':
            return initial;
        default:
            return state;
    }
};

// The game log's new lines, one at a time, for the divider to show in place of the phase track. Each stays at least
// logMinimum; it gives way to the next as soon as that has passed, or stays up to logMaximum when nothing follows.
// A line that needs longer to be read (one that scrolls) asks to be held for that long. Lines from before the board
// opened are not shown, nor are chat messages.
export const useLogFeed = (messages, { enabled = true } = {}) => {
    const [state, dispatch] = useReducer(reducer, initial);
    const seen = useRef(messages?.length ?? 0);
    const nextId = useRef(0);

    useEffect(() => {
        const all = messages || [];
        if (all.length < seen.current) {
            seen.current = all.length;
            return;
        }
        const added = all.slice(seen.current).filter((message) => !isChatMessage(message));
        seen.current = all.length;
        if (enabled && added.length > 0) {
            dispatch({ type: 'add', messages: added });
        }
    }, [messages, enabled]);

    useEffect(() => {
        if (!enabled) {
            dispatch({ type: 'clear' });
        }
    }, [enabled]);

    const { current, queue } = state;
    useEffect(() => {
        if (!current) {
            if (queue.length > 0) {
                dispatch({ type: 'next', now: Date.now(), id: nextId.current++ });
            }
            return;
        }
        const hold = current.hold ?? 0;
        const stay =
            queue.length > 0 ? Math.max(logMinimum, hold) : Math.max(logMaximum, hold + 1000);
        const wait = current.shownAt + stay - Date.now();
        const timer = setTimeout(
            () => dispatch({ type: 'next', now: Date.now(), id: nextId.current++ }),
            Math.max(0, wait)
        );
        return () => clearTimeout(timer);
    }, [current, queue.length]);

    // dismiss: this line and every one waiting; skip: on to the next line
    const dismiss = useCallback(() => dispatch({ type: 'clear' }), []);
    const skip = useCallback(
        () => dispatch({ type: 'next', now: Date.now(), id: nextId.current++ }),
        []
    );
    const hold = useCallback((id, time) => dispatch({ type: 'hold', id, time }), []);
    return { current, queued: queue.length, dismiss, skip, hold };
};
