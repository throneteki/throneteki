import PlotCard from '../../plotcard.js';

class LittleFingersMeddling extends PlotCard {
    // Littlefinger's Meddling (05049)
    // Reduce the cost of each event you play by 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            effect: ability.effects.reduceCost({
                playingTypes: 'play',
                amount: 2,
                match: (card) => card.getType() === 'event'
            })
        });
    }
}

LittleFingersMeddling.code = '05049';

export default LittleFingersMeddling;
