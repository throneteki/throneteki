import { matchCardByNameAndPack } from './cardutil.js';

export const DefaultFaction = 'stark';
// A Noble Cause reduces the cost of the first Lord or Lady marshaled each round, and its deck
// limit is 2. The filler plot keeps those income, initiative, claim and reserve numbers and has
// no text or traits, so it cannot change the card under test.
export const DefaultPlot = 'Filler Plot';
export const FillerPlotCard = {
    code: 'filler-plot',
    label: DefaultPlot,
    type: 'plot',
    name: DefaultPlot,
    faction: 'neutral',
    packCode: 'Filler',
    deckLimit: 7,
    plotStats: {
        income: 5,
        initiative: 0,
        claim: 1,
        reserve: 6
    },
    traits: [],
    text: ''
};
const DefaultPlotDeck = [DefaultPlot, DefaultPlot];
export const FillerCard = '03041';
const FillerCount = 20;

const PhaseOrder = ['setup', 'plot', 'marshal', 'challenge'];
const CompletePhase = {
    marshal: 'completeMarshalPhase'
};
const PlayerKeys = ['player1', 'player2'];
const ZoneKeys = ['hand', 'drawDeck', 'discard', 'deadPile', 'shadows'];
const ZoneLocations = {
    discard: 'discard pile',
    deadPile: 'dead pile',
    shadows: 'shadows'
};

export function cardReferenceName(name) {
    const withoutPack = name.replace(/\s\([^)]*\)$/, '');
    const words = withoutPack
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/['’]/g, '')
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean);

    return words
        .map((word, index) =>
            index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');
}

function normaliseCardSpec(spec) {
    return typeof spec === 'string' ? { card: spec } : spec;
}

function normaliseInPlaySpec(spec) {
    const normalised = { ...normaliseCardSpec(spec) };
    normalised.attachments = asArray(normalised.attachments).map((attachment) => ({
        ...normaliseCardSpec(attachment)
    }));
    return normalised;
}

function asArray(value) {
    if (value === undefined) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

function deckCardNames(playerKey, options) {
    const own = options[playerKey];
    const plotDeck = own.plotDeck ?? DefaultPlotDeck;
    const names = [own.plot || DefaultPlot, ...asArray(plotDeck), ...asArray(own.agenda)];

    for (const spec of asArray(own.inPlay).map(normaliseCardSpec)) {
        names.push(spec.card);
        for (let i = 0; i < (spec.dupes || 0); ++i) {
            names.push(spec.card);
        }
    }

    for (const zone of ZoneKeys) {
        names.push(...asArray(own[zone]).map((spec) => normaliseCardSpec(spec).card));
    }

    for (const key of PlayerKeys) {
        for (const spec of asArray(options[key].inPlay).map(normaliseCardSpec)) {
            for (const attachment of asArray(spec.attachments).map(normaliseCardSpec)) {
                const owner = attachment.owner || key;
                if (owner === playerKey) {
                    names.push(attachment.card);
                }
            }
        }
    }

    return [...names, { name: FillerCard, count: FillerCount }];
}

class CardClaims {
    constructor(playerWrapper) {
        this.playerWrapper = playerWrapper;
        this.claimed = new Set();
    }

    claim(name, locations = ['hand', 'draw deck']) {
        const matches = matchCardByNameAndPack(name);
        const player = this.playerWrapper.player;
        const card = player.game.allCards.find(
            (card) =>
                card.owner === player &&
                !this.claimed.has(card) &&
                locations.includes(card.location) &&
                matches(card.cardData)
        );

        if (!card) {
            throw new Error(
                `setupTest could not find an unused copy of "${name}" for ${player.name}`
            );
        }

        this.claimed.add(card);
        return card;
    }
}

function placeInPlay(game, claims, specsByPlayer) {
    const hosts = [];

    for (const key of PlayerKeys) {
        const playerWrapper = claims[key].playerWrapper;
        for (const spec of specsByPlayer[key]) {
            const copies = 1 + (spec.dupes || 0);
            let card;
            for (let i = 0; i < copies; ++i) {
                const copy = claims[key].claim(spec.card);
                playerWrapper.player.putIntoPlay(copy, 'setup', { force: true });
                card = card || copy;
            }
            hosts.push({ key, spec, card });
        }
    }

    game.continue();

    for (const { key, spec, card } of hosts) {
        for (const attachmentSpec of asArray(spec.attachments).map(normaliseCardSpec)) {
            const ownerKey = attachmentSpec.owner || key;
            const owner = claims[ownerKey].playerWrapper.player;
            const attachment = claims[ownerKey].claim(attachmentSpec.card);
            owner.attach(owner, attachment, card, 'setup');
            attachmentSpec.instance = attachment;
        }
    }

    game.continue();

    return hosts;
}

function arrangeSetupZones(claims, options) {
    const assigned = {};

    for (const key of PlayerKeys) {
        const own = options[key];
        const player = claims[key].playerWrapper.player;
        assigned[key] = {};

        for (const card of [...player.hand]) {
            player.placeCardInPile({ card, location: 'draw deck', bottom: true });
        }

        for (const zone of ['discard', 'deadPile', 'shadows']) {
            assigned[key][zone] = asArray(own[zone]).map((name) => {
                const card = claims[key].claim(name);
                player.moveCard(card, ZoneLocations[zone]);
                return card;
            });
        }

        assigned[key].hand = asArray(own.hand).map((name) => {
            const card = claims[key].claim(name);
            player.placeCardInPile({ card, location: 'hand' });
            return card;
        });

        assigned[key].drawDeck = asArray(own.drawDeck).map((name) => {
            const card = claims[key].claim(name);
            player.placeCardInPile({ card, location: 'draw deck', bottom: true });
            return card;
        });
    }

    return assigned;
}

function finaliseHiddenZones(claims, assigned) {
    for (const key of PlayerKeys) {
        const player = claims[key].playerWrapper.player;
        const handCards = assigned[key].hand;

        for (const card of player.hand.filter((card) => !handCards.includes(card))) {
            player.placeCardInPile({ card, location: 'draw deck', bottom: true });
        }

        for (const card of [...assigned[key].drawDeck].reverse()) {
            player.placeCardInPile({ card, location: 'draw deck' });
        }
    }
}

function findOwnedCard(player, name, locations) {
    const matches = matchCardByNameAndPack(name);
    return player.game.allCards.find(
        (card) =>
            card.owner === player && locations.includes(card.location) && matches(card.cardData)
    );
}

function applyCardState(card, spec) {
    if (spec.kneeling) {
        card.kneeled = true;
    }

    if (spec.power) {
        card.power = spec.power;
    }

    if (spec.gold) {
        card.modifyGold(spec.gold);
    }

    for (const [token, amount] of Object.entries(spec.tokens || {})) {
        card.modifyToken(token, amount);
    }
}

function applyPlayerState(playerWrapper, own) {
    const player = playerWrapper.player;

    if (own.gold !== undefined) {
        player.gold = own.gold;
    }

    if (own.power !== undefined) {
        player.faction.power = own.power;
    }

    if (own.factionKneeling) {
        player.faction.kneeled = true;
    }
}

function advanceToPhase(flow, phase, options, players) {
    const targetIndex = PhaseOrder.indexOf(phase);

    for (const key of PlayerKeys) {
        players[key].clickPrompt('Done');
    }

    if (targetIndex === PhaseOrder.indexOf('plot')) {
        return;
    }

    for (const key of PlayerKeys) {
        players[key].selectPlot(options[key].plot || DefaultPlot);
    }

    flow.selectFirstPlayer(players[options.firstPlayer || 'player1']);

    if (
        players.player1.hasPrompt('Choose when revealed order') ||
        players.player2.hasPrompt('Choose when revealed order')
    ) {
        throw new Error(
            "setupTest cannot resolve When Revealed abilities. Use `phase: 'plot'` and reveal the plots in the test."
        );
    }

    for (const current of PhaseOrder.slice(PhaseOrder.indexOf('marshal'), targetIndex)) {
        flow.guardCurrentPhase(current);
        flow[CompletePhase[current]]();
    }

    if (flow.game.currentPhase !== phase) {
        throw new Error(
            `setupTest expected to reach the ${phase} phase but the game is in the ${flow.game.currentPhase} phase. ` +
                'A card in the setup is probably prompting; set the test up in an earlier phase instead.'
        );
    }
}

export function applySetupTest(options, ctx) {
    const { flow, deckBuilder, registry } = ctx;
    const phase = options.phase || 'marshal';

    if (!PhaseOrder.includes(phase)) {
        throw new Error(
            `setupTest does not support the '${phase}' phase. Use one of: ${PhaseOrder.join(', ')}. ` +
                'For the dominance, standing and taxation phases, set up in the challenge phase and call this.completeChallengesPhase().'
        );
    }

    for (const key of PlayerKeys) {
        options[key] = { ...options[key] };
        if (phase === 'setup' && options[key].inPlay) {
            throw new Error(
                'setupTest cannot place inPlay cards for the setup phase; place them in the test'
            );
        }
        options[key].inPlay = asArray(options[key].inPlay).map(normaliseInPlaySpec);
    }

    const players = { player1: ctx.player1, player2: ctx.player2 };
    const claims = {};

    for (const key of PlayerKeys) {
        const deck = deckBuilder.buildDeck(
            options[key].faction || DefaultFaction,
            deckCardNames(key, options),
            { strictNames: true }
        );
        players[key].selectDeck(deck);
        claims[key] = new CardClaims(players[key]);
    }

    flow.startGame();
    flow.keepStartingHands();

    const specsByPlayer = {};
    for (const key of PlayerKeys) {
        specsByPlayer[key] = asArray(options[key].inPlay).map(normaliseCardSpec);
    }

    const hosts = placeInPlay(flow.game, claims, specsByPlayer);
    const assigned = arrangeSetupZones(claims, options);
    flow.game.continue();

    if (phase !== 'setup') {
        advanceToPhase(flow, phase, options, players);
    }

    finaliseHiddenZones(claims, assigned);

    for (const { spec, card } of hosts) {
        applyCardState(card, spec);
        for (const attachmentSpec of asArray(spec.attachments).map(normaliseCardSpec)) {
            applyCardState(attachmentSpec.instance, attachmentSpec);
        }
    }

    for (const key of PlayerKeys) {
        applyPlayerState(players[key], options[key]);
    }

    flow.game.refreshGameState();
    flow.game.continue();

    for (const key of PlayerKeys) {
        const player = players[key].player;
        const named = [
            ...hosts.filter((host) => host.key === key).map((host) => host.card),
            ...hosts.flatMap((host) =>
                asArray(host.spec.attachments)
                    .map(normaliseCardSpec)
                    .filter((spec) => (spec.owner || host.key) === key)
                    .map((spec) => spec.instance)
            ),
            ...ZoneKeys.flatMap((zone) => assigned[key][zone] || []),
            ...(player.agendas || []),
            ...[options[key].plot, ...asArray(options[key].plotDeck)]
                .filter(Boolean)
                .map((name) => findOwnedCard(player, name, ['plot deck', 'active plot']))
        ].filter(Boolean);

        for (const card of named) {
            const name = cardReferenceName(card.name);
            if (!(name in registry)) {
                registry[name] = card;
            }
        }
    }
}
