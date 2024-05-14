import PlotCard from '../../plotcard.js';

class Taxation extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

Taxation.code = '01024';

export default Taxation;
