import BaseAbility from './baseability.js';
import Costs from './costs.js';
import TriggeredAbilityContext from './TriggeredAbilityContext.js';
import { equalElements } from '../Array.js';

class TriggeredAbility extends BaseAbility {
    constructor(game, card, eventType, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.max = properties.max;
        this.when = properties.when;
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

    eventHandler(event) {
        if (!this.isTriggeredByEvent(event)) {
            return;
        }

        this.game.registerAbility(this, event);
    }

    createContext(event) {
        const context = new TriggeredAbilityContext({
            ability: this,
            event: event,
            game: this.game,
            source: this.card,
            player: this.playerFunc()
        });
        const listener = this.when[event.name];
        if (typeof listener === 'function') {
            return context;
        } else {
            const aggregates = this.buildAggregates(event, listener.aggregateBy).filter((a) =>
                listener.condition(a.aggregate, a.events, context)
            );
            context.aggregateEvents = [...aggregates.map((a) => a.events)];
            return context;
        }
    }

    triggersFor(eventName) {
        return !!this.when[eventName];
    }

    isTriggeredByEvent(event) {
        let listener = this.when[event.name];

        if (!listener || event.cancelled) {
            return false;
        }

        if (
            event.ability &&
            !!event.ability.cannotBeCanceled &&
            this.eventType === 'cancelinterrupt'
        ) {
            return;
        }

        const context = this.createContext(event);
        if (typeof listener === 'function') {
            return listener(event, context);
        } else {
            return context.aggregateEvents.length > 0;
        }
    }

    buildAggregates(event, aggregateBy) {
        return event.getConcurrentEvents().reduce((groups, e) => {
            if (event.name !== e.name) {
                return groups;
            }
            const aggregate = aggregateBy(e);
            const existing = groups.find((a) => equalElements(a.aggregate, aggregate));
            if (existing) {
                existing.events.push(e);
            } else {
                groups.push({ aggregate, events: [e] });
            }
            return groups;
        }, []);
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

        if (!this.isTriggeredByEvent(context.event)) {
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
        // Also also apparently under conclave due to Archmaester Marwyn.
        if (this.isPlayableEventAbility()) {
            return [
                'conclave',
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

        var eventNames = Object.keys(this.when);

        this.events = [];
        for (let eventName of eventNames) {
            var event = {
                name: eventName + ':' + this.eventType,
                handler: (event) => this.eventHandler(event)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        }

        if (this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if (this.events) {
            for (let event of this.events) {
                this.game.removeListener(event.name, event.handler);
            }
            if (this.limit) {
                this.limit.unregisterEvents(this.game);
            }
            this.events = null;
        }
    }
}

export default TriggeredAbility;
