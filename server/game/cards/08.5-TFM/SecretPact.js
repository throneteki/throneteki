const DrawCard = require('../../drawcard.js');

class SecretPact extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction(card => card.getType() === 'character' && !card.isFaction('martell'));
        this.whileAttached({
            effect: ability.effects.addKeyword('Renown')
        });
        this.whileAttached({
            condition: () => this.game.isDuringChallenge({ defendingPlayer: this.controller }),
            effect: ability.effects.cannotBeDeclaredAsAttacker()
        });
    }
}

SecretPact.code = '08096';

module.exports = SecretPact;
