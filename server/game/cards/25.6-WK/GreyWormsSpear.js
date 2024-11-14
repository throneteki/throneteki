import DrawCard from '../../drawcard.js';

class GreyWormsSpear extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.name === 'Grey Worm',
            effect: [ability.effects.addIcon('power'), ability.effects.addKeyword('intimidate')]
        });
        this.persistentEffect({
            condition: () => this.parent && this.parent.isAttacking(),
            match: (card) => card.isDefending(),
            targetController: 'any',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

GreyWormsSpear.code = '25114';

export default GreyWormsSpear;
