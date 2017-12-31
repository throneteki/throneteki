const DrawCard = require('../../drawcard.js');

class TourneyLance extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.isAttacking(this.parent) &&
                             this.game.currentChallenge.attackers.length === 1,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.setDefenderMaximum(1)
        });
    }
}

TourneyLance.code = '09021';

module.exports = TourneyLance;
