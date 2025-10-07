import DrawCard from '../../drawcard.js';

class EdricStorm extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.setMaxPowerGain(3)
        });
    }
}

EdricStorm.code = '26061';

export default EdricStorm;
