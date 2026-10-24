import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class IShallWinNoGlory extends DrawCard {
    // I Shall Win No Glory (07024)
    // Reaction: After a challenge is initiated against you, kneel 3 Builder characters, 3 Ranger
    // characters, or 3 Steward characters to end the challenge immediately with no winner or loser.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChallengeInitiated: (event, context) =>
                    event.challenge.initiatedAgainstPlayer === context.player
            },
            cost: ability.costs.choose({
                'Kneel Builders': ability.costs.kneelMultiple(
                    3,
                    (card) => card.hasTrait('Builder') && card.getType() === 'character'
                ),
                'Kneel Rangers': ability.costs.kneelMultiple(
                    3,
                    (card) => card.hasTrait('Ranger') && card.getType() === 'character'
                ),
                'Kneel Stewards': ability.costs.kneelMultiple(
                    3,
                    (card) => card.hasTrait('Steward') && card.getType() === 'character'
                )
            }),
            message:
                '{player} plays {source} and kneels {costs.kneel} to end the challenge immediately with no winner or loser',
            gameAction: GameActions.endChallenge((context) => ({
                challenge: context.event.challenge
            }))
        });
    }
}

IShallWinNoGlory.code = '07024';

export default IShallWinNoGlory;
