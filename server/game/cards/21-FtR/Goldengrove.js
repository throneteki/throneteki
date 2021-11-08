const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class Goldengrove extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand and take control',
            limit: ability.limit.perRound(2),
            cost: ability.costs.kneel(card => card === this || (card.hasTrait('Small Council') && card.getType() === 'character')),
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.owner === context.player && (!context.costs.kneel || card.getPrintedCost() <= context.costs.kneel.getPrintedCost())
            },
            message: '{player} uses {source} and kneels {costs.kneel} to stand and take control of {target}',
            handler: context => {
                if(context.target.kneeled) {
                    context.target.controller.standCard(context.target);
                }
                this.game.resolveGameAction(
                    GameActions.takeControl(context => ({
                        player: context.player,
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

Goldengrove.code = '21024';

module.exports = Goldengrove;
