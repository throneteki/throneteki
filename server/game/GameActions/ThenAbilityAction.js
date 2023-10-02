const ThenClauseAbility = require('../ThenClauseAbility');

class ThenAbilityAction {
    constructor(preThenAction, abilityPropertiesFactory) {
        this.preThenAction = preThenAction;
        this.abilityPropertiesFactory = typeof(abilityPropertiesFactory) === 'function' ? abilityPropertiesFactory : () => abilityPropertiesFactory;
    }

    message(context) {
        return this.preThenAction.message(context);
    }

    allow(context) {
        return this.preThenAction.allow(context);
    }

    createEvent(context) {
        let event = this.preThenAction.createEvent(context);

        event.thenExecute(event => {
            if(!event.resolved) {
                return;
            }

            let abilityProperties = this.abilityPropertiesFactory(context, event);
            let ability = new ThenClauseAbility(abilityProperties);
            let thenContext = ability.createContext(context, event);

            if(ability.canResolve(thenContext)) {
                thenContext.game.resolveAbility(ability, thenContext);
            }
        });

        return event;
    }

    then(abilityPropertiesFactory) {
        return new ThenAbilityAction(this, abilityPropertiesFactory);
    }
}

module.exports = ThenAbilityAction;
