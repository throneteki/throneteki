import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class QuaitheOfTheShadow extends DrawCard {
    // Quaithe of the Shadow (04113)
    // Ambush (3).
    // Reaction: After Quaithe of the Shadow enters play during a challenge, remove each character
    // with STR 2 or lower from the challenge.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source &&
                    context.game.isDuringChallenge() &&
                    context.game.currentPhase === 'challenge'
            },
            message:
                '{player} uses {source} to remove all characters with STR 2 or lower from the challenge',
            gameAction: GameActions.simultaneously((context) =>
                context.game.currentChallenge
                    .getParticipants()
                    .filter((card) => card.getStrength() <= 2)
                    .map((card) => GameActions.removeFromChallenge({ card }))
            )
        });
    }
}

QuaitheOfTheShadow.code = '04113';

export default QuaitheOfTheShadow;
