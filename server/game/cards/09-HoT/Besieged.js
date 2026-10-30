import PlotCard from '../../plotcard.js';

class Besieged extends PlotCard {
    // Besieged (09047)
    // At least one character must be declared as a defender in each challenge, if able.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

Besieged.code = '09047';

export default Besieged;
