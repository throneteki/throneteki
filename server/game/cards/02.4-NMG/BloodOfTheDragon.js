import PlotCard from '../../plotcard.js';

class BloodOfTheDragon extends PlotCard {
    // Blood of the Dragon (02075)
    // Each non-Dragon character gets -1 STR and is killed if its STR is 0.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && !card.hasTrait('Dragon'),
            targetController: 'any',
            effect: ability.effects.killByStrength(-1)
        });
    }
}

BloodOfTheDragon.code = '02075';

export default BloodOfTheDragon;
