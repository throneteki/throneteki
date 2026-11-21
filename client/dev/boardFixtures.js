// Canned game states for looking at the board without a game server. Development only.

export const fixtureUsername = 'You';
const opponentName = 'Rival';

const cardData = {
    '01001': { name: 'A Clash of Kings', type: 'plot' },
    '01003': { name: 'A Game of Thrones', type: 'plot' },
    '01004': { name: 'A Noble Cause', type: 'plot' },
    '01006': { name: 'Building Orders', type: 'plot' },
    '01007': { name: 'Calling the Banners', type: 'plot' },
    '01009': { name: 'Confiscation', type: 'plot' },
    '01010': { name: 'Counting Coppers', type: 'plot' },
    '01013': { name: 'Heads on Spikes', type: 'plot' },
    '01016': { name: 'Marching Orders', type: 'plot' },
    '01020': { name: 'Reinforcements', type: 'plot' },
    '01027': { name: 'Fealty', type: 'agenda' },
    '01200': { name: 'Banner of the Lion', type: 'agenda' },
    '01198': { name: 'Banner of the Stag', type: 'agenda' },
    '01199': { name: 'Banner of the Kraken', type: 'agenda' },
    '06018': { name: 'Alliance', type: 'agenda' },
    '05045': { name: 'The Rains of Castamere', type: 'agenda' },
    '05049': { name: "Littlefinger's Meddling", type: 'plot' },
    '05050': { name: 'Gossip and Lies', type: 'plot' },
    '01028': { name: 'Littlefinger', type: 'character', strength: 4 },
    '01029': { name: 'Varys', type: 'character', strength: 3 },
    '01031': { name: 'Wildling Horde', type: 'character', strength: 5 },
    '01084': { name: 'Cersei Lannister', type: 'character', strength: 4 },
    '01085': { name: 'Grand Maester Pycelle', type: 'character', strength: 2 },
    '01086': { name: 'Joffrey Baratheon', type: 'character', strength: 3 },
    '01087': { name: 'Ser Jaime Lannister', type: 'character', strength: 5 },
    '01088': { name: 'The Tickler', type: 'character', strength: 2 },
    '01089': { name: 'Tyrion Lannister', type: 'character', strength: 4 },
    '01090': { name: 'Tywin Lannister', type: 'character', strength: 6 },
    '01091': { name: 'Burned Men', type: 'character', strength: 2 },
    '01092': { name: 'Gold Cloaks', type: 'character', strength: 3 },
    '01093': { name: 'Lannisport Moneylender', type: 'character', strength: 2 },
    '01094': { name: 'Lannisport Merchant', type: 'character', strength: 1 },
    '01095': { name: "The Queen's Assassin", type: 'character', strength: 2 },
    '01141': { name: 'Arya Stark', type: 'character', strength: 2 },
    '01142': { name: 'Bran Stark', type: 'character', strength: 1 },
    '01143': { name: 'Catelyn Stark', type: 'character', strength: 4 },
    '01144': { name: 'Eddard Stark', type: 'character', strength: 5 },
    '01145': { name: 'Grey Wind', type: 'character', strength: 4 },
    '01146': { name: 'Robb Stark', type: 'character', strength: 5 },
    '01033': { name: 'Bodyguard', type: 'attachment' },
    '01034': { name: 'Little Bird', type: 'attachment' },
    '01036': { name: 'Noble Lineage', type: 'attachment' },
    '01096': { name: "Widow's Wail", type: 'attachment' },
    '01153': { name: 'Ice', type: 'attachment' },
    '01038': { name: 'The Iron Throne', type: 'location' },
    '01039': { name: 'The Kingsroad', type: 'location' },
    '01040': { name: 'The Roseroad', type: 'location' },
    '01097': { name: 'Casterly Rock', type: 'location' },
    '01098': { name: 'Lannisport', type: 'location' },
    '01099': { name: 'Western Fiefdom', type: 'location' },
    '01154': { name: 'Gates of Winterfell', type: 'location' },
    '01155': { name: 'The Wolfswood', type: 'location' },
    '01156': { name: 'Heart Tree Grove', type: 'location' },
    '01041': { name: 'Put to the Sword', type: 'event' },
    '01045': { name: "The Hand's Judgment", type: 'event' },
    '01100': { name: 'Hear Me Roar!', type: 'event' },
    '01157': { name: 'For the North!', type: 'event' },
    '01159': { name: 'Winter Is Coming', type: 'event' },
    '01046': { name: 'Maester Cressen', type: 'character', strength: 3 },
    '01047': { name: 'Melisandre', type: 'character', strength: 4 },
    '01048': { name: 'Robert Baratheon', type: 'character', strength: 5 },
    '01050': { name: 'Ser Davos Seaworth', type: 'character', strength: 3 },
    '01052': { name: 'Stannis Baratheon', type: 'character', strength: 5 },
    '01059': { name: 'Dragonstone Port', type: 'location' },
    '01065': { name: 'Aeron Damphair', type: 'character', strength: 3 },
    '01067': { name: 'Asha Greyjoy', type: 'character', strength: 4 },
    '01068': { name: 'Balon Greyjoy', type: 'character', strength: 5 },
    '01069': { name: "Euron Crow's Eye", type: 'character', strength: 6 },
    '01071': { name: 'Theon Greyjoy', type: 'character', strength: 3 },
    '01078': { name: 'Great Kraken', type: 'location' },
    '01103': { name: 'Areo Hotah', type: 'character', strength: 5 },
    '01104': { name: 'Arianne Martell', type: 'character', strength: 4 },
    '01105': { name: 'Doran Martell', type: 'character', strength: 4 },
    '01109': { name: 'The Red Viper', type: 'character', strength: 7 },
    '01117': { name: 'Sunspear', type: 'location' },
    '01122': { name: 'Benjen Stark', type: 'character', strength: 4 },
    '01123': { name: 'Ghost', type: 'character', strength: 3 },
    '01124': { name: 'Jon Snow', type: 'character', strength: 4 },
    '01126': { name: 'Old Bear Mormont', type: 'character', strength: 6 },
    '01136': { name: 'Castle Black', type: 'location' },
    '01137': { name: 'The Wall', type: 'location' },
    '01181': { name: 'Margaery Tyrell', type: 'character', strength: 3 },
    '01183': { name: 'Randyll Tarly', type: 'character', strength: 5 },
    '01185': { name: 'The Knight of Flowers', type: 'character', strength: 5 },
    '01180': { name: 'Maester Lomys', type: 'character', strength: 3 },
    '01192': { name: 'Highgarden', type: 'location' },
    '01206': { name: 'Master of Whispers', type: 'title' },
    '01207': { name: 'Master of Ships', type: 'title' },
    '01208': { name: 'Hand of the King', type: 'title' },
    '01209': { name: 'Master of Coin', type: 'title' },
    '01210': { name: 'Master of Laws', type: 'title' },
    '01211': { name: 'Crown Regent', type: 'title' }
};

const factionCards = {
    stark: { code: 'stark', name: 'House Stark', type: 'faction' },
    lannister: { code: 'lannister', name: 'House Lannister', type: 'faction' },
    baratheon: { code: 'baratheon', name: 'House Baratheon', type: 'faction' },
    greyjoy: { code: 'greyjoy', name: 'House Greyjoy', type: 'faction' },
    martell: { code: 'martell', name: 'House Martell', type: 'faction' },
    thenightswatch: { code: 'thenightswatch', name: "The Night's Watch", type: 'faction' },
    tyrell: { code: 'tyrell', name: 'House Tyrell', type: 'faction' }
};

const createDeck = () => {
    let next = 0;
    const uuid = (prefix) => `${prefix}-${++next}`;

    const card = (code, extra = {}) => {
        const data = cardData[code];
        const summary = {
            uuid: uuid(code),
            code,
            name: data.name,
            type: data.type,
            facedown: false,
            power: 0,
            tokens: {},
            attachments: [],
            childCards: [],
            dupes: [],
            kneeled: false,
            ...extra
        };
        if (data.strength !== undefined) {
            summary.baseStrength = data.strength;
            summary.strength = extra.strength ?? data.strength;
        }
        return summary;
    };
    const hidden = (count, prefix) =>
        Array.from({ length: count }, () => ({ uuid: uuid(prefix), facedown: true, tokens: {} }));
    const faction = (name, extra = {}) => ({ uuid: uuid(name), ...factionCards[name], ...extra });

    return { card, hidden, faction };
};

const promptState = (extra = {}) => ({
    isActivePrompt: false,
    menuTitle: 'Waiting for opponent',
    promptTitle: undefined,
    buttons: [],
    controls: [],
    ...extra
});

const player = ({ name, seatNo, faction, agenda, phase, ...rest }) => ({
    id: name,
    name,
    user: { username: name },
    seatNo,
    faction,
    agendas: agenda ? [agenda] : [],
    phase,
    firstPlayer: false,
    numDrawCards: 30,
    keywordSettings: { chooseOrder: false, chooseCards: false },
    promptDupes: false,
    promptedActionWindows: {},
    hideInterrupts: true,
    hideReactions: true,
    canSafelyLeave: true,
    showDeck: false,
    revealTopCard: false,
    mustShowPlotSelection: false,
    stats: { claim: 1, initiative: 0, gold: 0, reserve: 6, totalPower: 0 },
    ...promptState(),
    ...rest,
    cardPiles: {
        // The server sends a face-down entry for every card in the draw deck
        drawDeck: Array.from({ length: rest.numDrawCards ?? 30 }, (_, index) => ({
            uuid: `${name}-deck-${index}`,
            facedown: true,
            tokens: {}
        })),
        cardsInPlay: [],
        deadPile: [],
        discardPile: [],
        hand: [],
        outOfGamePile: [],
        plotDeck: [],
        plotDiscard: [],
        shadows: [],
        ...rest.cardPiles
    }
});

const game = (players, extra = {}) => ({
    id: 'fixture',
    name: 'Board fixture',
    owner: fixtureUsername,
    players: Object.fromEntries(players.map((p) => [p.name, p])),
    messages: [],
    spectators: [],
    started: true,
    gameFormat: 'joust',
    gameVariant: 'none',
    maxPlayers: 2,
    manualMode: false,
    muteSpectators: false,
    useGameTimeLimit: false,
    useChessClocks: false,
    ...extra
});

// Whom each title rivals and supports, by name, as the server sends them
const titleRelations = {
    '01206': { rivals: ['Master of Laws', 'Master of Coin'], supports: ['Hand of the King'] },
    '01207': { rivals: ['Master of Laws', 'Hand of the King'], supports: ['Master of Whispers'] },
    '01208': { rivals: ['Master of Coin', 'Master of Ships'], supports: ['Master of Laws'] },
    '01209': { rivals: ['Hand of the King', 'Master of Whispers'], supports: ['Master of Ships'] },
    '01210': { rivals: ['Master of Whispers', 'Master of Ships'], supports: ['Master of Coin'] },
    '01211': { rivals: [], supports: [] }
};

const plotCodes = ['01001', '01003', '01004', '01006', '01007', '01009', '01010'];

const empty = () => {
    const { card, hidden, faction } = createDeck();
    return game([
        player({
            name: fixtureUsername,
            seatNo: 1,
            phase: 'marshal',
            faction: faction('stark'),
            agenda: card('01027'),
            activePlot: card('01003'),
            stats: { claim: 1, initiative: 0, gold: 8, reserve: 6, totalPower: 0 },
            ...promptState({
                isActivePrompt: true,
                menuTitle: 'Marshal your cards',
                buttons: [{ text: 'Done', arg: 'done', promptId: 'p1' }]
            }),
            cardPiles: {
                hand: ['01141', '01143', '01144', '01154', '01153', '01157', '01145'].map((code) =>
                    card(code)
                ),
                plotDeck: plotCodes.slice(1).map((code) => card(code))
            }
        }),
        player({
            name: opponentName,
            seatNo: 2,
            phase: 'marshal',
            faction: faction('lannister'),
            agenda: card('01200'),
            activePlot: card('01010'),
            firstPlayer: true,
            stats: { claim: 1, initiative: 1, gold: 10, reserve: 6, totalPower: 0 },
            cardPiles: { hand: hidden(7, 'opphand'), plotDeck: hidden(6, 'oppplot') }
        })
    ]);
};

const midGame = () => {
    const { card, hidden, faction } = createDeck();
    return game([
        player({
            name: fixtureUsername,
            seatNo: 1,
            phase: 'challenge',
            faction: faction('stark', { power: 3 }),
            agenda: card('01027'),
            activePlot: card('01013'),
            stats: { claim: 1, initiative: 2, gold: 1, reserve: 6, totalPower: 6 },
            ...promptState({
                isActivePrompt: true,
                promptTitle: 'Challenges',
                menuTitle: 'Initiate a challenge?',
                buttons: [
                    { text: 'Military', arg: 'military', promptId: 'p1', icon: 'military' },
                    { text: 'Intrigue', arg: 'intrigue', promptId: 'p1', icon: 'intrigue' },
                    { text: 'Power', arg: 'power', promptId: 'p1', icon: 'power' },
                    { text: 'Done', arg: 'done', promptId: 'p1' }
                ]
            }),
            cardPiles: {
                cardsInPlay: [
                    card('01144', { power: 2, attachments: [card('01153')] }),
                    card('01146', { kneeled: true, tokens: { gold: 2 } }),
                    card('01143', { power: 1, tokens: { poison: 1 } }),
                    card('01145', { power: 5 }),
                    card('01154'),
                    card('01155', { kneeled: true })
                ],
                hand: ['01141', '01157', '01159', '01033'].map((code) => card(code)),
                discardPile: ['01142', '01041', '01036', '01156', '01045'].map((code) =>
                    card(code)
                ),
                deadPile: [card('01028')],
                plotDeck: plotCodes.slice(2).map((code) => card(code)),
                plotDiscard: [card('01001')]
            }
        }),
        player({
            name: opponentName,
            seatNo: 2,
            phase: 'challenge',
            faction: faction('lannister', { power: 2 }),
            agenda: card('01200'),
            activePlot: card('01016'),
            firstPlayer: true,
            numDrawCards: 24,
            stats: { claim: 1, initiative: 5, gold: 3, reserve: 6, totalPower: 4 },
            cardPiles: {
                cardsInPlay: [
                    card('01090', { power: 2 }),
                    card('01089', { kneeled: true, attachments: [card('01034')] }),
                    card('01084'),
                    card('01092', { kneeled: true }),
                    card('01097'),
                    card('01098')
                ],
                hand: hidden(5, 'opphand'),
                discardPile: ['01093', '01100'].map((code) => card(code)),
                deadPile: [card('01094')],
                plotDeck: hidden(5, 'oppplot'),
                plotDiscard: [card('01020')]
            }
        })
    ]);
};

const crowded = () => {
    const { card, hidden, faction } = createDeck();
    const ourCharacters = [
        card('01144', { power: 4, attachments: [card('01153'), card('01036')] }),
        card('01146', { kneeled: true, dupes: [card('01146')] }),
        card('01143', { power: 2 }),
        card('01145', { kneeled: true }),
        card('01141'),
        card('01142'),
        card('01031', { kneeled: true }),
        card('01029', { attachments: [card('01033')] }),
        card('01028'),
        card('01085', { controlled: true }),
        card('01086', { kneeled: true, power: 1 })
    ];
    const theirCharacters = [
        card('01090', { power: 3, attachments: [card('01096')] }),
        card('01089', { kneeled: true, dupes: [card('01089')] }),
        card('01084', { power: 2 }),
        card('01087', { kneeled: true }),
        card('01088'),
        card('01091'),
        card('01092', { kneeled: true }),
        card('01093'),
        card('01094'),
        card('01095')
    ];
    return game([
        player({
            name: fixtureUsername,
            seatNo: 1,
            phase: 'challenge',
            faction: faction('stark', { power: 5, kneeled: true }),
            agenda: card('01027'),
            activePlot: card('01007'),
            numDrawCards: 9,
            stats: { claim: 1, initiative: 3, gold: 2, reserve: 6, totalPower: 12 },
            ...promptState({
                isActivePrompt: true,
                promptTitle: 'Challenges',
                menuTitle: 'Initiate a challenge?',
                buttons: [
                    { text: 'Military', arg: 'military', promptId: 'p1', icon: 'military' },
                    { text: 'Intrigue', arg: 'intrigue', promptId: 'p1', icon: 'intrigue' },
                    { text: 'Power', arg: 'power', promptId: 'p1', icon: 'power' },
                    { text: 'Done', arg: 'done', promptId: 'p1' }
                ]
            }),
            cardPiles: {
                cardsInPlay: [
                    ...ourCharacters,
                    card('01154'),
                    card('01155', { kneeled: true }),
                    card('01156'),
                    card('01038'),
                    card('01039')
                ],
                hand: [
                    '01141',
                    '01157',
                    '01159',
                    '01033',
                    '01034',
                    '01040',
                    '01099',
                    '01092',
                    '01041'
                ].map((code) => card(code)),
                shadows: hidden(2, 'shadow'),
                outOfGamePile: [card('01094')],
                discardPile: ['01142', '01041', '01036', '01156', '01045', '01093', '01088'].map(
                    (code) => card(code)
                ),
                deadPile: ['01028', '01029', '01031'].map((code) => card(code)),
                plotDeck: plotCodes.slice(5).map((code) => card(code)),
                plotDiscard: plotCodes.slice(0, 4).map((code) => card(code))
            }
        }),
        player({
            name: opponentName,
            seatNo: 2,
            phase: 'challenge',
            faction: faction('lannister', { power: 4 }),
            agendas: [card('06018'), card('01198'), card('01199')],
            activePlot: card('01009'),
            firstPlayer: true,
            numDrawCards: 11,
            stats: { claim: 1, initiative: 1, gold: 0, reserve: 6, totalPower: 13 },
            cardPiles: {
                cardsInPlay: [
                    ...theirCharacters,
                    card('01097'),
                    card('01098', { kneeled: true }),
                    card('01099'),
                    card('01040')
                ],
                hand: hidden(8, 'opphand'),
                shadows: hidden(1, 'oppshadow'),
                discardPile: ['01093', '01100', '01088'].map((code) => card(code)),
                deadPile: ['01094', '01091'].map((code) => card(code)),
                plotDeck: hidden(3, 'oppplot'),
                plotDiscard: plotCodes.slice(0, 4).map((code) => card(code))
            }
        })
    ]);
};

const plotSelection = () => {
    const state = empty();
    const me = state.players[fixtureUsername];
    const opponent = state.players[opponentName];
    for (const p of [me, opponent]) {
        p.phase = 'plot';
        p.activePlot = undefined;
        p.stats = { ...p.stats, gold: 0 };
    }
    me.cardPiles.plotDeck = plotCodes.map((code, index) => ({
        ...me.cardPiles.plotDeck[index % me.cardPiles.plotDeck.length],
        uuid: `plot-${code}`,
        code,
        name: cardData[code].name,
        selectable: true
    }));
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            menuTitle: 'Select a plot',
            buttons: [{ text: 'Done', arg: 'done', promptId: 'p1', disabled: true }]
        })
    );
    return state;
};

const choosingFromDiscard = () => {
    const state = midGame();
    const me = state.players[fixtureUsername];
    me.cardPiles.discardPile = me.cardPiles.discardPile.map((card) => ({
        ...card,
        selectable: card.type === 'character',
        unselectable: card.type !== 'character'
    }));
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            promptTitle: 'Put into play',
            menuTitle: 'Select a character from your discard pile',
            buttons: [{ text: 'Cancel', arg: 'cancel', promptId: 'p1', cancel: true }]
        })
    );
    return state;
};

// Cards to choose that are not on top of their pile: the draw deck, face down, searched for a character
const searchingDeck = () => {
    const state = midGame();
    const me = state.players[fixtureUsername];
    const codes = ['01142', '01144', '01089', '01160'];
    me.cardPiles.drawDeck = me.cardPiles.drawDeck.map((card, index) =>
        index < 8
            ? {
                  uuid: card.uuid,
                  code: codes[index % codes.length],
                  type: 'character',
                  tokens: {},
                  selectable: index % 2 === 1,
                  unselectable: index % 2 === 0
              }
            : card
    );
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            promptTitle: 'Search',
            menuTitle: 'Select a character from your deck',
            buttons: [{ text: 'Done', arg: 'done', promptId: 'p1' }]
        })
    );
    return state;
};

// Setup beginning, for the game's opening overlay: the opponent has two agendas, as with The Free Folk
const gameStarting = () => {
    const state = empty();
    for (const each of Object.values(state.players)) {
        each.phase = 'setup';
        each.activePlot = undefined;
    }
    const rival = state.players[opponentName];
    rival.agendas = [
        ...rival.agendas,
        { ...rival.agendas[0], uuid: 'second-agenda', code: '01027' }
    ];
    return state;
};

const gameOverButtons = [
    { arg: 'continue', text: 'Continue Playing', promptId: 'over' },
    { arg: 'rematch', text: 'Rematch', promptId: 'over' }
];

// We reached 15 power
const gameWon = () => {
    const state = midGame();
    const me = state.players[fixtureUsername];
    me.stats = { ...me.stats, totalPower: 15 };
    me.standing = 1;
    state.players[opponentName].standing = 2;
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            promptTitle: 'Game Won',
            menuTitle: 'You has won the game!',
            buttons: gameOverButtons
        })
    );
    return { ...state, gameOver: true, winners: [fixtureUsername], winReason: 'power' };
};

// A melee table as setup begins, before any titles
const meleeStarting = (options) => {
    const state = meleeGame({ ...options, titles: false });
    for (const each of Object.values(state.players)) {
        each.phase = 'setup';
        each.activePlot = undefined;
    }
    return state;
};

// Our opponent reached 15 power
const gameLost = () => {
    const state = gameWon();
    state.players[fixtureUsername].stats.totalPower = 11;
    state.players[fixtureUsername].standing = 2;
    state.players[opponentName].stats = { ...state.players[opponentName].stats, totalPower: 15 };
    state.players[opponentName].standing = 1;
    state.players[fixtureUsername].menuTitle = `${opponentName} has won the game!`;
    return { ...state, winners: [opponentName] };
};

// The game ended with nobody winning
const gameDrawn = () => {
    const state = gameWon();
    for (const each of Object.values(state.players)) {
        each.standing = undefined;
    }
    return { ...state, winners: [], winReason: 'draw' };
};

// A melee won on power: two tied for second, one put out by an empty deck
const meleeWon = (options) => {
    const state = meleeGame(options);
    const winner = meleeName(state, 2);
    const out = meleeName(state, 4);
    for (const each of Object.values(state.players)) {
        each.standing = each.name === winner ? 1 : each.name === out ? 4 : 2;
        each.stats = { ...each.stats, totalPower: each.name === winner ? 15 : 11 };
    }
    Object.assign(state.players[out], { eliminated: true, eliminatedReason: 'decked' });
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            menuTitle: `${winner} has won the game!`,
            buttons: gameOverButtons
        })
    );
    return { ...state, gameOver: true, winners: [winner], winReason: 'power' };
};

const waiting = () => {
    const state = midGame();
    Object.assign(
        state.players[fixtureUsername],
        promptState({ menuTitle: 'Waiting for opponent to initiate a challenge' })
    );
    Object.assign(
        state.players[opponentName],
        promptState({ isActivePrompt: true, menuTitle: 'Initiate a challenge?' })
    );
    return state;
};

const choosingOnBoard = () => {
    const state = midGame();
    const me = state.players[fixtureUsername];
    const opponent = state.players[opponentName];
    let first = true;
    me.cardPiles.cardsInPlay = me.cardPiles.cardsInPlay.map((card) => {
        if (card.type !== 'character') {
            return { ...card, unselectable: true };
        }
        const chosen = first;
        first = false;
        return { ...card, selectable: true, selected: chosen };
    });
    opponent.cardPiles.cardsInPlay = opponent.cardPiles.cardsInPlay.map((card) => ({
        ...card,
        unselectable: true
    }));
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            selectCard: true,
            promptTitle: 'Military claim',
            menuTitle: 'Select 2 characters to kill',
            buttons: [{ text: 'Done', arg: 'done', promptId: 'p1' }]
        })
    );
    return state;
};

const namingCard = () => {
    const state = midGame();
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            promptTitle: "The Hand's Judgment",
            menuTitle: 'Name a card',
            controls: [
                {
                    type: 'card-name',
                    command: 'menuButton',
                    method: 'selectCardName',
                    promptId: 'p1'
                }
            ],
            buttons: [{ text: 'Cancel', arg: 'cancel', promptId: 'p1', cancel: true }]
        })
    );
    return state;
};

// A reaction window with something to trigger: the cards that can react are chosen on the board, and only cards
// that cannot be shown there (in a draw deck, discard or dead pile) become buttons, as the server sends them
const reactionWindow = () => {
    const state = crowded();
    const me = state.players[fixtureUsername];
    const reacting = ['01144', '01146', '01145'];
    const choose = (card) =>
        reacting.includes(card.code)
            ? { ...card, selectable: true }
            : { ...card, unselectable: true };
    me.cardPiles.cardsInPlay = me.cardPiles.cardsInPlay.map(choose);
    me.cardPiles.hand = me.cardPiles.hand.map((card) =>
        card.code === '01159' ? { ...card, selectable: true } : { ...card, unselectable: true }
    );
    const opponent = state.players[opponentName];
    opponent.cardPiles.cardsInPlay = opponent.cardPiles.cardsInPlay.map((card) => ({
        ...card,
        unselectable: true
    }));
    const fromDiscard =
        me.cardPiles.discardPile.find((card) => card.code === '01045') ||
        me.cardPiles.discardPile[0];
    Object.assign(
        me,
        promptState({
            isActivePrompt: true,
            selectCard: true,
            promptTitle: 'Military Challenge',
            menuTitle: 'Any reactions to the challenge being won?',
            buttons: [
                {
                    text: `${fromDiscard.name} (discard pile)`,
                    arg: fromDiscard.uuid,
                    promptId: 'p1',
                    card: { code: fromDiscard.code }
                },
                { text: "Don't ask again this phase", arg: 'passAndPauseForPhase', promptId: 'p1' },
                { text: 'Pass', arg: 'done', promptId: 'p1' }
            ]
        })
    );
    return state;
};

// What every player who might be able to respond sees, whether or not they can, so nobody can tell who can
const possibleResponder = () => {
    const state = crowded();
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            selectCard: true,
            promptTitle: 'Military Challenge',
            menuTitle: 'Any reactions to the challenge being won?',
            controls: [
                {
                    type: 'response-delay',
                    duration: 600000,
                    abilityWord: 'reaction',
                    promptId: 'p1'
                }
            ],
            buttons: [
                { text: 'Pass', arg: 'done', promptId: 'p1' },
                { text: 'Wait', arg: 'wait', promptId: 'p1', pausesTimer: true },
                { text: "Don't ask again this phase", arg: 'passAndPauseForPhase', promptId: 'p1' }
            ]
        })
    );
    return state;
};

const manyChoices = () => {
    const state = midGame();
    const names = Object.entries(cardData)
        .filter(([, data]) => data.type === 'character')
        .slice(0, 12);
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            promptTitle: 'Search your deck',
            menuTitle: 'Select a character to put into play',
            buttons: [
                ...names.map(([code, data], index) => ({
                    text: data.name,
                    arg: `c${index}`,
                    promptId: 'p1',
                    card: { code }
                })),
                { text: 'Done', arg: 'done', promptId: 'p1', cancel: true }
            ]
        })
    );
    return state;
};

// Plot selection with The Rains of Castamere: the plot deck is grouped into plots and schemes, as the server sends it
const rainsPlotSelection = () => {
    const state = plotSelection();
    const me = state.players[fixtureUsername];
    me.agendas = [{ ...me.agendas[0], code: '05045', name: cardData['05045'].name, uuid: 'rains' }];
    const schemes = ['05049', '05050'].map((code) => ({
        uuid: `scheme-${code}`,
        code,
        name: cardData[code].name,
        type: 'plot',
        facedown: false,
        tokens: {},
        attachments: [],
        childCards: [],
        dupes: [],
        selectable: true,
        group: 'Scheme'
    }));
    me.cardPiles.plotDeck = [
        ...me.cardPiles.plotDeck.map((plot) => ({ ...plot, group: 'Plot' })),
        ...schemes
    ];
    return state;
};

// Melee: up to six seats around the table, us in seat 1. options.players (3 to 6) says how many sit down.
const meleeSeats = [
    {
        name: fixtureUsername,
        faction: 'stark',
        title: '01208',
        characters: ['01144', '01146', '01143', '01145'],
        locations: ['01154', '01155'],
        stats: { claim: 1, initiative: 2, gold: 3, reserve: 6, totalPower: 5 }
    },
    {
        name: 'Ann',
        faction: 'baratheon',
        title: '01211',
        characters: ['01052', '01047', '01048', '01050', '01046'],
        locations: ['01059'],
        stats: { claim: 1, initiative: 4, gold: 2, reserve: 6, totalPower: 7 }
    },
    {
        name: 'Bob',
        faction: 'greyjoy',
        title: '01209',
        characters: ['01068', '01069', '01067', '01071', '01065'],
        locations: ['01078'],
        stats: { claim: 1, initiative: 1, gold: 5, reserve: 6, totalPower: 3 }
    },
    {
        name: 'Cy',
        faction: 'martell',
        title: '01207',
        characters: ['01109', '01105', '01104', '01103'],
        locations: ['01117'],
        stats: { claim: 2, initiative: 0, gold: 4, reserve: 5, totalPower: 9 }
    },
    {
        name: 'Di',
        faction: 'thenightswatch',
        title: '01210',
        characters: ['01126', '01124', '01122', '01123'],
        locations: ['01136', '01137'],
        stats: { claim: 1, initiative: 3, gold: 1, reserve: 7, totalPower: 4 }
    },
    {
        name: 'Ed',
        faction: 'tyrell',
        title: '01206',
        characters: ['01181', '01185', '01183', '01180'],
        locations: ['01192'],
        stats: { claim: 1, initiative: 2, gold: 6, reserve: 6, totalPower: 6 }
    }
];

const meleeGame = ({ players = 4, titles = true } = {}) => {
    const count = Math.min(6, Math.max(3, Number(players) || 4));
    const { card, hidden, faction } = createDeck();
    const seats = meleeSeats.slice(0, count).map((seat, index) => {
        const isMe = seat.name === fixtureUsername;
        return player({
            name: seat.name,
            seatNo: index + 1,
            phase: 'challenge',
            faction: faction(seat.faction, { power: index % 3 }),
            agenda: card(index === 0 ? '01027' : '01198'),
            activePlot: card(plotCodes[index % plotCodes.length]),
            title: titles ? card(seat.title, titleRelations[seat.title]) : undefined,
            firstPlayer: index === 1,
            numDrawCards: 20 + index,
            stats: seat.stats,
            ...promptState({ menuTitle: 'Waiting for Ann to initiate a challenge' }),
            cardPiles: {
                cardsInPlay: [
                    ...seat.characters.map((code, at) =>
                        card(code, { kneeled: at === 1, power: at === 0 ? 2 : 0 })
                    ),
                    ...seat.locations.map((code) => card(code))
                ],
                hand: isMe
                    ? ['01141', '01157', '01159', '01033'].map((code) => card(code))
                    : hidden(4 + (index % 3), `${seat.name}-hand`),
                discardPile: isMe ? ['01142', '01041'].map((code) => card(code)) : [],
                deadPile: [],
                plotDeck: isMe
                    ? plotCodes.slice(2).map((code) => card(code))
                    : hidden(4, `${seat.name}-plot`),
                plotDiscard: [card(plotCodes[(index + 1) % plotCodes.length])]
            }
        });
    });
    return game(seats, { gameFormat: 'melee', maxPlayers: count });
};

const meleeName = (state, at) => Object.values(state.players).find((p) => p.seatNo === at)?.name;

// Our prompt: initiate a challenge
const meleeTable = (options) => {
    const state = meleeGame(options);
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            promptTitle: 'Challenges',
            menuTitle: 'Initiate a challenge?',
            buttons: [
                { text: 'Military', arg: 'military', promptId: 'p1', icon: 'military' },
                { text: 'Intrigue', arg: 'intrigue', promptId: 'p1', icon: 'intrigue' },
                { text: 'Power', arg: 'power', promptId: 'p1', icon: 'power' },
                { text: 'Done', arg: 'done', promptId: 'p1' }
            ]
        })
    );
    return state;
};

// An opponent across the table has the prompt, and we wait
const meleeOpponentActing = (options) => {
    const state = meleeGame(options);
    const acting = meleeName(state, 3);
    state.players[acting].isActivePrompt = true;
    state.players[acting].menuTitle = 'Initiate a challenge?';
    state.players[fixtureUsername].menuTitle = `Waiting for ${acting} to initiate a challenge`;
    return state;
};

// Our prompt chooses characters on two opponents' boards
const meleeChoosing = (options) => {
    const state = meleeGame(options);
    const count = Object.keys(state.players).length;
    const targets = [meleeName(state, 2), meleeName(state, count)];
    for (const each of Object.values(state.players)) {
        const target = targets.includes(each.name);
        each.cardPiles.cardsInPlay = each.cardPiles.cardsInPlay.map((card) =>
            target && card.type === 'character'
                ? { ...card, selectable: true }
                : { ...card, unselectable: true }
        );
    }
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            selectCard: true,
            promptTitle: 'Military claim',
            menuTitle: 'Select a character to kill',
            buttons: [{ text: 'Done', arg: 'done', promptId: 'p1' }]
        })
    );
    return state;
};

// The plot phase's title choice: every title still to choose, as buttons with their cards
const meleeTitleSelection = (options) => {
    const state = meleeGame({ ...options, titles: false });
    for (const each of Object.values(state.players)) {
        each.phase = 'plot';
    }
    const titles = ['01206', '01207', '01208', '01209', '01210', '01211'];
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            menuTitle: 'Select a title',
            buttons: titles.map((code) => ({
                text: cardData[code].name,
                arg: `title-${code}`,
                method: 'chooseTitle',
                promptId: 'titles',
                card: { code, name: cardData[code].name, type: 'title' }
            }))
        })
    );
    return state;
};

const choosingFirstPlayer = (state) => {
    for (const each of Object.values(state.players)) {
        each.phase = 'plot';
    }
    const names = Object.values(state.players)
        .sort((one, two) => one.seatNo - two.seatNo)
        .map((each) => each.name);
    Object.assign(
        state.players[fixtureUsername],
        promptState({
            isActivePrompt: true,
            menuTitle: 'Select first player',
            buttons: names.map((name) => ({ text: name, arg: name, promptId: 'first' }))
        })
    );
    return state;
};
const firstPlayer = () => choosingFirstPlayer(midGame());
const meleeFirstPlayer = (options) => choosingFirstPlayer(meleeGame(options));

// A prompt whose text runs over several lines on a phone
const longPrompt = (options) => {
    const state = choosingFromDiscard(options);
    state.players[fixtureUsername].menuTitle =
        'Select a character from your discard pile to put into play, then choose a card in your hand to discard as its cost';
    return state;
};

// Each scenario is for a joust (two players) or a melee (three to six), the dev board offering those of the kind chosen
// Each scenario is for a joust (two players) or a melee (three to six), the dev board offering those of the kind chosen
export const boardFixtures = {
    empty: { mode: 'joust', label: 'Empty board', build: empty },
    mid: { mode: 'joust', label: 'Mid-game', build: midGame },
    crowded: { mode: 'joust', label: 'Crowded', build: crowded },
    plots: { mode: 'joust', label: 'Plot selection', build: plotSelection },
    rains: { mode: 'joust', label: 'Plot selection (Rains)', build: rainsPlotSelection },
    discard: { mode: 'joust', label: 'Choose from discard', build: choosingFromDiscard },
    search: { mode: 'joust', label: 'Search the deck', build: searchingDeck },
    select: { mode: 'joust', label: 'Choose on the board', build: choosingOnBoard },
    lookup: { mode: 'joust', label: 'Name a card', build: namingCard },
    reaction: { mode: 'joust', label: 'Reaction window', build: reactionWindow },
    responder: { mode: 'joust', label: 'Any reactions? (countdown)', build: possibleResponder },
    choices: { mode: 'joust', label: 'Many choices', build: manyChoices },
    longPrompt: { mode: 'joust', label: 'Long prompt text', build: longPrompt },
    waiting: { mode: 'joust', label: 'Waiting on opponent', build: waiting },
    firstPlayer: { mode: 'joust', label: 'Choose the first player', build: firstPlayer },
    starting: { mode: 'joust', label: 'Game starting (setup)', build: gameStarting },
    won: { mode: 'joust', label: 'Game won', build: gameWon },
    lost: { mode: 'joust', label: 'Game lost', build: gameLost },
    drawn: { mode: 'joust', label: 'Game ended, no winner', build: gameDrawn },
    melee: { mode: 'melee', label: 'Mid-game', build: meleeTable },
    meleeActing: { mode: 'melee', label: 'An opponent acting', build: meleeOpponentActing },
    meleeChoose: { mode: 'melee', label: 'Choosing on two boards', build: meleeChoosing },
    meleeTitles: { mode: 'melee', label: 'Title selection', build: meleeTitleSelection },
    meleeFirstPlayer: { mode: 'melee', label: 'Choose the first player', build: meleeFirstPlayer },
    meleeStarting: { mode: 'melee', label: 'Game starting (setup)', build: meleeStarting },
    meleeWon: { mode: 'melee', label: 'Game won', build: meleeWon }
};

// Changes to a fixture in the shape a server sends them, keeping each card's uuid, so the board animates the card
// from where it was to where it went. Development only, for checking flights.
const drawPool = ['01141', '01142', '01143', '01157', '01153', '01154'];

// The next player round the melee table from the one acting (seat numbers going down, as the table seats them)
const nextAround = (players, from) => {
    const ordered = [...players].sort((one, two) => two.seatNo - one.seatNo);
    const at = ordered.indexOf(from);
    return ordered[(at + 1) % ordered.length];
};

let revealed = 0;
const fixtureCard = (code, uuid) => ({
    uuid,
    code,
    name: cardData[code]?.name,
    type: cardData[code]?.type,
    facedown: false,
    power: 0,
    tokens: {},
    attachments: [],
    childCards: [],
    dupes: [],
    kneeled: false
});
const opponentOf = (state) =>
    Object.values(state.players).find((each) => each.name !== fixtureUsername)?.name;
const playing = (state) => Object.values(state.players).filter((each) => !each.eliminated);

export const fixtureSteps = {
    endRound: {
        label: 'End the round',
        apply: (state) => {
            const round =
                1 +
                state.messages.filter((entry) => entry.message?.alert?.type === 'endofround')
                    .length;
            playing(state).forEach((each, index) => {
                each.stats = {
                    ...each.stats,
                    totalPower: (each.stats?.totalPower ?? 0) + (index % 3)
                };
            });
            state.messages = [
                ...state.messages,
                {
                    date: new Date().toISOString(),
                    message: { alert: { type: 'endofround', message: ['End of round ', round] } }
                }
            ];
            return state;
        }
    },
    plots: {
        label: 'Reveal new plots',
        apply: (state) => {
            playing(state).forEach((each, index) => {
                each.phase = 'plot';
                if (each.activePlot) {
                    each.cardPiles.plotDiscard = [...each.cardPiles.plotDiscard, each.activePlot];
                }
                revealed++;
                each.activePlot = fixtureCard(
                    plotCodes[(revealed + index) % plotCodes.length],
                    `revealed-${revealed}`
                );
            });
            return state;
        }
    },
    scheme: {
        label: 'Reveal one plot (a scheme)',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            if (me.activePlot) {
                me.cardPiles.plotDiscard = [...me.cardPiles.plotDiscard, me.activePlot];
            }
            revealed++;
            me.activePlot = fixtureCard(
                plotCodes[revealed % plotCodes.length],
                `scheme-${revealed}`
            );
            return state;
        }
    },
    titles: {
        label: 'Choose new titles',
        modes: ['melee'],
        apply: (state) => {
            const players = playing(state);
            const titles = players.map((each) => each.title).filter(Boolean);
            revealed++;
            players.forEach((each, index) => {
                const title = titles[(index + 1) % titles.length];
                each.title = title && { ...title, uuid: `${title.code}-${revealed}` };
            });
            return state;
        }
    },
    eliminate: {
        label: 'Eliminate a player',
        modes: ['melee'],
        apply: (state) => {
            const out = playing(state).find((each) => each.name !== fixtureUsername);
            if (out && playing(state).length > 2) {
                Object.assign(out, { eliminated: true, eliminatedReason: 'decked' });
            }
            return state;
        }
    },
    answer: {
        label: 'Answer the prompt',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            if (me) {
                Object.assign(me, promptState({ menuTitle: 'Waiting for opponent' }));
            }
            return state;
        }
    },
    pass: {
        label: 'Pass the action on',
        apply: (state) => {
            const players = Object.values(state.players);
            const acting =
                players.find((each) => each.isActivePrompt) ?? state.players[fixtureUsername];
            const next = nextAround(players, acting);
            for (const each of players) {
                Object.assign(
                    each,
                    each === next
                        ? promptState({
                              isActivePrompt: true,
                              promptTitle: 'Challenges',
                              menuTitle: 'Initiate a challenge?',
                              buttons:
                                  each.name === fixtureUsername
                                      ? [{ text: 'Done', arg: 'done', promptId: 'p1' }]
                                      : []
                          })
                        : promptState({ menuTitle: `Waiting for ${next.name}` })
                );
            }
            return state;
        }
    },
    draw: {
        label: 'Draw a card',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            const [top, ...rest] = me.cardPiles.drawDeck;
            if (!top) {
                return state;
            }
            const code = drawPool[me.cardPiles.hand.length % drawPool.length];
            me.cardPiles.drawDeck = rest;
            me.numDrawCards = rest.length;
            me.cardPiles.hand = [
                ...me.cardPiles.hand,
                {
                    ...top,
                    facedown: false,
                    code,
                    name: cardData[code].name,
                    type: cardData[code].type,
                    attachments: [],
                    dupes: [],
                    childCards: []
                }
            ];
            return state;
        }
    },
    drawSeven: {
        label: 'Draw 7 (a new hand)',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            const drawn = me.cardPiles.drawDeck.slice(0, 7);
            me.cardPiles.drawDeck = me.cardPiles.drawDeck.slice(7);
            me.numDrawCards = me.cardPiles.drawDeck.length;
            me.cardPiles.discardPile = [...me.cardPiles.hand, ...me.cardPiles.discardPile];
            me.cardPiles.hand = drawn.map((top, index) => {
                const code = drawPool[index % drawPool.length];
                return {
                    ...top,
                    facedown: false,
                    code,
                    name: cardData[code].name,
                    type: cardData[code].type,
                    attachments: [],
                    dupes: [],
                    childCards: []
                };
            });
            return state;
        }
    },
    pillage: {
        label: 'Pillage (discard the top of the deck)',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            const [top, ...rest] = me.cardPiles.drawDeck;
            if (!top) {
                return state;
            }
            const code = drawPool[me.cardPiles.discardPile.length % drawPool.length];
            me.cardPiles.drawDeck = rest;
            me.numDrawCards = rest.length;
            me.cardPiles.discardPile = [
                {
                    ...top,
                    facedown: false,
                    code,
                    name: cardData[code].name,
                    type: cardData[code].type,
                    attachments: [],
                    dupes: [],
                    childCards: []
                },
                ...me.cardPiles.discardPile
            ];
            return state;
        }
    },
    play: {
        label: 'Play a character from hand',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            const card = me.cardPiles.hand.find((entry) => entry.type === 'character');
            if (!card) {
                return state;
            }
            me.cardPiles.hand = me.cardPiles.hand.filter((entry) => entry !== card);
            me.cardPiles.cardsInPlay = [...me.cardPiles.cardsInPlay, card];
            return state;
        }
    },
    kill: {
        label: 'Kill a character',
        apply: (state) => {
            const me = state.players[fixtureUsername];
            const card = me.cardPiles.cardsInPlay.find((entry) => entry.type === 'character');
            if (!card) {
                return state;
            }
            me.cardPiles.cardsInPlay = me.cardPiles.cardsInPlay.filter((entry) => entry !== card);
            me.cardPiles.deadPile = [
                { ...card, attachments: [], kneeled: false },
                ...me.cardPiles.deadPile
            ];
            return state;
        }
    },
    log: {
        label: 'Log a line',
        apply: (state) => {
            const lines = [
                [{ name: opponentOf(state), argType: 'nonAvatarPlayer' }, ' draws 2 cards'],
                [
                    { name: opponentOf(state), argType: 'nonAvatarPlayer' },
                    ' uses ',
                    { code: '01088', label: 'Tyrion Lannister', argType: 'card' },
                    ' to gain 2 gold'
                ],
                [{ alert: { type: 'warning', message: ['Military challenge won by 3 STR'] } }],
                [
                    { name: fixtureUsername, argType: 'nonAvatarPlayer' },
                    ' kneels their faction card'
                ],
                [
                    { name: opponentOf(state), argType: 'nonAvatarPlayer' },
                    ' uses ',
                    { code: '01088', label: 'Tyrion Lannister', argType: 'card' },
                    ' to choose and discard 1 card at random from the hand of ',
                    { name: fixtureUsername, argType: 'nonAvatarPlayer' },
                    ', then gains 2 power for their faction'
                ]
            ];
            const count = state.messages.length;
            state.messages = [
                ...state.messages,
                { date: new Date().toISOString(), message: lines[count % lines.length] }
            ];
            return state;
        }
    },
    chat: {
        label: 'Opponent chats',
        apply: (state) => {
            state.messages = [
                ...state.messages,
                {
                    date: new Date().toISOString(),
                    message: [{ name: opponentOf(state), argType: 'player' }, ' good luck!']
                }
            ];
            return state;
        }
    },
    pick: {
        label: 'Choose from their hand',
        apply: (state) => {
            const them = state.players[opponentOf(state)];
            const choosing = !them.cardPiles.hand.some((card) => card.selectable);
            them.cardPiles.hand = them.cardPiles.hand.map((card, index) => {
                const code = drawPool[index % drawPool.length];
                return choosing
                    ? {
                          ...card,
                          selectable: true,
                          facedown: false,
                          code,
                          name: cardData[code].name
                      }
                    : { uuid: card.uuid, facedown: true };
            });
            return state;
        }
    },
    phase: {
        label: 'Next phase',
        apply: (state) => {
            const order = [
                'setup',
                'plot',
                'draw',
                'marshal',
                'challenge',
                'dominance',
                'standing',
                'taxation'
            ];
            for (const player of Object.values(state.players)) {
                const index = order.indexOf(player.phase);
                player.phase = index === order.length - 1 ? 'plot' : order[index + 1];
            }
            return state;
        }
    }
};

export const spectatorName = 'Watcher';

// The board's overlays, each from its scenario and either the steps that bring it about or, for one the scenario
// itself shows (the start, the end, a choice), that scenario with the overlay held back until the board has loaded
export const overlayExamples = {
    start: { mode: 'joust', label: 'Game start', fixture: 'starting' },
    plots: { mode: 'joust', label: 'Plots revealed', fixture: 'mid', steps: ['plots'] },
    scheme: {
        mode: 'joust',
        label: 'One plot alone (no overlay)',
        fixture: 'mid',
        steps: ['scheme']
    },
    round: { mode: 'joust', label: 'End of round', fixture: 'mid', steps: ['endRound'] },
    chooseFirst: { mode: 'joust', label: 'Choice: first player', fixture: 'firstPlayer' },
    won: { mode: 'joust', label: 'Game over: won', fixture: 'won' },
    lost: { mode: 'joust', label: 'Game over: lost', fixture: 'lost' },
    drawn: { mode: 'joust', label: 'Game over: no winner', fixture: 'drawn' },
    meleeStart: { mode: 'melee', label: 'Game start', fixture: 'meleeStarting' },
    meleePlots: { mode: 'melee', label: 'Plots revealed', fixture: 'melee', steps: ['plots'] },
    titles: { mode: 'melee', label: 'Titles chosen', fixture: 'melee', steps: ['titles'] },
    meleeRound: { mode: 'melee', label: 'End of round', fixture: 'melee', steps: ['endRound'] },
    out: { mode: 'melee', label: 'Player eliminated', fixture: 'melee', steps: ['eliminate'] },
    chooseTitle: { mode: 'melee', label: 'Choice: a title', fixture: 'meleeTitles' },
    meleeChooseFirst: { mode: 'melee', label: 'Choice: first player', fixture: 'meleeFirstPlayer' },
    meleeWon: { mode: 'melee', label: 'Game over', fixture: 'meleeWon' }
};

// A scenario as the board first sees it when it is to show its own overlay afterwards: not yet starting, over or
// asking anything
export const withoutOverlay = (state) => {
    const calm = structuredClone(state);
    for (const each of Object.values(calm.players)) {
        if (each.phase === 'setup') {
            each.phase = 'marshal';
        }
        Object.assign(each, promptState({ menuTitle: 'Waiting…' }));
    }
    return { ...calm, gameOver: false, winners: [] };
};

// Everyone but us renamed to as long as a name can be (15 characters), in names and in everything that mentions them
const longNames = [
    'WWWhiteWalkerWW',
    'Kingslayer_1999',
    'Melisandre-Asha',
    'MOQORRO_MCBRIDE',
    'Blackfyre_Mummy',
    'Ser_ArthurDayne'
];
export const withLongNames = (state) => {
    const others = Object.values(state.players)
        .map((each) => each.name)
        .filter((name) => name !== fixtureUsername);
    let text = JSON.stringify(state);
    others.forEach((name, index) => {
        text = text.replace(new RegExp(`\\b${name}\\b`, 'g'), longNames[index % longNames.length]);
    });
    return JSON.parse(text);
};
