export const validTargets = {
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
    'revealed plots': ['plot deck', 'out of game'],
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
    shadows: ['dead pile', 'discard pile', 'draw deck', 'hand', 'out of game', 'play area']
};
