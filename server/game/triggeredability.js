const _ = require('underscore');

const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

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

        if(card.getPrintedType() === 'event' && !properties.ignoreEventCosts) {
            this.cost = this.cost.concat(Costs.playEvent());
        }

        if(this.max) {
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

        let defaultedLocation = location || DefaultLocationForType[card.getPrintedType()] || ['play area'];

        if(!Array.isArray(defaultedLocation)) {
            return [defaultedLocation];
        }

        return defaultedLocation;
    }

    eventHandler(event) {
        if(!this.isTriggeredByEvent(event)) {
            return;
        }

        this.game.registerAbility(this, event);
    }

    createContext(event) {
        return new TriggeredAbilityContext({ event: event, game: this.game, source: this.card, player: this.playerFunc() });
    }

    isTriggeredByEvent(event) {
        let listener = this.when[event.name];

        if(!listener || event.cancelled) {
            return false;
        }

        if(event.ability && !!event.ability.cannotBeCanceled && this.eventType === 'cancelinterrupt') {
            return;
        }

        return listener(event);
    }

    meetsRequirements(context) {
        let isPlayableEventAbility = this.isPlayableEventAbility();

        if(this.game.currentPhase === 'setup') {
            return false;
        }

        if(this.isCardAbility() && !this.isForcedAbility() && context.player && !context.player.canTrigger(this.card)) {
            return false;
        }

        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        if(this.max && context.player.isAbilityAtMax(context.source.name)) {
            return false;
        }

        if(this.card.isAnyBlank()) {
            return false;
        }

        if(!this.isTriggeredByEvent(context.event)) {
            return false;
        }

        if(isPlayableEventAbility && !context.player.isCardInPlayableLocation(this.card, 'play')) {
            return false;
        }

        if(!isPlayableEventAbility && !this.location.includes(this.card.location)) {
            return false;
        }

        if(!this.canResolveOpponents(context) || !this.canPayCosts(context) || !this.canResolveTargets(context)) {
            return false;
        }

        return true;
    }

    isEventListeningLocation(location) {
        // Reactions / interrupts for playable event cards need to listen for
        // game events in all open information locations plus while in hand.
        // The location property of the ability will prevent it from firing in
        // inappropriate locations when requirements are checked for the ability.
        if(this.isPlayableEventAbility()) {
            return ['discard pile', 'hand', 'shadows', 'play area'].includes(location);
        }

        return this.location.includes(location);
    }

    isPlayableEventAbility() {
        return this.card.getPrintedType() === 'event' && this.location.includes('hand');
    }

    incrementLimit() {
        if(!this.location.includes(this.card.location)) {
            return;
        }

        super.incrementLimit();
    }

    hasMax() {
        return !!this.max;
    }

    registerEvents() {
        if(this.events) {
            return;
        }

        var eventNames = _.keys(this.when);

        this.events = [];
        _.each(eventNames, eventName => {
            var event = {
                name: eventName + ':' + this.eventType,
                handler: event => this.eventHandler(event)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });

        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if(this.events) {
            _.each(this.events, event => {
                this.game.removeListener(event.name, event.handler);
            });
            if(this.limit) {
                this.limit.unregisterEvents(this.game);
            }
            this.events = null;
        }
    }
}

module.exports = TriggeredAbility;
