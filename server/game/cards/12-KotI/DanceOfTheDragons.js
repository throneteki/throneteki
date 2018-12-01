const DrawCard = require('../../drawcard.js');

class DanceOfTheDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return card to hand',
            target: {
                cardCondition: card => card.controller === this.controller && card.location === 'discard pile' && card.getType() !== 'event' && card.getPrintedCost() <= 3
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to return {2} to their hand', context.player, this, context.target);
                context.player.returnCardToHand(context.target);
            }
        });
    }
}

DanceOfTheDragons.code = '12036';

module.exports = DanceOfTheDragons;
