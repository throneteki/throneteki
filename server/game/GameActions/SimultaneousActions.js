import GameAction from './GameAction.js';
import SimultaneousEvents from '../SimultaneousEvents.js';
import NullEvent from '../NullEvent.js';

/**
 * Resolves several game actions at once. Kept separate from SimultaneousAction, which adds `then`,
 * so that abilities can use it without an import cycle through ThenClauseAbility.
 */
class SimultaneousActions extends GameAction {
    constructor(actionFactory) {
        super();
        this.actionFactory = actionFactory;
    }

    message(context) {
        const actions = this.resolveActions(context);
        return actions
            .filter((action) => action.allow(context))
            .map((action) => action.message(context));
    }

    resultMessage(context, event) {
        if (!event || !event.actions) {
            return super.resultMessage(context, event);
        }

        return event.actions
            .map((action, index) => action.resultMessage(context, event.childEvents[index]))
            .filter((message) => !!message && (!Array.isArray(message) || message.length > 0));
    }

    allow(context) {
        const actions = this.resolveActions(context);
        return actions.length > 0 && actions.some((action) => action.allow(context));
    }

    logsOwnMessage() {
        return (
            Array.isArray(this.actionFactory) &&
            this.actionFactory.some((action) => action.logsOwnMessage())
        );
    }

    createEvent(context) {
        let event = new SimultaneousEvents();
        const actions = this.resolveActions(context);
        event.actions = actions;

        for (let action of actions) {
            if (action.allow(context)) {
                event.addChildEvent(action.createEvent(context));
            } else {
                event.addChildEvent(new NullEvent());
            }
        }

        return event;
    }

    resolveActions(context) {
        if (typeof this.actionFactory === 'function') {
            return this.actionFactory(context);
        }

        return this.actionFactory;
    }
}

export default SimultaneousActions;
