import AbilityContext from './AbilityContext.js';

class TriggeredAbilityContext extends AbilityContext {
    constructor(properties) {
        super(properties);

        this.event = properties.event;
    }

    cancel() {
        this.event.cancel();
    }

    replaceHandler(handler) {
        this.event.replaceHandler(handler);
    }
}

export default TriggeredAbilityContext;
