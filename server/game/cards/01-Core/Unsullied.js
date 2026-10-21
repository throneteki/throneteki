import DrawCard from '../../drawcard.js';

class Unsullied extends DrawCard {
    // Unsullied (01171)
    // No attachments except Weapon.
    // While Unsullied is attacking, each defending character gets -1 STR.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking(),
            match: (card) => card.isDefending(),
            targetController: 'opponent',
            effect: ability.effects.modifyStrength(-1)
        });
    }
}

Unsullied.code = '01171';

export default Unsullied;
