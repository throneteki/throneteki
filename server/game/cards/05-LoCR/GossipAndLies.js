const PlotCard = require('../../plotcard');
const {ChallengeTracker} = require('../../EventTrackers');

class GossipAndLies extends PlotCard {
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            match: card => card.getType() === 'character',
            condition: () => this.isAttackingInFirstIntrigueChallenge(),
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'intrigue' })
        });
    }

    isAttackingInFirstIntrigueChallenge() {
        return !this.tracker.some({ attackingPlayer: this.controller, challengeType: 'intrigue' });
    }
}

GossipAndLies.code = '05050';

module.exports = GossipAndLies;
