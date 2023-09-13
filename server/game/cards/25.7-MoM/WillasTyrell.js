const DrawCard = require('../../drawcard.js');

class WillasTyrell extends DrawCard {    
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => this.game.isDuringChallenge({ attackingAlone: card }) || this.game.isDuringChallenge({ defendingAlone: card })),
            effect: ability.effects.contributeCharacterStrength(this)
        });
    }
}

WillasTyrell.code = '25586';
WillasTyrell.version = '1.0';

module.exports = WillasTyrell;