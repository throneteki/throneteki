import DrawCard from '../../drawcard.js';
import Claim from '../../Claim.js';
import { ChallengeTracker } from '../../EventTrackers/index.js';
import GameActions from '../../GameActions/index.js';

class CornCornCorn extends DrawCard {
    // Corn, Corn, Corn (20025)
    // Interrupt: When the challenges phase ends, kneel a Steward or Raven card to choose an
    // opponent who does not support you and a challenge type that has not been initiated against
    // you this phase. That player must satisfy the claim of that challenge type as if you were the
    // winning opponent. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.tracker = ChallengeTracker.forPhase(this.game);
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' && new Set(defendedChallengeTypes(context)).size < 3
            },
            max: ability.limit.perPhase(1),
            chooseOpponent: (opponent, context) => !opponent.isSupporter(context.player),
            cost: ability.costs.kneel({ trait: ['Steward', 'Raven'] }),
            gameAction: GameActions.chooseChallengeType({
                exclude: (context) => defendedChallengeTypes(context),
                message: '{player} plays {source} to have {opponent} satisfy {challengeType} claim',
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

CornCornCorn.code = '20025';

export default CornCornCorn;
