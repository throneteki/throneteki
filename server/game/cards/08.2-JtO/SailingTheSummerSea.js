const PlotCard = require('../../plotcard.js');

class SailingTheSummerSea extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: [
                ability.effects.mayInitiateAdditionalChallenge('power'),
                ability.effects.cannotInitiateChallengeType('military'),
                ability.effects.cannotInitiateChallengeType('intrigue')
            ]
        });
    }
}

SailingTheSummerSea.code = '08040';

module.exports = SailingTheSummerSea;
