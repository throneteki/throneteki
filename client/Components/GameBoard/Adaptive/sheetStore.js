import { useSyncExternalStore } from 'react';

// The board's sheets, one for each player, over that player's board. A pile that opens asks to be shown in its
// player's sheet (show) and draws its cards into that sheet's body (contentNodes); the sheet draws the frame around
// them. Opening another of the same player's piles takes their sheet over, closing the pile it showed; other players'
// sheets stay open. Every pile whose cards can be looked at registers too, so a sheet can offer its player's piles to
// go to, marking those with cards to choose.
let state = { sheets: {}, piles: [], contentNodes: {}, layouts: {} };
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

// Which sheet a pile shows in: its player's, or its side's for a pile with no player
export const sheetKeyOf = ({ playerName, side }) => playerName ?? `side:${side}`;

const keyShowing = (id) => Object.keys(state.sheets).find((key) => state.sheets[key].id === id);

export const defaultLayout = { height: 'full', row: false, columns: null };

export const sheetStore = {
    // sheet: { id, key, side, name, title, playerName, prompting, close }
    show(sheet) {
        const previous = state.sheets[sheet.key];
        change({ sheets: { ...state.sheets, [sheet.key]: sheet } });
        if (previous && previous.id !== sheet.id) {
            previous.close();
        }
    },
    // A pile already shown may change what the frame says about it (its title, whether it is being chosen from)
    update(id, details) {
        const key = keyShowing(id);
        const current = key && state.sheets[key];
        if (current && Object.keys(details).some((name) => current[name] !== details[name])) {
            change({ sheets: { ...state.sheets, [key]: { ...current, ...details } } });
        }
    },
    hide(id) {
        const key = keyShowing(id);
        if (key) {
            const { [key]: gone, ...rest } = state.sheets; // eslint-disable-line no-unused-vars
            change({ sheets: rest });
        }
    },
    setContentNode(key, node) {
        if (node !== (state.contentNodes[key] ?? null)) {
            const { [key]: gone, ...rest } = state.contentNodes; // eslint-disable-line no-unused-vars
            change({ contentNodes: node ? { ...rest, [key]: node } : rest });
        }
    },
    setLayout(key, layout) {
        const current = state.layouts[key] ?? defaultLayout;
        if (Object.keys(layout).some((name) => layout[name] !== current[name])) {
            change({ layouts: { ...state.layouts, [key]: { ...current, ...layout } } });
        }
    },
    // pile: { id, player, side, source, title, selectable, open }
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
