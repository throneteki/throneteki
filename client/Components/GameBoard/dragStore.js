import { useSyncExternalStore } from 'react';
import { captureCards, setDropOrigin, setFlipIgnored } from '../../flip';
import { canDrop } from './dropTargets';
import { cardHoverStore } from '../Images/cardHoverStore';

const idle = {
    uuid: null,
    source: null,
    type: null,
    over: null,
    under: null,
    ghost: null,
    version: 0
};
const settleTimeout = 1500;

let state = idle;
let settleTimer = null;
let heldCover = null;
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
    current.over !== 'underneath' &&
    current.over !== current.source &&
    canDrop(current.source, current.over, current.type)
        ? current.over
        : null;

// A card held where it was dropped flies back from there when the move is not accepted
const heldAt = (ghost) =>
    ghost && {
        rect: ghost.rect,
        source: ghost.target,
        rot: ghost.orientation === 'rotated' ? 90 : 0
    };

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

    // Held over a card long enough, the carried card goes underneath that card when it is let go
    setUnder(under) {
        if (state.uuid && under !== state.under) {
            change({ under });
        }
    },

    getUnder: () => state.under,

    // The card was released somewhere new: hold it there until the server moves it
    drop(ghost, origin) {
        // Holding the card can hide it where it came from, which measures the board straight away; the drop
        // origin is set after that, so it is kept for the move the server makes, not used up by the hiding
        change({ ghost });
        setDropOrigin({ uuid: ghost.uuid, ...origin });
        settleTimer = setTimeout(() => dragStore.settle(), settleTimeout);
    },

    // The card goes back to where it was picked up, or the move was not accepted
    settle(origin) {
        clearTimeout(settleTimer);
        if (!state.uuid) {
            return;
        }
        const back = origin ?? heldAt(state.ghost);
        if (back) {
            setDropOrigin({ uuid: state.uuid, ...back });
        }
        captureCards();
        dragStore.finish();
    },

    // A card dropped under another stays drawn beneath it until the server has moved it there
    holdCover(cover) {
        heldCover?.remove();
        heldCover = cover;
    },

    finish() {
        clearTimeout(settleTimer);
        heldCover?.remove();
        heldCover = null;
        setFlipIgnored(null);
        cardHoverStore.suppress(false);
        state = { ...idle, version: state.version + 1 };
        emit();
    },

    hasGhost: () => !!state.ghost,
    ghostTarget: () => state.ghost?.target
};

export const useHiddenDragUuid = () => useSyncExternalStore(subscribe, () => hiddenUuid(state));
export const useIncomingSlot = (area) =>
    useSyncExternalStore(subscribe, () => incomingTarget(state) === area);
export const useIncomingType = (area) =>
    useSyncExternalStore(subscribe, () => (incomingTarget(state) === area ? state.type : null));
export const useIsCarried = (uuid) =>
    useSyncExternalStore(subscribe, () => !!uuid && state.uuid === uuid);
export const useDragSource = () => useSyncExternalStore(subscribe, () => state.source);
export const useDragType = () => useSyncExternalStore(subscribe, () => state.type);
export const useDragGhost = () => useSyncExternalStore(subscribe, () => state.ghost);
export const useIsUnderTarget = (uuid) =>
    useSyncExternalStore(subscribe, () => !!uuid && state.under === uuid);
export const useUnderTarget = () => useSyncExternalStore(subscribe, () => state.under);
export const useDragVersion = () => useSyncExternalStore(subscribe, () => state.version);
