import DrawCard from '../../drawcard.js';

class WiseMaster extends DrawCard {
    // Wise Master (08073)
    // Bestow (3).
    // Action: Discard 1 gold from Wise Master to return an out-of-faction attachment or event from
    // your discard pile to your hand. (Limit once per round.)
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

export default WiseMaster;
