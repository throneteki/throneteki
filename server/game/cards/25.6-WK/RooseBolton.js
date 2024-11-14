import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RooseBolton extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this && this.game.isDuringChallenge()
            },
            message: '{player} uses {source} to kill each participating loyal character',
            gameAction: GameActions.simultaneously(() =>
                this.game
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
