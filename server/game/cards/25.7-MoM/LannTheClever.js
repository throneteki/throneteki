const DrawCard = require('../../drawcard.js');

class LannTheClever extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', unique: true });
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ attackingPlayer: this.controller, match: challenge => this.controller.hand.length > challenge.defendingPlayer.hand.length }),
            targetController: 'current',
            effect: ability.effects.choosesIntrigueClaim()
        });
    }
}

LannTheClever.code = '25533';
LannTheClever.version = '1.0';

module.exports = LannTheClever;
