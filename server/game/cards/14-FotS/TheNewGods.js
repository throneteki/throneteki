const PlotCard = require('../../plotcard');
const { ChallengeTracker } = require('../../EventTrackers');

class TheNewGods extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('The Seven'),
            condition: () => this.isAttackingInFirstChallenge(),
            effect: ability.effects.doesNotKneelAsAttacker()
        });
    }

    isAttackingInFirstChallenge() {
        return !this.tracker.some({ attackingPlayer: this.controller });
    }
}

TheNewGods.code = '14052';

module.exports = TheNewGods;
