import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RooseBolton extends DrawCard {
    // Roose Bolton (25111)
    // Intimidate. Shadow (5).
    // Reaction: After Roose Bolton comes out of shadows during a challenge, kill each participating
    // loyal character.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event, context) =>
                    event.card === context.source && context.game.isDuringChallenge()
            },
            message: '{player} uses {source} to kill each participating loyal character',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .filterCardsInPlay(
                        (card) =>
                            card.getType() === 'character' &&
                            card.isLoyal() &&
                            card.isParticipating()
                    )
                    .map((card) => GameActions.kill({ card }))
            )
        });
    }
}

RooseBolton.code = '25111';

export default RooseBolton;
