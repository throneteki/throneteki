import DrawCard from '../../drawcard.js';

class SerArysOakheart extends DrawCard {
    // Ser Arys Oakheart (25047)
    // Renown.
    // While Ser Arys Oakheart is attacking, at least 1 character must be declared as a defender, if
    // able.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            effect: ability.effects.setDefenderMinimum(1)
        });
    }
}

SerArysOakheart.code = '25047';

export default SerArysOakheart;
