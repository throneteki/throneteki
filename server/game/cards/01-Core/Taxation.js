import PlotCard from '../../plotcard.js';

class Taxation extends PlotCard {
    // Taxation (01024)
    // You may marshal or play 1 additional limited card this round.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyMaxLimited(1)
        });
    }
}

Taxation.code = '01024';

export default Taxation;
