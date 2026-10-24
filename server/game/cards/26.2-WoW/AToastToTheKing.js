import ChallengeTypes from '../../ChallengeTypes.js';
import Claim from '../../Claim.js';
import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class AToastToTheKing extends DrawCard {
    // A Toast to the King (26028)
    // Play only if you control a [martell] Lord or Lady character.
    // Interrupt: When the challenges phase ends, choose an opponent and a challenge type. If that
    // player does not control a character with a challenge icon of that type, they must satisfy the
    // claim of that challenge type as if you were the winning opponent. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, context) =>
                    event.phase === 'challenge' &&
                    context.player.anyCardsInPlay({
                        type: 'character',
                        faction: 'martell',
                        trait: ['Lord', 'Lady']
                    })
            },
            max: ability.limit.perPhase(1),
            chooseOpponent: (opponent) => claimableChallengeTypes(opponent).length > 0,
            gameAction: GameActions.chooseChallengeType({
                message: '{player} plays {source} to have {opponent} satisfy {challengeType} claim',
                gameAction: (challengeType) =>
                    GameActions.ifCondition({
                        condition: (context) =>
                            claimableChallengeTypes(context.opponent).includes(challengeType),
                        thenAction: GameActions.applyClaim((context) => ({
                            player: context.player,
                            claim: createClaim(context, challengeType),
                            game: context.game
                        }))
                    })
            })
        });
    }
}

function claimableChallengeTypes(opponent) {
    return ChallengeTypes.all
        .map(({ value }) => value)
        .filter(
            (icon) =>
                !opponent.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.hasIcon(icon)
                )
        );
}

function createClaim(context, challengeType) {
    const claim = new Claim();
    claim.addRecipient(context.opponent);
    claim.challengeType = challengeType;
    claim.value = context.player.getClaim();
    claim.winner = context.player;
    return claim;
}

AToastToTheKing.code = '26028';

export default AToastToTheKing;
