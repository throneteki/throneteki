const DrawCard = require('../../drawcard.js');

class HonorBound extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'military',
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.challengeType === 'intrigue',
            effect: [
                ability.effects.cannotBeDeclaredAsAttacker(),
                ability.effects.cannotBeDeclaredAsDefender()
            ]
        });
    }
}

HonorBound.code = '11022';

module.exports = HonorBound;
