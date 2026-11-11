import PlotCard from '../../plotcard.js';

class LittleFingersMeddling extends PlotCard {
    // Littlefinger's Meddling (17155)
    // Reduce the cost of the first event you play each phase by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceFirstPlayedCardCostEachPhase(
                2,
                (card) => card.getType() === 'event'
            )
        });
    }
}

LittleFingersMeddling.code = '17155';

export default LittleFingersMeddling;
