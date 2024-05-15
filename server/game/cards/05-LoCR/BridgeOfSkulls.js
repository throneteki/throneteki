import DrawCard from '../../drawcard.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

class BridgeOfSkulls extends DrawCard {
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            chooseOpponent: (player) => !this.hasInitiatedMilitaryChallenge(player),
            handler: (context) => {
                let opponent = context.opponent;

                opponent.discardAtRandom(1);

                this.game.addMessage(
                    "{0} uses {1} to discard 1 card at random from {2}'s hand",
                    this.controller,
                    this,
                    opponent
                );
            }
        });
    }

    hasInitiatedMilitaryChallenge(opponent) {
        return this.tracker.some({
            attackingPlayer: opponent,
            defendingPlayer: this.controller,
            challengeType: 'military'
        });
    }
}

BridgeOfSkulls.code = '05032';

export default BridgeOfSkulls;
