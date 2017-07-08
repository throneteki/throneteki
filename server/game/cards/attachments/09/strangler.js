const DrawCard = require('../../../drawcard.js');

class Strangler extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isParticipating(this.parent),
            effect: ability.effects.setStrength(1)
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Strangler.code = '09043';

module.exports = Strangler;
