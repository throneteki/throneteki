const GameAction = require('./GameAction');
const SimultaneousEvents = require('../SimultaneousEvents');
const ThenAbilityAction = require('./ThenAbilityAction');
const NullEvent = require('../NullEvent');

class SimultaneousAction extends GameAction {
    constructor(actionFactory) {
        super();
        this.actionFactory = actionFactory;
    }

    message(context) {
        const actions = this.resolveActions(context);
        return actions.filter(action => action.allow(context)).map(action => action.message(context));
    }

    allow(context) {
        const actions = this.resolveActions(context);
        return actions.length > 0 && actions.some(action => action.allow(context));
    }

    createEvent(context) {
        let event = new SimultaneousEvents();
        const actions = this.resolveActions(context);

        for(let action of actions) {
            if(action.allow(context)) {
                event.addChildEvent(action.createEvent(context));
            } else {
                event.addChildEvent(new NullEvent());
            }
        }

        return event;
    }

    then(abilityPropertiesFactory) {
        return new ThenAbilityAction(this, abilityPropertiesFactory);
    }

    resolveActions(context) {
        if(typeof this.actionFactory === 'function') {
            return this.actionFactory(context);
        }

        return this.actionFactory;
    }
}

module.exports = SimultaneousAction;
