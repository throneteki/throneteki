import uuid from 'uuid';
import BaseAbility from './baseability.js';
import Costs from './costs.js';
import TriggeredAbilityContext from './TriggeredAbilityContext.js';
import Event from './event.js';

class TriggeredAbility extends BaseAbility {
    constructor(game, card, eventType, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.max = properties.max;
        this.abilityTriggers = this.buildAbilityTriggers(properties.when);
        this.playerFunc = properties.player || (() => this.card.controller);
        this.eventType = eventType;
        this.location = this.buildLocation(card, properties.location);

        if (card.getPrintedType() === 'event' && !properties.ignoreEventCosts) {
            this.cost = this.cost.concat(Costs.playEvent());
        }

        if (this.max) {
            this.card.owner.registerAbilityMax(this.card.name, this.max);
        }
    }

    isTriggeredAbility() {
        return true;
    }

    buildAbilityTriggers(when) {
        const abilityTriggers = [];
        for (const eventName in when) {
            const listener = when[eventName];
            const trigger =
                typeof listener === 'function'
                    ? new SingularTrigger(this, eventName, listener)
                    : new AggregateTrigger(this, eventName, listener);
            abilityTriggers.push(trigger);
        }
        return abilityTriggers;
    }

    buildLocation(card, location) {
        const DefaultLocationForType = {
            event: 'hand',
            agenda: 'agenda',
            plot: 'active plot'
        };

        let defaultedLocation = location ||
            DefaultLocationForType[card.getPrintedType()] || ['play area'];

        if (!Array.isArray(defaultedLocation)) {
            return [defaultedLocation];
        }

        return defaultedLocation;
    }

    createContext(event) {
        return new TriggeredAbilityContext({
            ability: this,
            event: event,
            game: this.game,
            source: this.card,
            player: this.playerFunc()
        });
    }

    triggersFor(eventName) {
        return this.abilityTriggers.some((t) => t.eventName === eventName);
    }

    isTriggeredByContext(context) {
        return this.abilityTriggers.some((t) => t.isTriggeredByContext(context));
    }

    meetsRequirements(context) {
        let isPlayableEventAbility = this.isPlayableEventAbility();

        if (this.game.currentPhase === 'setup') {
            return false;
        }

        if (
            this.isCardAbility() &&
            !this.isForcedAbility() &&
            context.player &&
            !context.player.canTrigger(this)
        ) {
            return false;
        }

        if (this.limit && this.limit.isAtMax()) {
            return false;
        }

        if (this.max && context.player.isAbilityAtMax(context.source.name)) {
            return false;
        }

        if (this.card.isAnyBlank()) {
            return false;
        }

        if (!this.isTriggeredByContext(context)) {
            return false;
        }

        if (isPlayableEventAbility && !context.player.isCardInPlayableLocation(this.card, 'play')) {
            return false;
        }

        if (!isPlayableEventAbility && !this.location.includes(this.card.location)) {
            return false;
        }

        if (
            this.card.getPrintedType() !== 'event' &&
            this.card.facedown &&
            this.card.location !== 'duplicate'
        ) {
            return false;
        }

        if (
            !this.canResolvePlayer(context) ||
            !this.canPayCosts(context) ||
            !this.canResolveTargets(context)
        ) {
            return false;
        }

        return true;
    }

    isEventListeningLocation(location) {
        // Reactions / interrupts for playable event cards need to listen for
        // game events in all open information locations plus while in hand.
        // The location property of the ability will prevent it from firing in
        // inappropriate locations when requirements are checked for the ability.
        //
        // Also apparently the draw deck because of Maester Gormon.
        // Also also apparently under cards due to Archmaester Marwyn.
        if (this.isPlayableEventAbility()) {
            return [
                'discard pile',
                'draw deck',
                'hand',
                'shadows',
                'play area',
                'underneath'
            ].includes(location);
        }

        return this.location.includes(location);
    }

    isPlayableEventAbility() {
        return this.card.getPrintedType() === 'event' && this.location.includes('hand');
    }

    incrementLimit() {
        if (!this.location.includes(this.card.location)) {
            return;
        }

        super.incrementLimit();
    }

    hasMax() {
        return !!this.max;
    }

    registerEvents() {
        if (this.events) {
            return;
        }

        this.events = [];
        for (const abilityTrigger of this.abilityTriggers) {
            const event = abilityTrigger.createEvent(this.eventType);
            this.game.on(event.name, event.handler);
            this.events.push(event);
        }

        if (this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if (this.events) {
            for (const event of this.events) {
                this.game.removeListener(event.name, event.handler);
            }
            if (this.limit) {
                this.limit.unregisterEvents(this.game);
            }
            this.events = null;
        }
    }
}

export class SingularTrigger {
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
        if (!this.isTriggeredByEvent(event, context)) {
            return;
        }
        this.ability.game.registerAbility(this.ability, context);
    }

    createEvent(eventType) {
        return {
            name: `${this.eventName}:${eventType}`,
            handler: (event) => this.eventHandler(event)
        };
    }
}

export class AggregateTrigger {
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

export default TriggeredAbility;
