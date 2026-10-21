import DrawCard from '../../drawcard.js';

class Fishwhiskers extends DrawCard {
    // Fishwhiskers (03027)
    // While Fishwhiskers is attacking, if there are more Winter plot cards than Summer plot cards
    // revealed, each defending character does not contribute its STR to that challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking() && this.hasMoreWinterThanSummerPlots(),
            targetController: 'any',
            match: (card) => card.isDefending() && card.getType() === 'character',
            effect: ability.effects.doesNotContributeStrength()
        });
    }

    hasMoreWinterThanSummerPlots() {
        return (
            this.game.getNumberOfPlotsWithTrait('Winter') >
            this.game.getNumberOfPlotsWithTrait('Summer')
        );
    }
}

Fishwhiskers.code = '03027';

export default Fishwhiskers;
