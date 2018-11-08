const BaseAbility = require('../baseability');
const Costs = require('../costs');

class OutOfShadowsAction extends BaseAbility {
    constructor() {
        super({
            cost: Costs.payReduceableGoldCost('outOfShadows')
        });
        this.title = 'Bring out of shadows';
    }

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        return (
            context.source.isShadow() &&
            context.player.isCardInPlayableLocation(context.source, 'outOfShadows') &&
            context.player.canPutIntoPlay(context.source, 'outOfShadows') &&
            context.source.getType() !== 'event'
        );
    }

    executeHandler(context) {
        if(context.costs.isDupe) {
            context.game.addMessage('{0} duplicates {1} costing {2} gold', context.player, context.source, context.costs.gold);
        } else {
            context.game.addMessage('{0} brings {1} out of shadows costing {2} gold', context.player, context.source, context.costs.gold);
        }
        context.player.putIntoPlay(context.source, 'outOfShadows');
    }
}

module.exports = OutOfShadowsAction;
