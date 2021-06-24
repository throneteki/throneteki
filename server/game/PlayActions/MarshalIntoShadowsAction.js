const BaseAbility = require('../baseability');
const Costs = require('../costs');

class MarshalIntoShadowsAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
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
        let { game, player, source } = context;

        return (
            game.currentPhase === 'marshal' &&
            source.isShadow() &&
            player.allowMarshal &&
            player.isCardInPlayableLocation(source, 'marshalIntoShadows')
        );
    }

    executeHandler(context) {
        let params = {
            card: context.source,
            originalController: context.source.controller,
            originalLocation: context.source.location,
            player: context.player,
            type: 'shadows'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.game.addMessage('{0} marshals a card into shadows costing {1} gold', context.player, context.costs.gold);
            context.player.putIntoShadows(context.source);
        });
    }

    shouldHideSourceInMessage() {
        return true;
    }
}

module.exports = MarshalIntoShadowsAction;
