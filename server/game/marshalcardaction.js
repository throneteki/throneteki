const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class MarshalCardAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('marshal'),
                Costs.playLimited()
            ]
        });
        this.title = 'Marshal';
    }

    meetsRequirements(context) {
        var {game, player, source} = context;

        return (
            game.currentPhase === 'marshal' &&
            source.canBeMarshaled() &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            player.canPutIntoPlay(source)
        );
    }

    executeHandler(context) {
        context.player.putIntoPlay(context.source, 'marshal');

        context.game.queueSimpleStep(() => {
            if(context.costs.isDupe) {
                context.game.addMessage('{0} duplicates {1} for free', context.player, context.source);
            } else if(context.source.getType() === 'attachment') {
                context.game.addMessage('{0} marshals {1} on {2} costing {3}', context.player, context.source, context.source.parent, context.costs.gold);
            } else {
                context.game.addMessage('{0} marshals {1} costing {2}', context.player, context.source, context.costs.gold);
            }            
        });
    }

    isCardAbility() {
        return false;
    }
}

module.exports = MarshalCardAction;
