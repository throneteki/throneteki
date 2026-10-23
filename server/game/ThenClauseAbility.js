import BaseAbility from './baseability.js';
import AbilityContext from './AbilityContext.js';
import { Requirements } from './Constants/index.js';

class ThenClauseAbility extends BaseAbility {
    constructor(properties) {
        super(Object.assign({ abilitySourceType: 'then' }, properties));

        this.player = properties.player;
        this.condition = properties.condition || (() => true);
    }

    isTriggeredAbility() {
        return false;
    }

    createContext(parentContext, event) {
        let context = new AbilityContext({
            ability: this,
            game: parentContext.game,
            player: this.player || parentContext.player,
            source: parentContext.source
        });
        context.event = event;
        context.parentContext = parentContext;
        return context;
    }

    executeHandler(context) {
        // Constant effects update as soon as the first part of the ability resolves, so the then
        // clause must see them, such as a keyword a card gains while it has gold.
        context.game.refreshGameState();
        super.executeHandler(context);
    }

    getUnmetRequirement(context) {
        return this.condition(context) ? undefined : Requirements.condition;
    }
}

export default ThenClauseAbility;
