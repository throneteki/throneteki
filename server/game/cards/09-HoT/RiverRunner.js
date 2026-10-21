import DrawCard from '../../drawcard.js';

class RiverRunner extends DrawCard {
    // River Runner (09025)
    // While River Runner is attacking, each character with power cannot be declared as a defender.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetController: 'any',
            match: (card) => card.getType() === 'character' && card.getPower() > 0,
            effect: ability.effects.cannotBeDeclaredAsDefender()
        });
    }
}

RiverRunner.code = '09025';

export default RiverRunner;
