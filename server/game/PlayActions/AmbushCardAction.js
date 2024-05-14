const BaseAbility = require('../baseability');
const Costs = require('../costs');

class AmbushCardAction extends BaseAbility {
    constructor() {
        super({
            cost: Costs.payReduceableGoldCost('ambush')
        });
        this.title = 'Ambush';
    }

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        return (
            context.game.currentPhase === 'challenge' &&
            context.source.isAmbush() &&
            context.player.isCardInPlayableLocation(context.source, 'ambush') &&
            context.player.canPutIntoPlay(context.source, 'ambush') &&
            context.source.getType() !== 'event'
        );
    }

    executeHandler(context) {
        if (context.costs.isDupe) {
            context.game.addMessage(
                '{0} ambushes a duplicate of {1} costing {2} gold',
                context.player,
                context.source,
                context.costs.gold
            );
        } else {
            context.game.addMessage(
                '{0} ambushes with {1} costing {2} gold',
                context.player,
                context.source,
                context.costs.gold
            );
        }
        context.player.putIntoPlay(context.source, 'ambush');
    }
}

module.exports = AmbushCardAction;
