const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class Moqorro extends DrawCard {
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

module.exports = Moqorro;
