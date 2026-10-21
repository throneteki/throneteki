import DrawCard from '../../drawcard.js';

class BalonGreyjoy extends DrawCard {
    // Balon Greyjoy (01068)
    // Renown.
    // While Balon Greyjoy is attacking, each defending character with a lower STR than his does not
    // contribute its STR to that challenge.
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
