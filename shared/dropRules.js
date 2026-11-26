export const drawDeckCardTypes = ['attachment', 'character', 'event', 'location'];

// The card types each pile accepts from a drag (manual mode)
export const allowedTypesForPile = {
    'active plot': ['plot'],
    'being played': ['event'],
    'dead pile': ['character'],
    'discard pile': drawDeckCardTypes,
    'draw deck': drawDeckCardTypes,
    hand: drawDeckCardTypes,
    'out of game': [...drawDeckCardTypes, 'plot'],
    'play area': ['attachment', 'character', 'location'],
    'plot deck': ['plot'],
    'revealed plots': ['plot'],
    shadows: drawDeckCardTypes,
    agenda: drawDeckCardTypes
};

// A plot dropped on the used plots asks whether to reveal it, so the drop itself moves nothing
export const isPlotPlacement = (from, to, type) =>
    type === 'plot' && to === 'revealed plots' && ['plot deck', 'revealed plots'].includes(from);
