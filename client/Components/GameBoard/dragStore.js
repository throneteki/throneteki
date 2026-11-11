import { useSyncExternalStore } from 'react';
import { captureCards, setDropOrigin, setFlipIgnored } from '../../flip';
import { validTargets } from './dropTargets';
import { cardHoverStore } from '../Images/cardHoverStore';

const idle = { uuid: null, source: null, type: null, over: null, ghost: null, version: 0 };
const settleTimeout = 1500;

let state = idle;
let settleTimer = null;
const listeners = new Set();

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

// While the card is carried it is gone from the area it left, and only held as an empty slot while hovering it
export const hiddenUuid = (current) =>
    current.uuid && (current.ghost || current.over !== current.source) ? current.uuid : null;

// Over nothing at all keeps the last area, so the slot only closes once another area is hovered
// The area being hovered opens a slot for the carried card, when the card may be dropped there
export const incomingTarget = (current) =>
    current.uuid &&
    current.over &&
    current.over !== current.source &&
    validTargets[current.source]?.includes(current.over)
        ? current.over
        : null;

export const nextOver = (current, over) => over ?? current.over;

const emit = () => listeners.forEach((listener) => listener());

const change = (next) => {
    const wasHidden = hiddenUuid(state);
    const wasIncoming = incomingTarget(state);
    state = { ...state, ...next, version: state.version + 1 };
    if (hiddenUuid(state) !== wasHidden || incomingTarget(state) !== wasIncoming) {
        captureCards();
    }
    emit();
};

export const dragStore = {
    start(uuid, source, type) {
        clearTimeout(settleTimer);
        setFlipIgnored(uuid);
        cardHoverStore.suppress(true);
        state = { ...idle, uuid, source, type, over: source, version: state.version + 1 };
        emit();
    },

    setOver(over) {
        const next = nextOver(state, over);
        if (state.uuid && next !== state.over) {
            change({ over: next });
        }
    },

    // The card was released somewhere new: hold it there until the server moves it
    drop(ghost, origin) {
        setDropOrigin({ uuid: ghost.uuid, ...origin });
        change({ ghost });
        settleTimer = setTimeout(() => dragStore.settle(), settleTimeout);
    },

    // The card goes back to where it was picked up, or the move was not accepted
    settle(origin) {
        clearTimeout(settleTimer);
        if (!state.uuid) {
            return;
        }
        if (origin) {
            setDropOrigin({ uuid: state.uuid, ...origin });
        }
        captureCards();
        dragStore.finish();
    },

    finish() {
        clearTimeout(settleTimer);
        setFlipIgnored(null);
        cardHoverStore.suppress(false);
        state = { ...idle, version: state.version + 1 };
        emit();
    },

    hasGhost: () => !!state.ghost
};

export const useHiddenDragUuid = () => useSyncExternalStore(subscribe, () => hiddenUuid(state));
export const useIncomingSlot = (area) =>
    useSyncExternalStore(subscribe, () => incomingTarget(state) === area);
export const useIncomingType = (area) =>
    useSyncExternalStore(subscribe, () => (incomingTarget(state) === area ? state.type : null));
export const useIsCarried = (uuid) =>
    useSyncExternalStore(subscribe, () => !!uuid && state.uuid === uuid);
export const useDragSource = () => useSyncExternalStore(subscribe, () => state.source);
export const useDragGhost = () => useSyncExternalStore(subscribe, () => state.ghost);
export const useDragVersion = () => useSyncExternalStore(subscribe, () => state.version);
