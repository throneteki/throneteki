const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const Array = require('../../../Array');

class Shagwell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('Fool') && card.hasToken(Tokens.gold),
            targetController: 'any',
            effect: ability.effects.dynamicKeywords((card, context) => this.getFoolKeywords(card, context))
        });
    }

    getFoolKeywords(card, context) {
        let cardsWithGold = this.game.filterCardsInPlay(card => card.getType() === 'character' && card.hasToken(Tokens.gold));
        let keywords = [...new Set(Array.flatten(cardsWithGold.map(cwg => this.getKeywordsNotAddedByShagwell(cwg, context))))];

        return keywords;
    }

    getKeywordsNotAddedByShagwell(card, context) {
        let dynamicKeywords = context.dynamicKeywords[card.uuid] || [];
        let effectCount = Array.countAsMap(dynamicKeywords);
        let currentCount = card.keywords.getValues();

        let keywordsNotAddedByShagwell = currentCount.filter(keyword => card.keywords.getCount(keyword) - (effectCount.get(keyword) || 0) > 0);

        return keywordsNotAddedByShagwell;
    }
}

Shagwell.code = '20045';

module.exports = Shagwell;
