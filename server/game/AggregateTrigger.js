import uuid from 'uuid';
import Event from './event.js';

class AggregateTrigger {
    constructor(ability, eventName, listener) {
        this.uuid = uuid.v1();
        this.ability = ability;
        this.eventName = eventName;
        this.aggregateBy = listener.aggregateBy;
        this.condition = listener.condition;
    }

    createAggregateGroups(event) {
        return event.getConcurrentEvents().reduce((aggregateGroups, event) => {
            if (event.name === this.eventName && !event.cancelled) {
                const tempContext = this.ability.createContext(event);
                const aggregate = this.aggregateBy(event, tempContext);

                const keys = Object.keys(aggregate);
                const existingGroup = aggregateGroups.find((a) =>
                    keys.every((k) => aggregate[k] === a.aggregate[k])
                );
                if (existingGroup) {
                    existingGroup.events.push(event);
                } else {
                    aggregateGroups.push({ aggregate, events: [event] });
                }
            }
            return aggregateGroups;
        }, []);
    }

    isTriggeredByContext(context) {
        const event = context.event;
        if (!event.name.includes(':aggregate') || event.cancelled) {
            return false;
        }

        if (
            event.ability &&
            !!event.ability.cannotBeCanceled &&
            this.ability.eventType === 'cancelinterrupt'
        ) {
            return false;
        }

        return this.condition(event.aggregate, event.events, context);
    }

    createContext(event) {
        const context = this.ability.createContext(event);
        context.aggregate = event.aggregate;
        context.events = event.events;
        return context;
    }

    eventHandler(event) {
        const groups = this.createAggregateGroups(event);
        if (groups.length === 0) {
            return;
        }
        event.aggregates = event.aggregates || new Map();
        // Only add aggregates once (when event is first fired)
        if (!event.aggregates.has(this.uuid)) {
            const aggregateEvents = groups.map(
                (group) =>
                    new Event(`${this.eventName}:aggregate`, {
                        aggregate: group.aggregate,
                        events: group.events
                    })
            );

            event.aggregates.set(this.uuid, aggregateEvents);
        }

        // Register (or re-register) all aggregate abilities
        for (const aggregateEvent of event.aggregates.get(this.uuid)) {
            const context = this.createContext(aggregateEvent);
            if (this.isTriggeredByContext(context)) {
                this.ability.game.registerAbility(this.ability, context);
            }
        }
    }

    createEvent(eventType) {
        return {
            name: eventType, // Simply capture the event type (eg. Reaction)
            handler: (event) => this.eventHandler(event)
        };
    }
}

export default AggregateTrigger;
