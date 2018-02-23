const DrawCard = require('../../drawcard.js');

class Mhysa extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.whileAttached({
            condition: () =>
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'power' &&
                this.controller.getNumberOfChallengesInitiatedByType('power') === 0,
            effect: [
                ability.effects.doesNotKneelAsAttacker(),
                ability.effects.dynamicStrength(() => this.game.currentChallenge.attackers.length)
            ]
        });
    }
}

Mhysa.code = '08094';

module.exports = Mhysa;
