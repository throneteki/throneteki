import ThenAbilityAction from './ThenAbilityAction.js';

/**
 * Translates the methods of a standard game action to one that will take an
 * ability context => properties factory method.
 */
class AbilityAdapter {
    constructor(action, propertyFactory) {
        this.action = action;
        this.propertyFactory = propertyFactory;
        this.thenExecuteHandlers = [];
        this.eventProperties = new WeakMap();
    }

    message(context) {
        let properties = this.resolveProperties(context);
        return this.action.message(properties);
    }

    resultMessage(context, event) {
        const properties =
            (event && this.eventProperties.get(event)) || this.resolveProperties(context);
        return this.action.resultMessage(properties, event);
    }

    logsOwnMessage() {
        return this.action.logsOwnMessage();
    }

    allow(context) {
        let properties = this.resolveProperties(context);
        return this.action.allow(properties);
    }

    createEvent(context) {
        const properties = this.resolveProperties(context);
        const event = this.action.createEvent(properties);
        if (event && typeof event === 'object') {
            this.eventProperties.set(event, properties);
        }

        for (const handler of this.thenExecuteHandlers) {
            event.thenExecute(handler);
        }

        return event;
    }

    resolveProperties(context) {
        let baseProps =
            typeof this.propertyFactory === 'function'
                ? this.propertyFactory(context)
                : this.propertyFactory;

        return Object.assign({ context: context }, baseProps);
    }

    then(abilityPropertiesFactory) {
        return new ThenAbilityAction(this, abilityPropertiesFactory);
    }

    thenExecute(handler) {
        this.thenExecuteHandlers.push(handler);
        return this;
    }
}

export default AbilityAdapter;
