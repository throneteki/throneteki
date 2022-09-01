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
            originalParent: context.source.parent,
            wasFacedownAttachment: context.source.facedown && context.source.getType() === 'attachment',
            player: context.player,
            type: 'shadows'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.player.putIntoShadows(context.source);
            context.game.queueSimpleStep(() => context.game.addMessage(this.getMessageFormat(params), context.player, params.originalLocation, params.originalParent, context.costs.gold));
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand': '{0} marshals a card into shadows costing {3} gold',
            'underneath': '{0} marshals a card from underneath {2} into shadows costing {3} gold',
            'other': '{0} marshals a card from their {1} into shadows costing {3} gold'
        };
        let marshalLocation = params.originalLocation === 'hand' ? 'hand' : params.originalLocation === 'underneath' || params.wasFacedownAttachment ? 'underneath' : 'other';
        return messages[marshalLocation] || messages['hand'];
    }

    shouldHideSourceInMessage() {
        return true;
    }
}

module.exports = MarshalIntoShadowsAction;
