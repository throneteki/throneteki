import AggregateTrigger from './AggregateTrigger.js';
import BaseAbility from './baseability.js';
import Costs from './costs.js';
import SingularTrigger from './SingularTrigger.js';
import TriggeredAbilityContext from './TriggeredAbilityContext.js';

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

export default TriggeredAbility;
