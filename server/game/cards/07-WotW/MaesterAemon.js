import DrawCard from '../../drawcard.js';
import Claim from '../../Claim.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class MaesterAemon extends DrawCard {
    // Maester Aemon (07005)
    // No attachments except Item.
    // Interrupt: When the challenges phase ends, choose an opponent and a challenge type that has
    // not been initiated against you this phase. That player must satisfy the claim of that
    // challenge type as if you were the winning opponent.
    setupCardAbilities() {
        this.tracker = ChallengeTracker.forPhase(this.game);
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' && new Set(defendedChallengeTypes(context)).size < 3
            },
            chooseOpponent: true,
            gameAction: GameActions.chooseChallengeType({
                exclude: (context) => defendedChallengeTypes(context),
                message: '{player} uses {source} to have {opponent} satisfy {challengeType} claim',
                gameAction: (challengeType) =>
                    GameActions.applyClaim((context) => ({
                        player: context.player,
                        claim: createClaim(context, challengeType),
                        game: context.game
                    }))
            })
        });
    }
}

function defendedChallengeTypes(context) {
    return context.source.tracker
        .filter({ defendingPlayer: context.player })
        .map((challenge) => challenge.challengeType);
}

function createClaim(context, challengeType) {
    const claim = new Claim();
    claim.addRecipient(context.opponent);
    claim.challengeType = challengeType;
    claim.value = context.player.getClaim();
    claim.winner = context.player;
    return claim;
}

MaesterAemon.code = '07005';

export default MaesterAemon;
