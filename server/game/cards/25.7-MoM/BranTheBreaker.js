const DrawCard = require('../../drawcard.js');

class BranTheBreaker extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attacker: this.controller }),
            match: card => card.getType() === 'character' && card.hasPrintedCost() && card.getPrintedCost() <= this.controller.getClaim(),
            targetController: 'any',
            effect: ability.effects.cannotBeKilled()
        });
    }
}

BranTheBreaker.code = '25569';
BranTheBreaker.version = '1.0';

module.exports = BranTheBreaker;
