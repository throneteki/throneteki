const DrawCard = require('../../drawcard.js');

class TourneyLance extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Knight' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () =>
                this.parent && this.game.isDuringChallenge({ attackingAlone: this.parent }),
            targetController: 'opponent',
            effect: ability.effects.setDefenderMaximum(1)
        });
    }
}

TourneyLance.code = '09021';

module.exports = TourneyLance;
