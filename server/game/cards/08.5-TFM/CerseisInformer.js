const DrawCard = require('../../drawcard.js');

class CerseisInformer extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw card',
            limit: ability.limit.perRound(1),
            condition: () => this.controller.canDraw(),
            cost: ability.costs.moveTokenFromSelf('gold', 1, (card) =>
                this.destinationCondition(card)
            ),
            handler: (context) => {
                context.player.drawCardsToHand(1);
                this.game.addMessage(
                    '{0} moves 1 gold from {1} to {2} to draw 1 card',
                    context.player,
                    this,
                    context.costs.moveTokenFromSelf
                );

                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a card',
                    source: this,
                    cardCondition: (card) =>
                        card.location === 'hand' && card.controller === context.player,
                    onSelect: (player, card) => this.cardSelected(player, card)
                });
            }
        });
    }

    cardSelected(player, card) {
        player.discardCard(card);
        this.game.addMessage('{0} then discards {1} for {2}', player, card, this);
        return true;
    }

    destinationCondition(card) {
        return (
            !card.hasTrait('Spy') &&
            card.location === 'play area' &&
            card.controller === this.controller
        );
    }
}

CerseisInformer.code = '08089';

module.exports = CerseisInformer;
