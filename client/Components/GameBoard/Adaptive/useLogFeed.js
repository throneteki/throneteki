import { useCallback, useEffect, useReducer, useRef } from 'react';
import { isChatMessage } from '../chatMessages';

// How the game log's lines are shown on the phase wheel, in milliseconds (scrollSpeed in pixels a second)
export const logTiming = {
    // A line with others queued behind it shows this long, then gives way to the next
    queuedShow: 1500,
    // A line with nothing behind it shows this long
    aloneShow: 4000,
    // A long line, held while it scrolls, stays this much longer once done when nothing is behind it
    aloneAfterScroll: 1000,
    // A line too long for its row scrolls at this speed, pausing this long before it starts and after it ends
    scrollSpeed: 45,
    scrollPause: 700,
    // With others queued behind it, it scrolls at this speed instead, however long it is, and pauses this long
    queuedScrollSpeed: 80,
    queuedScrollPause: 250,
    // Each line fades in and out over this long
    fade: 300
};

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
// queuedShow; it gives way to the next as soon as that has passed, or stays aloneShow when nothing follows.
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
            queue.length > 0
                ? Math.max(logTiming.queuedShow, hold)
                : Math.max(logTiming.aloneShow, hold + logTiming.aloneAfterScroll);
        const wait = current.shownAt + stay - Date.now();
        const timer = setTimeout(
            () => dispatch({ type: 'next', now: Date.now(), id: nextId.current++ }),
            Math.max(0, wait)
        );
        return () => clearTimeout(timer);
    }, [current, queue.length]);

    // skip: on to the next line
    const skip = useCallback(
        () => dispatch({ type: 'next', now: Date.now(), id: nextId.current++ }),
        []
    );
    const hold = useCallback((id, time) => dispatch({ type: 'hold', id, time }), []);
    return { current, queued: queue.length, skip, hold };
};
