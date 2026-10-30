import BaseAbility from '../baseability.js';
import { Requirements } from '../Constants/index.js';

class SetupCardAction extends BaseAbility {
    constructor() {
        super({
            abilitySourceType: 'game'
        });
        this.title = 'Setup';
    }

    isRelevant({ game, player, source }) {
        return (
            game.currentPhase === 'setup' &&
            source.getType() !== 'event' &&
            player.hand.includes(source)
        );
    }

    getUnmetRequirement(context) {
        if (context.game.currentPhase !== 'setup') {
            return Requirements.phase;
        }

        if (!context.player.readyToStart || context.player.setup) {
            return Requirements.player;
        }

        if (context.source.getType() === 'event') {
            return Requirements.condition;
        }

        if (!context.player.hand.includes(context.source)) {
            return Requirements.location;
        }

        const placement = context.player.getSetupPlacement({ inPlay: [context.source] });
        if (
            placement.cost > context.player.setupGold ||
            placement.limited > context.player.maxLimited
        ) {
            return Requirements.cost;
        }

        return undefined;
    }

    executeHandler(context) {
        context.player.putIntoPlay(context.source, 'setup');
    }
}

export default SetupCardAction;
