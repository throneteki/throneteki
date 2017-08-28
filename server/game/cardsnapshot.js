const _ = require('underscore');

class CardSnapshot {
    constructor(card) {
        this.controller = card.controller;
        this.factions = _.clone(card.factions);
        this.keywords = _.clone(card.keywords);
        this.location = card.location;
        this.parent = card.parent;
        this.power = card.power;
        this.strength = card.getStrength();
        this.tokens = _.clone(card.tokens);
        this.traits = _.clone(card.traits);
        this.type = card.getType();

        this.proxyCardMethods(card);
    }

    proxyCardMethods(card) {
        const proxiedMethods = [
            'getCost', 'getPrintedCost', 'getPrintedFaction', 'getPrintedType',
            'hasPrintedKeyword', 'isLoyal', 'isUnique'
        ];

        proxiedMethods.forEach(method => {
            this[method] = (...args) => {
                card[method](...args);
            };
        });
    }

    getFactions() {
        return _.keys(this.factions);
    }

    getStrength() {
        return this.strength;
    }

    getType() {
        return this.type;
    }

    hasKeyword(keyword) {
        let keywordCount = this.keywords[keyword.toLowerCase()] || 0;
        return keywordCount > 0;
    }

    hasToken(type) {
        return !!this.tokens[type];
    }

    hasTrait(trait) {
        return !!this.traits[trait.toLowerCase()];
    }

    isFaction(faction) {
        let normalizedFaction = faction.toLowerCase();

        if(normalizedFaction === 'neutral') {
            return !!this.factions[normalizedFaction] && _.size(this.factions) === 1;
        }

        return !!this.factions[normalizedFaction];
    }
}

module.exports = CardSnapshot;
