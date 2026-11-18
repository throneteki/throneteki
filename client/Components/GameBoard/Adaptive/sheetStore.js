import { useSyncExternalStore } from 'react';

// The one sheet the board has. A pile that opens asks to be shown in it (show) and draws its cards into the sheet's
// body (contentNode); the sheet draws the frame around them. Opening another pile takes the sheet over, closing the
// last one. Every pile whose cards can be looked at registers too, so the sheet can offer a player's piles to go to.
let state = { active: null, piles: [], contentNode: null, layout: { height: 'full', row: false } };
const listeners = new Set();

const change = (next) => {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
};

// The order piles are offered in, which never changes as piles fill or empty
export const pileOrder = [
    'plot deck',
    'revealed plots',
    'agenda',
    'draw deck',
    'discard pile',
    'dead pile',
    'out of game'
];

export const sheetStore = {
    // sheet: { id, side, name, title, playerName, prompting, close }
    show(sheet) {
        const previous = state.active;
        change({ active: sheet });
        if (previous && previous.id !== sheet.id) {
            previous.close();
        }
    },
    // A pile already shown may change what the frame says about it (its title, whether it is being chosen from)
    update(id, details) {
        const current = state.active;
        if (
            current?.id === id &&
            Object.keys(details).some((key) => current[key] !== details[key])
        ) {
            change({ active: { ...current, ...details } });
        }
    },
    hide(id) {
        if (state.active?.id === id) {
            change({ active: null });
        }
    },
    setContentNode(node) {
        if (node !== state.contentNode) {
            change({ contentNode: node });
        }
    },
    setLayout(layout) {
        if (layout.height !== state.layout.height || layout.row !== state.layout.row) {
            change({ layout });
        }
    },
    // pile: { id, player, side, source, title, open }
    register(pile) {
        change({ piles: [...state.piles.filter((entry) => entry.id !== pile.id), pile] });
        return () => {
            if (state.piles.includes(pile)) {
                change({ piles: state.piles.filter((entry) => entry !== pile) });
            }
        };
    }
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

export const useSheetState = () => useSyncExternalStore(subscribe, () => state);

// A player's piles, in the fixed order
export const pilesOf = (piles, player) =>
    piles
        .filter((pile) => pile.player === player)
        .sort((a, b) => pileOrder.indexOf(a.source) - pileOrder.indexOf(b.source));
