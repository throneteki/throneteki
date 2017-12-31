const DrawCard = require('../../drawcard.js');

class DrogosArakh extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Dothraki' });
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });
        this.whileAttached({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military' &&
                this.controller.getNumberOfChallengesInitiatedByType('military') === 0
            ),
            match: card => card.name === 'Khal Drogo',
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }
}

DrogosArakh.code = '01172';

module.exports = DrogosArakh;
