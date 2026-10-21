import DrawCard from '../../drawcard.js';

class EdricStorm extends DrawCard {
    // Edric Storm (26061)
    // Stealth.
    // Each player cannot gain more than 3 power each round (among all cards they control).
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.setMaxPowerGain(3)
        });
    }
}

EdricStorm.code = '26061';

export default EdricStorm;
