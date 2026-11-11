export const DominantWinCases = [
    { name: 'a power win by 10', power: 15, reason: 'power', opponents: [5], dominant: true },
    { name: 'a power win by 9', power: 15, reason: 'power', opponents: [6], dominant: false },
    {
        name: 'a concession with 10 against 4',
        power: 10,
        reason: 'concede',
        opponents: [4],
        dominant: true
    },
    {
        name: 'a concession with 10 against 5',
        power: 10,
        reason: 'concede',
        opponents: [5],
        dominant: false
    },
    {
        name: 'a concession with 9 against 0',
        power: 9,
        reason: 'concede',
        opponents: [0],
        dominant: false
    },
    {
        name: 'a decking win by 10 or more',
        power: 13,
        reason: 'remaining',
        opponents: [3],
        dominant: true
    },
    {
        name: 'a time win with 10 against 4',
        power: 10,
        reason: 'time',
        opponents: [4],
        dominant: true
    },
    {
        name: 'a melee win against the leading opponent',
        power: 15,
        reason: 'power',
        opponents: [1, 6],
        dominant: false
    },
    {
        name: 'a melee win clear of everyone',
        power: 15,
        reason: 'power',
        opponents: [2, 5],
        dominant: true
    },
    {
        name: 'an opponent with no power recorded',
        power: 10,
        reason: 'concede',
        opponents: [null],
        dominant: true
    },
    {
        name: 'an opponent with negative power',
        power: 8,
        reason: 'power',
        opponents: [-3],
        dominant: false
    },
    { name: 'a loss', power: 2, reason: 'power', opponents: [15], won: false, dominant: false },
    { name: 'no power recorded', power: null, reason: 'concede', opponents: [0], dominant: false }
];
