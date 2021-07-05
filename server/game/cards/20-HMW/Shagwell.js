const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const {flatten} = require('../../../Array');

class Shagwell extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('Fool') && card.hasToken(Tokens.gold),
            targetController: 'any',
            effect: ability.effects.dynamicKeywords(() => this.getFoolKeywords())
        });
    }

    getFoolKeywords() {
        let cardsWithGold = this.game.filterCardsInPlay(card => card.getType() === 'character' && card.hasToken(Tokens.gold));
        let keywordsOfCardsWithGold = [...new Set(flatten(cardsWithGold.map(card => card.getKeywords())))];
        return keywordsOfCardsWithGold;
    }
}

Shagwell.code = '20045';

module.exports = Shagwell;
