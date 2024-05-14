const DrawCard = require('../../drawcard.js');

class DanceOfTheDragons extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return card to hand',
            target: {
                cardCondition: (card) =>
                    card.controller === this.controller &&
                    card.location === 'discard pile' &&
                    card.getType() !== 'event' &&
                    card.getPrintedCost() <= 3
            },
            message: '{player} plays {source} to return {target} to their hand',
            handler: (context) => {
                context.player.returnCardToHand(context.target);
            }
        });
    }
}

DanceOfTheDragons.code = '12036';

module.exports = DanceOfTheDragons;
