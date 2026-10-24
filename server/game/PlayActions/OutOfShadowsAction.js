import BaseAbility from '../baseability.js';
import Costs from '../costs.js';
import Message from '../Message.js';
import { Requirements } from '../Constants/index.js';

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

    isRelevant({ game, player, source }) {
        return (
            game.currentPhase !== 'setup' &&
            source.getType() !== 'event' &&
            source.isShadow() &&
            player.isCardInPlayableLocation(source, 'outOfShadows')
        );
    }

    getUnmetRequirement(context) {
        if (!context.source.isShadow() || context.source.getType() === 'event') {
            return Requirements.condition;
        }

        if (!context.player.isCardInPlayableLocation(context.source, 'outOfShadows')) {
            return Requirements.location;
        }

        if (!context.player.canPutIntoPlay(context.source, 'outOfShadows')) {
            return Requirements.restriction;
        }

        return undefined;
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
