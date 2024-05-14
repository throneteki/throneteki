import BaseAbility from '../baseability.js';
import Costs from '../costs.js';

class MarshalCardAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game',
            cost: [Costs.payReduceableGoldCost('marshal'), Costs.playLimited()]
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
            player.allowMarshal &&
            player.isCardInPlayableLocation(source, 'marshal') &&
            !player.canDuplicate(source) &&
            player.canPutIntoPlay(source, 'marshal')
        );
    }

    executeHandler(context) {
        let params = {
            card: context.source,
            originalController: context.source.controller,
            originalLocation: context.source.location,
            originalParent: context.source.parent,
            wasFacedownAttachment:
                context.source.facedown && context.source.getType() === 'attachment',
            player: context.player,
            type: 'card'
        };
        context.game.raiseEvent('onCardMarshalled', params, () => {
            context.player.putIntoPlay(context.source, 'marshal');
            context.game.addMessage(
                this.getMessageFormat(params),
                context.player,
                context.source,
                params.originalController,
                params.originalLocation,
                params.originalParent,
                context.costs.gold
            );
        });
    }

    getMessageFormat(params) {
        const messages = {
            'hand.current': '{0} marshals {1} costing {5} gold',
            'other.current': '{0} marshals {1} from their {3} costing {5} gold',
            'other.opponent': "{0} marshals {1} from {2}'s {3} costing {5} gold",
            'underneath.current': '{0} marshals {1} from underneath {4} costing {5} gold',
            'underneath.opponent': "{0} marshals {1} from underneath {2}'s {4} costing {5} gold"
        };
        let marshalLocation =
            params.originalLocation === 'hand'
                ? 'hand'
                : params.originalLocation === 'underneath' || params.wasFacedownAttachment
                  ? 'underneath'
                  : 'other';
        let current = params.originalController === params.player ? 'current' : 'opponent';
        return messages[`${marshalLocation}.${current}`] || messages['hand.current'];
    }
}

export default MarshalCardAction;
