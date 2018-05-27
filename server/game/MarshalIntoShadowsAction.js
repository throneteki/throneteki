const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class MarshalIntoShadowsAction extends BaseAbility {
    constructor() {
        super({
            cost: [
                Costs.payReduceableGoldCost('marshalIntoShadows')
            ]
        });
        this.title = 'Marshal into shadows';
    }

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        let {game, player, source} = context;

        return (
            game.currentPhase === 'marshal' &&
            source.isShadow() &&
            player.isCardInPlayableLocation(source, 'marshal')
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} marshals a card into shadows costing {1}', context.player, context.costs.gold);
        context.player.putIntoShadows(context.source);
    }

    isCardAbility() {
        return false;
    }
}

module.exports = MarshalIntoShadowsAction;
