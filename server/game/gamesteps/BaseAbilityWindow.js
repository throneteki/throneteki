import uuid from 'uuid';
import BaseStep from './basestep.js';

class BaseAbilityWindow extends BaseStep {
    constructor(game, properties) {
        super(game);
        this.abilityChoices = [];
        this.event = properties.event;
        this.abilityType = properties.abilityType;
        this.resolvedAbilities = [];
    }

    canTriggerAbility(ability) {
        return (
            ability.eventType === this.abilityType &&
            this.event.getConcurrentEvents().some((event) => ability.isTriggeredByEvent(event))
        );
    }

    gatherChoices() {
        this.abilityChoices = [];
        this.event.emitTo(this.game, this.abilityType);
    }

    registerAbility(ability, event) {
        if (this.hasResolvedAbility(ability, event)) {
            return;
        }

        let context = ability.createContext(event);

        if (!ability.canResolve(context)) {
            return;
        }

        this.abilityChoices.push({
            id: uuid.v1(),
            player: context.player,
            ability: ability,
            card: ability.card,
            context: context
        });
    }

    hasResolvedAbility(ability, event) {
        return this.resolvedAbilities.some(
            (resolved) => resolved.ability === ability && resolved.event === event
        );
    }

    resolveAbility(ability, context) {
        this.game.resolveAbility(ability, context);
        this.markAbilityAsResolved(ability, context.event);
    }

    markAbilityAsResolved(ability, event) {
        this.resolvedAbilities.push({ ability: ability, event: event });
    }

    clearAbilityResolution(ability) {
        this.resolvedAbilities = this.resolvedAbilities.filter(
            (resolvedAbility) => resolvedAbility.ability !== ability
        );
    }

    hasAttachedEvents() {
        if (this.event.cancelled) {
            return false;
        }

        return this.event.getConcurrentEvents().some((event) => event.attachedEvents.length !== 0);
    }

    openWindowForAttachedEvents() {
        if (this.event.cancelled) {
            return;
        }

        this.game.openInterruptWindowForAttachedEvents(this.event);
    }
}

export default BaseAbilityWindow;
