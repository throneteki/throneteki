import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';

function hasInitiatedMilitaryChallenge(tracker, player, opponent) {
    return tracker.some({
        attackingPlayer: opponent,
        defendingPlayer: player,
        challengeType: 'military'
    });
}

class BridgeOfSkulls extends DrawCard {
    // Bridge of Skulls (05032)
    // Interrupt: When the challenges phase ends, choose an opponent who did not initiate a military
    // challenge against you this phase. That player discards one card at random from his or her
    // hand.
    setupCardAbilities() {
        const tracker = ChallengeTracker.forPhase(this.game);

        this.interrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            chooseOpponent: (player, context) =>
                !hasInitiatedMilitaryChallenge(tracker, context.player, player),
            message: {
                format: "{player} uses {source} to discard 1 card at random from {opponent}'s hand",
                args: { opponent: (context) => context.opponent }
            },
            gameAction: GameActions.discardAtRandom((context) => ({
                player: context.opponent,
                amount: 1
            }))
        });
    }
}

BridgeOfSkulls.code = '05032';

export default BridgeOfSkulls;
