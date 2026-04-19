import AgendaRules from './AgendaRules.js';
import DeckWrapper from './DeckWrapper.js';
import Formats from './Formats/index.js';
import LegalityList from './LegalityList.js';

class DeckValidator {
    constructor(packs, format, variant, legality, customRules = {}) {
        const now = Date.now();
        this.releasedPackCodes = new Set(
            packs
                .filter((pack) => pack.releaseDate && Date.parse(pack.releaseDate) <= now)
                .map((pack) => pack.code)
        );
        this.format = format;
        this.variant = variant;
        // 'legality' should be an object, either from an official list or a custom list on an event
        this.legality = legality ? new LegalityList(legality) : undefined;
        this.customRules = customRules;
    }

    validateDeck(rawDeck) {
        const deck = new DeckWrapper(rawDeck);
        const errors = [];

        if (
            (deck.format && this.format !== deck.format) ||
            (deck.variant && this.variant !== deck.variant)
        ) {
            errors.push('Deck cannot be used in this format/variant');
        }

        const rules = this.getRules(deck, this.format);

        if (deck.plotCount < rules.requiredPlots) {
            errors.push('Too few plot cards');
        } else if (deck.plotCount > rules.requiredPlots) {
            errors.push('Too many plot cards');
        }

        if (deck.drawCount < rules.requiredDraw) {
            errors.push('Too few draw cards');
        }

        for (const rule of rules.rules) {
            if (!rule.condition(deck, errors)) {
                errors.push(rule.message);
            }
        }

        const cannotIncludeCards = [];
        for (const card of deck.getCardsIncludedInDeck()) {
            if (!rules.mayInclude(card) || rules.cannotInclude(card)) {
                cannotIncludeCards.push(card.label);
            }
        }
        if (cannotIncludeCards.length > 0) {
            errors.push('Cards not allowed by faction or agenda: ' + cannotIncludeCards.join(', '));
        }

        const unreleasedCards = [];
        for (const card of deck.getUniqueCards()) {
            if (!this.releasedPackCodes.has(card.packCode)) {
                unreleasedCards.push(card.label);
            }
        }
        if (unreleasedCards.length > 0) {
            errors.push('Cards are not yet released: ' + unreleasedCards.join(', '));
        }

        const cardCountByName = deck.getCardCountsByName();
        const doubledPlots = Object.values(cardCountByName).filter(
            (card) => card.type === 'plot' && card.count === 2
        );
        if (doubledPlots.length > rules.maxDoubledPlots) {
            errors.push('Maximum allowed number of doubled plots: ' + rules.maxDoubledPlots);
        }

        for (const card of Object.values(cardCountByName)) {
            if (card.count > card.limit) {
                errors.push(card.name + ' has limit ' + card.limit);
            }
        }

        const legalityResult = this.legality?.validate(deck) ?? {
            valid: true,
            version: ''
        };
        const legalityErrors = legalityResult.errors;

        return {
            basicRules: errors.length === 0,
            valid: legalityResult.valid,
            version: legalityResult.version,
            legality: legalityResult,
            format: this.format,
            variant: this.variant,
            noUnreleasedCards: unreleasedCards.length === 0,
            extendedStatus: errors.concat(legalityErrors)
        };
    }

    getRules(deck, format = 'joust') {
        const formatRules = Formats.find((f) => f.name === format);
        const customizedFormatRules = { ...formatRules, ...this.customRules };
        const factionRules = this.getFactionRules(deck.faction.value.toLowerCase());
        const agendaRules = this.getAgendaRules(deck);

        return this.combineValidationRules(
            [customizedFormatRules, factionRules].concat(agendaRules)
        );
    }

    getFactionRules(faction) {
        return {
            mayInclude: (card) => card.faction === faction || card.faction === 'neutral'
        };
    }

    getAgendaRules(deck) {
        return deck.agendas.map((agenda) => AgendaRules[agenda.code]).filter((a) => !!a);
    }

    combineValidationRules(validators) {
        let mayIncludeFuncs = validators
            .map((validator) => validator.mayInclude)
            .filter((v) => !!v);
        let cannotIncludeFuncs = validators
            .map((validator) => validator.cannotInclude)
            .filter((v) => !!v);
        let combinedRules = validators.reduce(
            (rules, validator) => rules.concat(validator.rules || []),
            []
        );
        let combined = {
            mayInclude: (card) => mayIncludeFuncs.some((func) => func(card)),
            cannotInclude: (card) => cannotIncludeFuncs.some((func) => func(card)),
            rules: combinedRules
        };

        return Object.assign({}, ...validators, combined);
    }

    isDraftCard(card) {
        return card && card.packCode === 'VDS';
    }
}

export default DeckValidator;
