const PlotCard = require('../../plotcard.js');

class SailingTheSummerSea extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            effect: [
                ability.effects.modifyChallengeTypeLimit('power', 1),
                ability.effects.cannotInitiateChallengeType('military'),
                ability.effects.cannotInitiateChallengeType('intrigue')
            ]
        });
    }
}

SailingTheSummerSea.code = '08040';

module.exports = SailingTheSummerSea;
