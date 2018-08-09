const BaseAbility = require('../baseability');
const Costs = require('../costs');

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

    isAction() {
        return true;
    }

    meetsRequirements(context) {
        var { game, player, source } = context;

        return (
            game.currentPhase === 'marshal' &&
            source.getType() !== 'event' &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            player.canPutIntoPlay(source, 'marshal')
        );
    }

    executeHandler(context) {
        let params = {
            card: context.source,
            originalController: context.source.controller,
            originalLocation: context.source.location,
            player: context.player,
            type: context.costs.isDupe ? 'dupe' : 'card'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            if(context.costs.isDupe) {
                context.game.addMessage('{0} duplicates {1} for free', context.player, context.source);
            } else {
                context.game.addMessage('{0} marshals {1} costing {2} gold', context.player, context.source, context.costs.gold);
            }
            context.player.putIntoPlay(context.source, 'marshal');
        });
    }

    isCardAbility() {
        return false;
    }
}

module.exports = MarshalCardAction;
