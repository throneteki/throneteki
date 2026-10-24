import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class GreywaterWatch extends DrawCard {
    // Greywater Watch (19011)
    // Shadow (1).
    // Action: Kneel and return Greywater Watch to shadows and kneel a [stark] character to have it
    // participate in the current challenge on your side. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a character to have it participate',
            phase: 'challenge',
            max: ability.limit.perChallenge(1),
            condition: (context) => context.game.isDuringChallenge(),
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.putSelfIntoShadows(),
                ability.costs.kneel(
                    (card) =>
                        card.getType() === 'character' &&
                        card.isFaction('stark') &&
                        card.canParticipateInChallenge()
                )
            ],
            message: '{player} uses {source} to kneel {costs.kneel} and add them to the challenge',
            gameAction: GameActions.addToChallenge((context) => ({
                card: context.costs.kneel,
                player: context.player
            }))
        });
    }
}

GreywaterWatch.code = '19011';

export default GreywaterWatch;
