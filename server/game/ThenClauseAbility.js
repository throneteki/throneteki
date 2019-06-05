const BaseAbility = require('./baseability');
const AbilityContext = require('./AbilityContext');

class ThenClauseAbility extends BaseAbility {
    constructor(properties) {
        super(Object.assign({ abilitySourceType: 'then' }, properties));

        this.player = properties.player;
        this.handler = properties.handler;
    }

    isTriggeredAbility() {
        return false;
    }

    createContext(parentContext) {
        return new AbilityContext({
            game: parentContext.game,
            player: this.player || parentContext.player,
            source: parentContext.source
        });
    }

    meetsRequirements() {
        return true;
    }

    executeHandler(context) {
        this.handler(context);
    }
}

module.exports = ThenClauseAbility;
