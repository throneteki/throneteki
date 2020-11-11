const DrawCard = require('../../drawcard');

class OnAMistyMorn extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return characters to hand',
            target: {
                mode: 'upTo',
                numCards: 2,
                cardCondition: card => card.controller === this.controller && card.location === 'dead pile' && card.getType() === 'character' && !card.isUnique()
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to return {2} to hand', context.player, this, context.target);
                for(let card of context.target) {
                    context.player.returnCardToHand(card);
                }
            }
        });
    }
}

OnAMistyMorn.code = '11117';

module.exports = OnAMistyMorn;
