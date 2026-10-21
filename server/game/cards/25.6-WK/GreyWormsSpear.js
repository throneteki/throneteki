import DrawCard from '../../drawcard.js';

class GreyWormsSpear extends DrawCard {
    // Grey Worm's Spear (25114)
    // If attached character is Grey Worm, he gains a [power] icon and intimidate.
    // While attached character is attacking, each defending character gets -1 STR.
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
