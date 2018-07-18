const DrawCard = require('../../drawcard');

class Moqorro extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: event => event.card === this
            },
            target: {
                cardCondition: card => card.isDefending()
            },
            handler: context => {
                context.target.owner.moveCardToTopOfDeck(context.target);
                this.game.addMessage('{0} uses {1} to move {2} to the top of {3}\'s deck',
                    context.player, this, context.target, context.target.owner);
            }
        });
    }
}

Moqorro.code = '11111';

module.exports = Moqorro;
