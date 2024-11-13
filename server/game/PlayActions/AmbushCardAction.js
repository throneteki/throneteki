import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import Message from '../Message.js';

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
        let params = {
            card: context.source,
            originalController: context.source.controller,
            originalLocation: context.source.location,
            originalParent: context.source.parent,
            wasFacedownAttachment:
                context.source.facedown && context.source.getType() === 'attachment',
            player: context.player
        };
        const card = context.costs.isDupe
            ? Message.fragment('a duplicate of {card}', { card: context.source })
            : context.source;
        context.game.addMessage(
            this.getMessageFormat(params),
            context.player,
            card,
            params.originalController,
            params.originalLocation,
            params.originalParent,
            context.costs.gold
        );
        context.player.putIntoPlay(context.source, 'ambush');
    }

    getMessageFormat(params) {
        const messages = {
            'hand.current': '{0} ambushes {1} costing {5} gold',
            'other.current': '{0} ambushes {1} from their {3} costing {5} gold',
            'other.opponent': "{0} ambushes {1} from {2}'s {3} costing {5} gold",
            'underneath.current': '{0} ambushes {1} from underneath {4} costing {5} gold',
            'underneath.opponent': "{0} ambushes {1} from underneath {2}'s {4} costing {5} gold"
        };
        let ambushLocation =
            params.originalLocation === 'hand'
                ? 'hand'
                : params.originalLocation === 'underneath' || params.wasFacedownAttachment
                  ? 'underneath'
                  : 'other';
        let current = params.originalController === params.player ? 'current' : 'opponent';
        return messages[`${ambushLocation}.${current}`] || messages['hand.current'];
    }
}

export default AmbushCardAction;
