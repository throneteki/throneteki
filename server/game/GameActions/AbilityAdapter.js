const ThenAbilityAction = require('./ThenAbilityAction');

/**
 * Translates the methods of a standard game action to one that will take an
 * ability context => properties factory method.
 */
class AbilityAdapter {
    constructor(action, propertyFactory) {
        this.action = action;
        this.propertyFactory = propertyFactory;
        this.thenExecuteHandlers = [];
    }

    message(context) {
        let properties = this.resolveProperties(context);
        return this.action.message(properties);
    }

    allow(context) {
        let properties = this.resolveProperties(context);
        return this.action.allow(properties);
    }

    createEvent(context) {
        const properties = this.resolveProperties(context);
        const event = this.action.createEvent(properties);

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

module.exports = AbilityAdapter;
