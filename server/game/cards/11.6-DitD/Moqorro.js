import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Moqorro extends DrawCard {
    // Moqorro (11111)
    // Shadow (5).
    // Reaction: After Moqorro comes out of shadows during a challenge, choose a defending character
    // and place it on top of its owner's deck.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.isDefending() && GameActions.returnCardToDeck({ card }).allow()
            },
            message: "{player} uses {source} to place {target} on top of its owner's deck",
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

Moqorro.code = '11111';

export default Moqorro;
