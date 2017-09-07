const DrawCard = require('../../../drawcard.js');

class Fishwhiskers extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.isAttacking(this) &&
                this.hasMoreWinterThanSummerPlots()
            ),
            match: card => (
                card.controller !== this.controller &&
                card.getType() === 'character'
            ),
            effect: ability.effects.doesNotContributeStrength()
        });
    }

    hasMoreWinterThanSummerPlots() {
        return this.game.getNumberOfPlotsWithTrait('Winter') > this.game.getNumberOfPlotsWithTrait('Summer');
    }
}

Fishwhiskers.code = '03027';

module.exports = Fishwhiskers;
