const GameAction = require('./GameAction');
const SimultaneousEvents = require('../SimultaneousEvents');
const ThenAbilityAction = require('./ThenAbilityAction');

class SimultaneousAction extends GameAction {
    constructor(actions) {
        super();
        this.actions = actions;
    }

    allow(props) {
        return this.actions.some(action => action.allow(props));
    }

    createEvent(props) {
        let event = new SimultaneousEvents();
        let actions = this.actions.filter(action => action.allow(props));

        for(let action of actions) {
            event.addChildEvent(action.createEvent(props));
        }

        return event;
    }

    then(abilityPropertiesFactory) {
        return new ThenAbilityAction(this, abilityPropertiesFactory);
    }
}

module.exports = SimultaneousAction;
