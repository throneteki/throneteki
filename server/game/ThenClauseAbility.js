const BaseAbility = require('./baseability');
const AbilityContext = require('./AbilityContext');

class ThenClauseAbility extends BaseAbility {
    constructor(properties) {
        super(properties);

        this.handler = properties.handler;
    }
    createContext(parentContext) {
        return new AbilityContext({
            game: parentContext.game,
            player: parentContext.player,
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
