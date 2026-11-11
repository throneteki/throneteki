import PlotCard from '../../plotcard.js';

class SailingTheSummerSea extends PlotCard {
    // Sailing the Summer Sea (08040)
    // You may initiate an additional [power] challenge during the challenges phase. You cannot
    // initiate [military] or [intrigue] challenges.
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

export default SailingTheSummerSea;
