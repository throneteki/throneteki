class SingularTrigger {
    constructor(ability, eventName, listener) {
        this.ability = ability;
        this.eventName = eventName;
        this.condition = listener;
    }

    isTriggeredByContext(context) {
        return context.event.getConcurrentEvents().some((event) => {
            const context = this.ability.createContext(event);
            return this.isTriggeredByEvent(event, context);
        });
    }

    isTriggeredByEvent(event, context) {
        if (this.eventName !== event.name || event.cancelled) {
            return false;
        }

        if (
            event.ability &&
            !!event.ability.cannotBeCanceled &&
            this.ability.eventType === 'cancelinterrupt'
        ) {
            return false;
        }
        return this.condition(event, context);
    }

    eventHandler(event) {
        const context = this.ability.createContext(event);
        if (this.isTriggeredByEvent(event, context)) {
            this.ability.game.registerAbility(this.ability, context);
        }
    }

    createEvent(eventType) {
        return {
            name: `${this.eventName}:${eventType}`,
            handler: (event) => this.eventHandler(event)
        };
    }
}

export default SingularTrigger;
