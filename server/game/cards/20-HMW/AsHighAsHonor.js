const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AsHighAsHonor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put card into play',
            phase: 'marshal',
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.isFaction('neutral') && card.getPrintedCost() >= 1),
            target: {
                cardCondition: card => card.location === 'hand' && card.controller === this.controller && card.isFaction('neutral') && this.controller.canPutIntoPlay(card)
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to put {2} into play from their hand', context.player, this, context.target);
                this.game.resolveGameAction(
                    GameActions.putIntoPlay(context => ({
                        player: context.player,
                        card: context.target,
                        kneeled: true
                    })),
                    context
                ).thenExecute(() => {
                    if(context.target.hasTrait('House Arryn') && context.target.allowGameAction('stand')) {
                        this.game.addMessage('{0} then uses {1} to stand {2}', context.player, this, context.target);
                        context.target.controller.standCard(context.target);
                    }
                });
            }
        });
    }
}

AsHighAsHonor.code = '20049';

module.exports = AsHighAsHonor;
