import PlotCard from '../../plotcard.js';

class RoyalDecree extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayInitiateAdditionalChallenge('power')
        });
    }
}

RoyalDecree.code = '00378';

export default RoyalDecree;
