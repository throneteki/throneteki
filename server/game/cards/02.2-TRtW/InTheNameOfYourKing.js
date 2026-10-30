import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class InTheNameOfYourKing extends DrawCard {
    // In the Name of Your King! (02028)
    // Play only during a [military] challenge in which you are the defending player.
    // Action: Kneel your faction card to end this challenge with no winner or loser. Until the end
    // of the phase, you cannot initiate [military] challenges.
    setupCardAbilities(ability) {
        this.action({
            title: 'End challenge',
            condition: (context) =>
                context.game.isDuringChallenge({
                    challengeType: 'military',
                    defendingPlayer: context.player
                }),
            cost: ability.costs.kneelFactionCard(),
            message: '{player} plays {source} to end this challenge with no winner or loser',
            gameAction: GameActions.simultaneously([
                GameActions.endChallenge((context) => ({
                    challenge: context.game.currentChallenge
                })),
                GameActions.lastingEffect(() => ({
                    duration: 'untilEndOfPhase',
                    targetController: 'current',
                    effect: ability.effects.cannotInitiateChallengeType('military')
                }))
            ])
        });
    }
}

InTheNameOfYourKing.code = '02028';

export default InTheNameOfYourKing;
