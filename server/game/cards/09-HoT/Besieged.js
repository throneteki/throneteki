import PlotCard from '../../plotcard.js';

class Besieged extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

Besieged.code = '09047';

export default Besieged;
