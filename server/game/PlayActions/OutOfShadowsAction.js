import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import Message from '../Message.js';

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
        const card = context.costs.isDupe
            ? Message.fragment('a duplicate of {card}', { card: context.source })
            : context.source;
        const position = context.source.getShadowPosition();
        context.game.addMessage(
            '{0} brings {1} out of shadows (card #{2}) costing {3} gold',
            context.player,
            card,
            position,
            context.costs.gold
        );
        context.player.putIntoPlay(context.source, 'outOfShadows', { xValue: context.xValue });
    }
}

export default OutOfShadowsAction;
