import { allowedTypesForPile, drawDeckCardTypes, isPlotPlacement } from '../../../shared/dropRules';

const validTargets = {
    hand: [
        'play area',
        'discard pile',
        'draw deck',
        'dead pile',
        'out of game',
        'agenda',
        'shadows'
    ],
    'play area': [
        'discard pile',
        'hand',
        'draw deck',
        'dead pile',
        'out of game',
        'agenda',
        'shadows'
    ],
    'discard pile': [
        'dead pile',
        'hand',
        'draw deck',
        'play area',
        'out of game',
        'agenda',
        'shadows'
    ],
    'dead pile': [
        'hand',
        'draw deck',
        'play area',
        'discard pile',
        'out of game',
        'agenda',
        'shadows'
    ],
    'draw deck': [
        'hand',
        'discard pile',
        'dead pile',
        'play area',
        'out of game',
        'agenda',
        'shadows'
    ],
    'plot deck': ['revealed plots', 'out of game'],
    'revealed plots': ['plot deck', 'revealed plots', 'out of game'],
    'out of game': [
        'plot deck',
        'revealed plots',
        'draw deck',
        'play area',
        'discard pile',
        'hand',
        'dead pile',
        'shadows'
    ],
    agenda: [
        'hand',
        'play area',
        'draw deck',
        'discard pile',
        'dead pile',
        'out of game',
        'shadows'
    ],
    shadows: ['dead pile', 'discard pile', 'draw deck', 'hand', 'out of game', 'play area'],
    underneath: [
        'hand',
        'play area',
        'draw deck',
        'discard pile',
        'dead pile',
        'out of game',
        'agenda',
        'shadows'
    ]
};

export const needsChoice = isPlotPlacement;

export const canPlaceUnder = (from, type) => !!from && drawDeckCardTypes.includes(type);

export const canDrop = (from, to, type) =>
    to === 'underneath' ? canPlaceUnder(from, type) : canDropInArea(from, to, type);

const canDropInArea = (from, to, type) =>
    !!validTargets[from]?.includes(to) &&
    (type === undefined || type === null || (allowedTypesForPile[to]?.includes(type) ?? true));
