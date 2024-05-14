import BaseAbility from './baseability.js';
import AbilityContext from './AbilityContext.js';

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

    meetsRequirements(context) {
        return this.condition(context);
    }
}

export default ThenClauseAbility;
