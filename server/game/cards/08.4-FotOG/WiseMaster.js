const DrawCard = require('../../drawcard.js');

class WiseMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return attachment/event to hand',
            limit: ability.limit.perRound(1),
            cost: ability.costs.discardGold(),
            target: {
                type: 'select',
                activePromptTitle: 'Select an attachment or event',
                cardCondition: (card) =>
                    card.location === 'discard pile' &&
                    card.controller === this.controller &&
                    ['attachment', 'event'].includes(card.getType()) &&
                    card.isOutOfFaction()
            },
            handler: (context) => {
                context.target.owner.returnCardToHand(context.target);
                this.game.addMessage(
                    '{0} discards 1 gold from {1} to return {2} to their hand from their discard pile',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

WiseMaster.code = '08073';

module.exports = WiseMaster;
