const BaseAbility = require('./baseability');
const AbilityContext = require('./AbilityContext');

class ThenClauseAbility extends BaseAbility {
    constructor(properties) {
        super(Object.assign({ abilitySourceType: 'then' }, properties));

        this.player = properties.player;
        this.handler = properties.handler;
        this.condition = properties.condition || (() => true);
    }

    isTriggeredAbility() {
        return false;
    }

    createContext(parentContext) {
        let context = new AbilityContext({
            ability: this,
            game: parentContext.game,
            player: this.player || parentContext.player,
            source: parentContext.source
        });
        context.parentContext = parentContext;
        return context;
    }

    meetsRequirements(context) {
        return this.condition(context);
    }

    executeHandler(context) {
        this.handler(context);
    }
}

module.exports = ThenClauseAbility;
