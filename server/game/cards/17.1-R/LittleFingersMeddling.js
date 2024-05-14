import PlotCard from '../../plotcard.js';

class LittleFingersMeddling extends PlotCard {
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
