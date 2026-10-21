import PlotCard from '../../plotcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class GossipAndLies extends PlotCard {
    // Gossip and Lies (05050)
    // Each character you control does not kneel when declared as an attacker in the first
    // [intrigue] challenge you initiate during the challenges phase.
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.persistentEffect({
            match: (card) => card.getType() === 'character',
            condition: () => this.isAttackingInFirstIntrigueChallenge(),
            effect: ability.effects.doesNotKneelAsAttacker({ challengeType: 'intrigue' })
        });
    }

    isAttackingInFirstIntrigueChallenge() {
        return !this.tracker.some({ attackingPlayer: this.controller, challengeType: 'intrigue' });
    }
}

GossipAndLies.code = '05050';

export default GossipAndLies;
