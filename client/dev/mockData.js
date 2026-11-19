// Sample data for working on the site's look in development: open /play?mock=1 (or ?mock=pending,
// /nodes?mock=1). Only the local view changes. Callers check import.meta.env.DEV first so none of
// this reaches a production build.
const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

const player = (name, seatNo, extra = {}) => ({
    name,
    id: `p-${name}`,
    seatNo,
    owner: seatNo === 1,
    role: 'user',
    ...extra
});

const players = (...list) => Object.fromEntries(list.map((p) => [p.name, p]));

const game = (overrides) => ({
    allowSpectators: true,
    createdAt: minutesAgo(5),
    event: null,
    full: false,
    gameFormat: 'joust',
    gamePrivate: false,
    gameType: 'casual',
    gameVariant: 'standard',
    maxPlayers: 2,
    needsPassword: false,
    node: 'node1',
    showHand: false,
    spectators: [],
    started: false,
    useChessClocks: false,
    useGameTimeLimit: false,
    ...overrides
});

export const createMockLobbyGames = () => [
    game({
        id: 'mock-1',
        name: 'Quick casual game',
        createdAt: minutesAgo(2),
        players: players(player('Ser_Pounce', 1))
    }),
    game({
        id: 'mock-2',
        name: 'Store champs practice, bring your best',
        gameType: 'competitive',
        createdAt: minutesAgo(6),
        needsPassword: true,
        useChessClocks: true,
        players: players(player('Lady_Stoneheart', 1))
    }),
    game({
        id: 'mock-3',
        name: 'New player, please be patient',
        gameType: 'beginner',
        createdAt: minutesAgo(11),
        players: players(player('greenseer', 1))
    }),
    game({
        id: 'mock-4',
        name: 'Melee night',
        gameFormat: 'melee',
        maxPlayers: 4,
        createdAt: minutesAgo(14),
        event: { _id: 'e1', name: 'Melee Monday' },
        players: players(player('Brienne_of_Tarth', 1), player('Varys', 2))
    }),
    game({
        id: 'mock-5',
        name: 'Tower of Joy draft',
        gameFormat: 'draft',
        gameVariant: 'towerofjoy',
        createdAt: minutesAgo(3),
        players: players(player('Hot_Pie', 1))
    }),
    game({
        id: 'mock-6',
        name: 'Waiting for deck selection',
        createdAt: minutesAgo(1),
        full: true,
        players: players(player('Podrick', 1), player('Bronn', 2))
    }),
    game({
        id: 'mock-7',
        name: 'Round 3, table 1',
        gameType: 'competitive',
        started: true,
        full: true,
        createdAt: minutesAgo(38),
        event: { _id: 'e2', name: 'Winter Kingdoms 2026' },
        useGameTimeLimit: true,
        showHand: false,
        spectators: [
            { id: 's1', name: 'watcher1' },
            { id: 's2', name: 'watcher2' }
        ],
        players: players(
            player('Kingslayer', 1, { faction: 'lannister', agendas: ['01027'] }),
            player('Maester_Aemon', 2, { faction: 'thenightswatch', agendas: ['04037'] })
        )
    }),
    game({
        id: 'mock-8',
        name: 'Casual joust',
        started: true,
        full: true,
        createdAt: minutesAgo(22),
        showHand: true,
        spectators: [{ id: 's3', name: 'watcher3' }],
        players: players(
            player('Ser_Pounce', 1, { faction: 'stark', agendas: ['06018', '01199', '01200'] }),
            player('Arya_Underfoot', 2, { faction: 'greyjoy', agendas: ['02060'] })
        )
    }),
    game({
        id: 'mock-9',
        name: 'Melee with friends',
        gameFormat: 'melee',
        maxPlayers: 4,
        started: true,
        full: true,
        createdAt: minutesAgo(71),
        node: 'node2',
        players: players(
            player('Varys', 1, { faction: 'martell', agendas: ['01027'] }),
            player('Littlefinger', 2, { faction: 'tyrell', agendas: ['04037'] }),
            player('Davos', 3, { faction: 'baratheon', agendas: ['01198'] }),
            player('Missandei', 4, { faction: 'targaryen', agendas: ['12045'] })
        )
    }),
    game({
        id: 'mock-10',
        name: 'Testing a new deck',
        started: true,
        full: true,
        allowSpectators: false,
        createdAt: minutesAgo(104),
        node: 'node2',
        useChessClocks: true,
        players: players(
            player('Hodor', 1, { faction: 'stark', agendas: ['01027'] }),
            player('Ygritte', 2, { faction: 'thenightswatch' })
        )
    })
];

const chat = (name, text, minutes) => ({
    date: minutesAgo(minutes),
    message: [{ name, argType: 'player', role: 'user' }, ' ', text]
});

export const createMockPendingGame = (username = 'designreview') =>
    game({
        id: 'mock-pending',
        name: 'Store champs practice, bring your best',
        gameType: 'competitive',
        owner: username,
        createdAt: minutesAgo(4),
        restrictedList: { _id: 'rl1', name: 'Redesigned Joust v2.1' },
        spectators: [{ id: 's1', name: 'watcher1' }],
        players: players(
            player(username, 1, {
                deck: {
                    selected: true,
                    name: 'Winter Is Coming',
                    status: {
                        format: 'joust',
                        variant: 'standard',
                        legality: '2.1',
                        basicRules: true,
                        valid: true,
                        noUnreleasedCards: true,
                        extendedStatus: []
                    }
                }
            }),
            player('Lady_Stoneheart', 2, { deck: {} })
        ),
        messages: [
            chat('Lady_Stoneheart', 'hi, give me a minute to pick a deck', 2),
            chat(username, 'no rush', 1)
        ]
    });

const lobbyUser = (username, role = 'user') => ({ username, role });

const lobbyMessage = (id, user, minutes, message, extra = {}) => ({
    _id: `m${id}`,
    user,
    time: minutesAgo(minutes),
    message,
    ...extra
});

export const createMockLobbyUsers = () =>
    ['Ser_Pounce', 'Lady_Stoneheart', 'Varys', 'greenseer', 'Hot_Pie', 'Bronn', 'designreview'].map(
        (name) => ({ name })
    );

export const createMockLobbyMessages = () => {
    const pounce = lobbyUser('Ser_Pounce', 'supporter');
    const stoneheart = lobbyUser('Lady_Stoneheart');
    const varys = lobbyUser('Varys', 'contributor');
    const greenseer = lobbyUser('greenseer');
    const admin = lobbyUser('sampleadmin', 'admin');
    const me = lobbyUser('designreview');

    return [
        lobbyMessage(1, varys, 26 * 60, 'Anyone fancy a melee tonight? Need two more.'),
        lobbyMessage(2, varys, 26 * 60 - 1, 'Casual, no clocks.'),
        lobbyMessage(3, greenseer, 25 * 60, 'I can play after 9'),
        lobbyMessage(
            4,
            admin,
            95,
            'New cards from the latest pack are in. Report anything odd on GitHub: https://github.com/throneteki/throneteki/issues'
        ),
        lobbyMessage(5, pounce, 41, 'gg Lady_Stoneheart, that Rains turn was brutal'),
        lobbyMessage(6, stoneheart, 39, 'ha, thanks. your Arya kept me honest'),
        lobbyMessage(7, stoneheart, 38, 'rematch later?'),
        lobbyMessage(8, me, 22, 'Looking for a joust, competitive, Redesigned list'),
        lobbyMessage(9, me, 21, 'game is up as "Store champs practice"'),
        lobbyMessage(10, pounce, 12, 'designreview I will join in 5'),
        lobbyMessage(11, greenseer, 6, 'spam spam spam', {
            deleted: true,
            deletedBy: 'sampleadmin'
        }),
        lobbyMessage(12, varys, 2, 'Is Fealty still the best agenda for Stark?'),
        lobbyMessage(13, varys, 1, 'asking for a friend')
    ];
};

export const createMockNodes = () => [
    { name: 'node1', numGames: 41, status: 'active', version: '2026-11-17.3' },
    { name: 'node2', numGames: 38, status: 'active', version: '2026-11-17.3' },
    { name: 'node3', numGames: 6, status: 'draining', version: '2026-11-10.1' },
    { name: 'node4', numGames: 0, status: 'disabled', version: '2026-11-17.3' }
];

export const isMockMode = (mode = '1') =>
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('mock') === mode;
