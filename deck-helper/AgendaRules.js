function hasKeyword(card, keywordRegex) {
    let lines = card.text.split('\n');
    let keywordLine = lines[0] || '';
    let keywords = keywordLine
        .split('.')
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length !== 0);

    return keywords.some((keyword) => keywordRegex.test(keyword));
}

function hasTrait(card, trait) {
    return card.traits.some((t) => t.toLowerCase() === trait.toLowerCase());
}

function rulesForBanner(faction, factionName) {
    return {
        mayInclude: (card) => card.faction === faction && !card.loyal && card.type !== 'plot',
        rules: [
            {
                message: 'Must contain 12 or more ' + factionName + ' cards',
                condition: (deck) => deck.countDrawCards((card) => card.faction === faction) >= 12
            }
        ]
    };
}

/**
 * Validation rule structure is as follows. All fields are optional.
 *
 * requiredDraw  - the minimum amount of cards required for the draw deck.
 * requiredPlots - the exact number of cards required for the plot deck.
 * maxDoubledPlots - the maximum amount of plot cards that can be contained twice in the plot deck.
 * mayInclude    - function that takes a card and returns true if it is allowed in the overall deck.
 * cannotInclude - function that takes a card and return true if it is not allowed in the overall deck.
 * rules         - an array of objects containing a `condition` function that takes a deck and return true if the deck is valid for that rule, and a `message` used for errors when invalid.
 */
const agendaRules = {
    // Banner of the stag
    '01198': rulesForBanner('baratheon', 'Baratheon'),
    // Banner of the kraken
    '01199': rulesForBanner('greyjoy', 'Greyjoy'),
    // Banner of the lion
    '01200': rulesForBanner('lannister', 'Lannister'),
    // Banner of the sun
    '01201': rulesForBanner('martell', 'Martell'),
    // Banner of the watch
    '01202': rulesForBanner('thenightswatch', "Night's Watch"),
    // Banner of the wolf
    '01203': rulesForBanner('stark', 'Stark'),
    // Banner of the dragon
    '01204': rulesForBanner('targaryen', 'Targaryen'),
    // Banner of the rose
    '01205': rulesForBanner('tyrell', 'Tyrell'),
    // Fealty
    '01027': {
        rules: [
            {
                message: 'You cannot include more than 15 neutral cards in a deck with Fealty',
                condition: (deck) => deck.countDrawCards((card) => card.faction === 'neutral') <= 15
            }
        ]
    },
    // Kings of Summer
    '04037': {
        cannotInclude: (card) => card.type === 'plot' && hasTrait(card, 'Winter'),
        rules: [
            {
                message: 'Kings of Summer cannot include Winter plot cards',
                condition: (deck) =>
                    !deck.plotCards.some((cardQuantity) => hasTrait(cardQuantity.card, 'Winter'))
            }
        ]
    },
    // Kings of Winter
    '04038': {
        cannotInclude: (card) => card.type === 'plot' && hasTrait(card, 'Summer'),
        rules: [
            {
                message: 'Kings of Winter cannot include Summer plot cards',
                condition: (deck) =>
                    !deck.plotCards.some((cardQuantity) => hasTrait(cardQuantity.card, 'Summer'))
            }
        ]
    },
    // Rains of Castamere
    '05045': {
        requiredPlots: 12,
        rules: [
            {
                message: 'Rains of Castamere must contain exactly 5 different Scheme plots',
                condition: (deck) => {
                    const isScheme = (card) => hasTrait(card, 'Scheme');
                    let schemePlots = deck.plotCards.filter((cardQuantity) =>
                        isScheme(cardQuantity.card)
                    );
                    return schemePlots.length === 5 && deck.countPlotCards(isScheme) === 5;
                }
            }
        ]
    },
    // Alliance
    '06018': {
        requiredDraw: 75,
        rules: [
            {
                message: 'Alliance cannot have more than 2 Banner agendas',
                condition: (deck) => !deck.bannerCards || deck.bannerCards.length <= 2
            }
        ]
    },
    // The Brotherhood Without Banners
    '06119': {
        cannotInclude: (card) => card.type === 'character' && card.loyal,
        rules: [
            {
                message: 'The Brotherhood Without Banners cannot include loyal characters',
                condition: (deck) =>
                    !deck.drawCards.some(
                        (cardQuantity) =>
                            cardQuantity.card.type === 'character' && cardQuantity.card.loyal
                    )
            }
        ]
    },
    // The Conclave
    '09045': {
        mayInclude: (card) => card.type === 'character' && hasTrait(card, 'Maester') && !card.loyal,
        rules: [
            {
                message: 'Must contain 12 or more Maester characters',
                condition: (deck) =>
                    deck.countDrawCards(
                        (card) => card.type === 'character' && hasTrait(card, 'Maester')
                    ) >= 12
            }
        ]
    },
    // The Wars To Come
    10045: {
        requiredPlots: 10,
        maxDoubledPlots: 2
    },
    // The Free Folk
    11079: {
        cannotInclude: (card) => card.faction !== 'neutral'
    },
    // Kingdom of Shadows
    13079: {
        mayInclude: (card) =>
            !card.loyal && card.type === 'character' && hasKeyword(card, /Shadow \((\d+|X)\)/)
    },
    // The White Book
    13099: {
        mayInclude: (card) =>
            card.type === 'character' && hasTrait(card, 'Kingsguard') && !card.loyal,
        rules: [
            {
                message: 'Must contain 7 or more different Kingsguard characters',
                condition: (deck) => {
                    const kingsguardChars = deck.drawCards.filter(
                        (cardQuantity) =>
                            cardQuantity.card.type === 'character' &&
                            hasTrait(cardQuantity.card, 'Kingsguard')
                    );
                    return kingsguardChars.length >= 7;
                }
            }
        ]
    },
    // Valyrian Steel
    13118: {
        requiredDraw: 75,
        rules: [
            {
                message: 'Cannot include more than 1 copy of each attachment (by title)',
                condition: (deck) => {
                    const allCards = deck.drawCards.concat(deck.plotCards);
                    const attachmentNames = allCards
                        .filter((cardQuantity) => cardQuantity.card.type === 'attachment')
                        .map((cardQuantity) => cardQuantity.card.name);
                    return attachmentNames.every((attachmentName) => {
                        return deck.countCards((card) => card.name === attachmentName) <= 1;
                    });
                }
            }
        ]
    },
    // Dark Wings, Dark Words
    16028: {
        requiredDraw: 75,
        rules: [
            {
                message: 'Cannot include more than 1 copy of each event (by title)',
                condition: (deck) => {
                    const allCards = deck.drawCards.concat(deck.plotCards);
                    const eventNames = allCards
                        .filter((cardQuantity) => cardQuantity.card.type === 'event')
                        .map((cardQuantity) => cardQuantity.card.name);
                    return eventNames.every((eventName) => {
                        return deck.countCards((card) => card.name === eventName) <= 1;
                    });
                }
            }
        ]
    },
    // The Long Voyage
    16030: {
        requiredDraw: 100
    },
    // Kingdom of Shadows (Redesign)
    17148: {
        mayInclude: (card) =>
            !card.loyal && card.type === 'character' && hasKeyword(card, /Shadow \((\d+|X)\)/)
    },
    // Sea of Blood (Redesign)
    17149: {
        cannotInclude: (card) => card.faction === 'neutral' && card.type === 'event'
    },
    // The Free Folk (Redesign)
    17150: {
        mayInclude: (card) =>
            card.faction !== 'neutral' &&
            card.type === 'character' &&
            !card.loyal &&
            hasTrait(card, 'Wildling'),
        rules: [
            {
                message: 'Must only contain neutral cards or Non-loyal Wildling characters',
                condition: function condition(deck) {
                    let drawDeckValid = !deck.drawCards.some(function (cardQuantity) {
                        return (
                            cardQuantity.card.faction !== 'neutral' &&
                            !(
                                cardQuantity.card.type === 'character' &&
                                !cardQuantity.card.loyal &&
                                hasTrait(cardQuantity.card, 'Wildling')
                            )
                        );
                    });
                    let plotDeckValid = !deck.plotCards.some(function (cardQuantity) {
                        return cardQuantity.card.faction !== 'neutral';
                    });
                    return drawDeckValid && plotDeckValid;
                }
            }
        ]
    },
    // The Wars To Come (Redesign)
    17151: {
        requiredPlots: 10,
        maxDoubledPlots: 2
    },
    // Valyrian Steel (Redesign)
    17152: {
        requiredDraw: 75,
        rules: [
            {
                message: 'Cannot include more than 1 copy of each attachment',
                condition: (deck) => {
                    const allCards = deck.drawCards.concat(deck.plotCards);
                    const attachments = allCards.filter(
                        (cardQuantity) => cardQuantity.card.type === 'attachment'
                    );
                    return attachments.every((attachment) => attachment.count <= 1);
                }
            }
        ]
    },
    // A Mummer's Farce
    20051: {
        mayInclude: (card) => card.type === 'character' && hasTrait(card, 'Fool') && !card.loyal
    },
    // The Many-Faced God
    20052: {
        cannotInclude: (card) => card.type === 'plot' && hasTrait(card, 'Kingdom')
    },
    // Battle of the Trident
    21030: {
        requiredPlots: 10,
        rules: [
            {
                message: 'Battle of the Trident must contain exactly 10 Edict, Siege or War plots',
                condition: (deck) => {
                    return deck.plotCards.every(
                        (cardQuantity) =>
                            hasTrait(cardQuantity.card, 'Edict') ||
                            hasTrait(cardQuantity.card, 'Siege') ||
                            hasTrait(cardQuantity.card, 'War')
                    );
                }
            }
        ]
    },
    // Banner of the Falcon
    23040: {
        rules: [
            {
                message: 'Must contain 12 or more House Arryn cards',
                condition: (deck) =>
                    deck.countDrawCards((card) => hasTrait(card, 'House Arryn')) >= 12
            }
        ]
    },
    // The Gift of Mercy
    25080: {
        cannotInclude: (card) => card.type === 'plot' && hasTrait(card, 'Omen')
    },
    // Uniting the Realm
    25120: {
        mayInclude: (card) =>
            !card.loyal && ['attachment', 'character', 'location'].includes(card.type),
        rules: [
            {
                message: 'Cannot contain more than 3 different cards from any faction',
                condition: (deck) => {
                    const factionCounts = new Map();
                    for (const cardQuantity of deck.drawCards) {
                        if (cardQuantity.card.faction !== 'neutral') {
                            let count = factionCounts.get(cardQuantity.card.faction) || 0;
                            factionCounts.set(cardQuantity.card.faction, count + 1);
                        }
                    }
                    return Array.from(factionCounts.values()).every((count) => count <= 3);
                }
            }
        ]
    },
    // The Small Council
    26040: {
        mayInclude: (card) =>
            card.type === 'character' && hasTrait(card, 'Small Council') && !card.loyal,
        rules: [
            {
                message: 'Must contain 7 or more different Small Council characters',
                condition: (deck) =>
                    deck.countDrawCards(
                        (card) => card.type === 'character' && hasTrait(card, 'Small Council')
                    ) >= 7
            }
        ]
    },
    // Trading with Braavos
    26080: {
        mayInclude: (card) => card.type === 'location' && hasTrait(card, 'Warship') && !card.loyal,
        rules: [
            {
                message: 'Cannot include more than 1 copy of each non-limited location',
                condition: (deck) => {
                    const locations = deck.drawCards.filter(
                        (cardQuantity) =>
                            cardQuantity.card.type === 'location' &&
                            !hasKeyword(cardQuantity.card, /Limited/)
                    );
                    return locations.every((location) => location.count <= 1);
                }
            }
        ]
    },
    // Draft Agendas
    // The Power of Wealth
    '00001': {
        mayInclude: () => true,
        rules: [
            {
                message: 'Cannot include cards from more than 1 outside faction',
                condition: (deck) => {
                    let outOfFactionCards = deck.drawCards
                        .concat(deck.plotCards)
                        .filter(
                            (cardQuantity) =>
                                cardQuantity.card.faction !== deck.faction.value &&
                                cardQuantity.card.faction !== 'neutral'
                        );
                    let factions = new Set(
                        outOfFactionCards.map((cardQuantity) => cardQuantity.card.faction)
                    );
                    return factions.size <= 1;
                }
            }
        ]
    },
    // Protectors of the Realm
    '00002': {
        mayInclude: (card) =>
            card.type === 'character' && (hasTrait(card, 'Knight') || hasTrait(card, 'Army'))
    },
    // Treaty
    '00003': {
        mayInclude: () => true,
        rules: [
            {
                message: 'Cannot include cards from more than 2 outside factions',
                condition: (deck) => {
                    let outOfFactionCards = deck.drawCards
                        .concat(deck.plotCards)
                        .filter(
                            (cardQuantity) =>
                                cardQuantity.card.faction !== deck.faction.value &&
                                cardQuantity.card.faction !== 'neutral'
                        );
                    let factions = new Set(
                        outOfFactionCards.map((cardQuantity) => cardQuantity.card.faction)
                    );
                    return factions.size <= 2;
                }
            }
        ]
    },
    // Uniting the Seven Kingdoms
    '00004': {
        mayInclude: (card) => card.type !== 'plot'
    }
};

export default agendaRules;
