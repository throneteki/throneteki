import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

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
                cardCondition: (card, context) =>
                    card.location === 'discard pile' &&
                    card.controller === context.source.controller &&
                    ['attachment', 'event'].includes(card.getType()) &&
                    card.isOutOfFaction()
            },
            message:
                '{player} discards 1 gold from {source} to return {target} to their hand from their discard pile',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.target }))
        });
    }
}

WiseMaster.code = '08073';

export default WiseMaster;
