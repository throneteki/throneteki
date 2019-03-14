/**
 * Translates the methods of a standard game action to one that will take an
 * ability context => properties factory method.
 */
class AbilityAdapter {
    constructor(action, propertyFactory) {
        this.action = action;
        this.propertyFactory = propertyFactory;
    }

    allow(context) {
        let properties = this.resolveProperties(context);
        return this.action.allow(properties);
    }

    createEvent(context) {
        let properties = this.resolveProperties(context);
        return this.action.createEvent(properties);
    }

    resolveProperties(context) {
        let baseProps = (typeof this.propertyFactory === 'function') ? this.propertyFactory(context) : this.propertyFactory;

        return Object.assign({ context: context }, baseProps);
    }
}

module.exports = AbilityAdapter;
