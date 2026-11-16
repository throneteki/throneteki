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
    '01159': { name: 'Winter Is Coming', type: 'event' }
};

const factionCards = {
    stark: { code: 'stark', name: 'House Stark', type: 'faction' },
    lannister: { code: 'lannister', name: 'House Lannister', type: 'faction' }
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
        cardsInPlay: [],
        deadPile: [],
        discardPile: [],
        drawDeck: [],
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
                menuTitle: 'Initiate a challenge',
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
                    card('01146', { kneeled: true }),
                    card('01143', { power: 1 }),
                    card('01145'),
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
                promptTitle: 'Military Challenge',
                menuTitle: 'Any reactions to the challenge being won?',
                buttons: [
                    { text: 'Eddard Stark', arg: 'a1', promptId: 'p1', card: { code: '01144' } },
                    { text: 'Robb Stark', arg: 'a2', promptId: 'p1', card: { code: '01146' } },
                    { text: 'Grey Wind', arg: 'a3', promptId: 'p1', card: { code: '01145' } },
                    {
                        text: 'Winter Is Coming',
                        arg: 'a4',
                        promptId: 'p1',
                        card: { code: '01159' }
                    },
                    { text: 'Pass', arg: 'pass', promptId: 'p1', cancel: true }
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
            agenda: card('01200', { childCards: [card('01092')] }),
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

export const boardFixtures = {
    empty: { label: 'Empty board', build: empty },
    mid: { label: 'Mid-game', build: midGame },
    crowded: { label: 'Crowded', build: crowded },
    plots: { label: 'Plot selection', build: plotSelection },
    discard: { label: 'Choose from discard', build: choosingFromDiscard }
};
