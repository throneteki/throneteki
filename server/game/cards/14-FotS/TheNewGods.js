const PlotCard = require('../../plotcard');

class TheNewGods extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.hasTrait('The Seven'),
            condition: () => this.isAttackingInFirstChallenge(),
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    isAttackingInFirstChallenge() {
        let currentChallenge = this.game.currentChallenge;

        return currentChallenge &&
                currentChallenge.attackingPlayer === this.controller &&
                this.controller.getNumberOfChallengesInitiated() === 0;
    }
}

TheNewGods.code = '14052';

module.exports = TheNewGods;
