const GameAction = require('./GameAction');
const SimultaneousEvents = require('../SimultaneousEvents');

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
}

module.exports = SimultaneousAction;
