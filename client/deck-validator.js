const _ = require('underscore');
const moment = require('moment');

const RestrictedList = require('./RestrictedList');

function getDeckCount(deck) {
    let count = 0;

    _.each(deck, function(card) {
        count += card.count;
    });

    return count;
}

function hasTrait(card, trait) {
    return card.traits.some(t => t.toLowerCase() === trait.toLowerCase());
}

function isCardInReleasedPack(packs, card) {
    let pack = _.find(packs, pack => {
        return card.packCode === pack.code;
    });

    if(!pack) {
        return false;
    }

    let releaseDate = pack.releaseDate;

    if(!releaseDate) {
        return false;
    }

    releaseDate = moment(releaseDate, 'YYYY-MM-DD');
    let now = moment();

    return releaseDate <= now;
}

function rulesForBanner(faction, factionName) {
    return {
        mayInclude: card => card.faction === faction && !card.loyal && card.type !== 'plot',
        rules: [
            {
                message: 'Must contain 12 or more ' + factionName + ' cards',
                condition: deck => getDeckCount(deck.drawCards.filter(cardQuantity => cardQuantity.card.faction === faction)) >= 12
            }
        ]
    };
}

function rulesForDraft(properties) {
    return _.extend({ requiredDraw: 40, requiredPlots: 5 }, properties);
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
    '01202': rulesForBanner('thenightswatch', 'Night\'s Watch'),
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
                condition: deck => getDeckCount(_.filter(deck.drawCards, cardQuantity => cardQuantity.card.faction === 'neutral')) <= 15
            }
        ]
    },
    // Kings of Summer
    '04037': {
        cannotInclude: card => card.type === 'plot' && hasTrait(card, 'Winter'),
        rules: [
            {
                message: 'Kings of Summer cannot include Winter plot cards',
                condition: deck => !_.any(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Winter'))
            }
        ]
    },
    // Kings of Winter
    '04038': {
        cannotInclude: card => card.type === 'plot' && hasTrait(card, 'Summer'),
        rules: [
            {
                message: 'Kings of Winter cannot include Summer plot cards',
                condition: deck => !_.any(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Summer'))
            }
        ]
    },
    // Rains of Castamere
    '05045': {
        requiredPlots: 12,
        rules: [
            {
                message: 'Rains of Castamere must contain exactly 5 different Scheme plots',
                condition: deck => {
                    let schemePlots = _.filter(deck.plotCards, cardQuantity => hasTrait(cardQuantity.card, 'Scheme'));
                    return schemePlots.length === 5 && getDeckCount(schemePlots) === 5;
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
                condition: deck => _.size(deck.bannerCards) <= 2
            }
        ]
    },
    // The Brotherhood Without Banners
    '06119': {
        cannotInclude: card => card.type === 'character' && card.loyal,
        rules: [
            {
                message: 'The Brotherhood Without Banners cannot include loyal characters',
                condition: deck => !_.any(deck.drawCards, cardQuantity => cardQuantity.card.type === 'character' && cardQuantity.card.loyal)
            }
        ]
    },
    // The Conclave
    '09045': {
        mayInclude: card => card.type === 'character' && hasTrait(card, 'Maester') && !card.loyal,
        rules: [
            {
                message: 'Must contain 12 or more Maester characters',
                condition: deck => getDeckCount(deck.drawCards.filter(cardQuantity => cardQuantity.card.type === 'character' && hasTrait(cardQuantity.card, 'Maester'))) >= 12
            }
        ]
    },
    // The Wars To Come
    '10045': {
        requiredPlots: 10,
        maxDoubledPlots: 2
    },
    // Draft Agendas
    // The Power of Wealth
    '00001': rulesForDraft({
        mayInclude: () => true,
        rules: [
            {
                message: 'Cannot include cards from more than 1 outside faction',
                condition: deck => {
                    let outOfFactionCards = _.filter(deck.drawCards.concat(deck.plotCards), cardQuantity => cardQuantity.card.faction !== deck.faction.value && cardQuantity.card.faction !== 'neutral');
                    let factions = _.map(outOfFactionCards, cardQuantity => cardQuantity.card.faction);
                    return _.size(factions) <= 1;
                }
            }
        ]
    }),
    // Protectors of the Realm
    '00002': rulesForDraft({
        mayInclude: card => card.type === 'character' && (hasTrait(card, 'Knight') || hasTrait(card, 'Army'))
    }),
    // Treaty
    '00003': rulesForDraft({
        mayInclude: () => true,
        rules: [
            {
                message: 'Cannot include cards from more than 2 outside factions',
                condition: deck => {
                    let outOfFactionCards = _.filter(deck.drawCards.concat(deck.plotCards), cardQuantity => cardQuantity.card.faction !== deck.faction.value && cardQuantity.card.faction !== 'neutral');
                    let factions = _.map(outOfFactionCards, cardQuantity => cardQuantity.card.faction);
                    return _.size(factions) <= 2;
                }
            }
        ]
    }),
    // Uniting the Seven Kingdoms
    '00004': rulesForDraft({
        mayInclude: card => card.type !== 'plot'
    })
};

class DeckValidator {
    constructor(packs, restrictedListRules) {
        this.packs = packs;
        this.restrictedList = new RestrictedList(restrictedListRules);
    }

    validateDeck(deck) {
        let errors = [];
        let unreleasedCards = [];
        let rules = this.getRules(deck);
        let plotCount = getDeckCount(deck.plotCards);
        let drawCount = getDeckCount(deck.drawCards);

        if(plotCount < rules.requiredPlots) {
            errors.push('Too few plot cards');
        } else if(plotCount > rules.requiredPlots) {
            errors.push('Too many plot cards');
        }

        if(drawCount < rules.requiredDraw) {
            errors.push('Too few draw cards');
        }

        _.each(rules.rules, rule => {
            if(!rule.condition(deck)) {
                errors.push(rule.message);
            }
        });

        let allCards = deck.plotCards.concat(deck.drawCards);
        let cardCountByName = {};

        _.each(allCards, cardQuantity => {
            cardCountByName[cardQuantity.card.name] = cardCountByName[cardQuantity.card.name] || { name: cardQuantity.card.name, type: cardQuantity.card.type, limit: cardQuantity.card.deckLimit, count: 0 };
            cardCountByName[cardQuantity.card.name].count += cardQuantity.count;

            if(!rules.mayInclude(cardQuantity.card) || rules.cannotInclude(cardQuantity.card)) {
                errors.push(cardQuantity.card.label + ' is not allowed by faction or agenda');
            }

            if(!isCardInReleasedPack(this.packs, cardQuantity.card)) {
                unreleasedCards.push(cardQuantity.card.label + ' is not yet released');
            }
        });

        if(deck.agenda && !isCardInReleasedPack(this.packs, deck.agenda)) {
            unreleasedCards.push(deck.agenda.label + ' is not yet released');
        }

        let doubledPlots = _.filter(cardCountByName, card => card.type === 'plot' && card.count === 2);
        if(doubledPlots.length > rules.maxDoubledPlots) {
            errors.push('Maximum allowed number of doubled plots: ' + rules.maxDoubledPlots);
        }

        _.each(cardCountByName, card => {
            if(card.count > card.limit) {
                errors.push(card.name + ' has limit ' + card.limit);
            }
        });

        let restrictedResult = this.restrictedList.validate(allCards.map(cardQuantity => cardQuantity.card));
        let includesDraftCards = this.isDraftCard(deck.agenda) || _.any(allCards, cardQuantity => this.isDraftCard(cardQuantity.card));

        if(includesDraftCards) {
            errors.push('You cannot include Draft cards in a normal deck');
        }

        return {
            basicRules: errors.length === 0,
            faqJoustRules: restrictedResult.validForJoust,
            faqVersion: restrictedResult.version,
            noUnreleasedCards: unreleasedCards.length === 0,
            plotCount: plotCount,
            drawCount: drawCount,
            extendedStatus: errors.concat(unreleasedCards).concat(restrictedResult.errors)
        };
    }

    getRules(deck) {
        const standardRules = {
            requiredDraw: 60,
            requiredPlots: 7,
            maxDoubledPlots: 1
        };
        let factionRules = this.getFactionRules(deck.faction.value.toLowerCase());
        let agendaRules = this.getAgendaRules(deck);
        return this.combineValidationRules([standardRules, factionRules].concat(agendaRules));
    }

    getFactionRules(faction) {
        return {
            mayInclude: card => card.faction === faction || card.faction === 'neutral'
        };
    }

    getAgendaRules(deck) {
        if(!deck.agenda) {
            return [];
        }

        let allAgendas = [deck.agenda].concat(deck.bannerCards || []);
        return _.compact(allAgendas.map(agenda => agendaRules[agenda.code]));
    }

    combineValidationRules(validators) {
        let mayIncludeFuncs = _.compact(_.pluck(validators, 'mayInclude'));
        let cannotIncludeFuncs = _.compact(_.pluck(validators, 'cannotInclude'));
        let combinedRules = _.reduce(validators, (rules, validator) => rules.concat(validator.rules || []), []);
        let combined = {
            mayInclude: card => _.any(mayIncludeFuncs, func => func(card)),
            cannotInclude: card => _.any(cannotIncludeFuncs, func => func(card)),
            rules: combinedRules
        };
        return _.extend({}, ...validators, combined);
    }

    isDraftCard(card) {
        return card && card.packCode === 'VDS';
    }
}

module.exports = function validateDeck(deck, options) {
    options = Object.assign({ includeExtendedStatus: true }, options);

    let validator = new DeckValidator(options.packs, options.restrictedList);
    let result = validator.validateDeck(deck);

    if(!options.includeExtendedStatus) {
        return _.omit(result, 'extendedStatus');
    }

    return result;
};
