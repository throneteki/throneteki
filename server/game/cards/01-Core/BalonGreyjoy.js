import DrawCard from '../../drawcard.js';

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: (card) =>
                card.isDefending() &&
                card.getType() === 'character' &&
                card.getStrength() < this.getStrength(),
            targetController: 'opponent',
            effect: ability.effects.doesNotContributeStrength()
        });
    }
}

BalonGreyjoy.code = '01068';

export default BalonGreyjoy;
