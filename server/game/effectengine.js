const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardMoved', 'onCardFactionChanged', 'onCardTakenControl', 'onCardBlankToggled', 'onChallengeFinished', 'onPhaseEnded', 'onAtEndOfPhase', 'onRoundEnded']);
        this.effects = [];
        this.recalculateEvents = {};
        this.customDurationEvents = [];
    }

    add(effect) {
        if(!effect.isInActiveLocation()) {
            return;
        }

        this.effects.push(effect);
        this.effects = _.sortBy(this.effects, effect => effect.order);
        effect.addTargets(this.getTargets());
        this.registerRecalculateEvents(effect.recalculateWhen);
        if(effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
    }

    getTargets() {
        var validTargets = this.game.allCards.filter(card => card.location === 'play area' || card.location === 'active plot' || card.location === 'hand');
        return validTargets.concat(_.values(this.game.getPlayers()));
    }

    reapplyStateDependentEffects() {
        _.each(this.effects, effect => {
            if(effect.isStateDependent) {
                effect.reapply(this.getTargets());
            }
        });
    }

    onCardMoved(event) {
        let originalArea = event.originalLocation === 'hand' ? 'hand' : 'play area';
        let newArea = event.newLocation === 'hand' ? 'hand' : 'play area';
        this.removeTargetFromPersistentEffects(event.card, originalArea);
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged));
        this.addTargetForPersistentEffects(event.card, newArea);
    }

    onCardTakenControl(e, card) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.source === card) {
                // Since the controllers have changed, explicitly cancel the
                // effect for existing targets and then recalculate effects for
                // the new controller from scratch.
                effect.cancel();
                effect.addTargets(this.getTargets());
            } else if(effect.duration === 'persistent' && effect.hasTarget(card) && !effect.isValidTarget(card)) {
                // Evict the card from any effects applied on it that are no
                // longer valid under the new controller.
                effect.removeTarget(card);
            }
        });

        // Reapply all relevant persistent effects given the card's new
        // controller.
        this.addTargetForPersistentEffects(card, 'play area');
    }

    onCardFactionChanged(event) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.hasTarget(event.card) && !effect.isValidTarget(event.card)) {
                effect.removeTarget(event.card);
            }
        });

        this.addTargetForPersistentEffects(event.card, 'play area');
    }

    addTargetForPersistentEffects(card, targetLocation) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.targetLocation === targetLocation) {
                effect.addTargets([card]);
            }
        });
    }

    removeTargetFromPersistentEffects(card, targetLocation) {
        _.each(this.effects, effect => {
            if(effect.targetLocation === targetLocation && effect.location !== 'any') {
                effect.removeTarget(card);
            }
        });
    }

    onCardBlankToggled(event, card, isBlank) {
        let targets = this.getTargets();
        let matchingEffects = _.filter(this.effects, effect => effect.duration === 'persistent' && effect.source === card);
        _.each(matchingEffects, effect => {
            effect.setActive(!isBlank, targets);
        });
    }

    onChallengeFinished() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfChallenge');
    }

    onPhaseEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfPhase');
    }

    onAtEndOfPhase() {
        this.unapplyAndRemove(effect => effect.duration === 'atEndOfPhase');
    }

    onRoundEnded() {
        this.unapplyAndRemove(effect => effect.duration === 'untilEndOfRound');
    }

    registerRecalculateEvents(eventNames) {
        _.each(eventNames, eventName => {
            if(!this.recalculateEvents[eventName]) {
                var handler = this.recalculateEvent.bind(this);
                this.recalculateEvents[eventName] = {
                    name: eventName,
                    handler: handler,
                    count: 1
                };
                this.game.on(eventName, handler);
            } else {
                this.recalculateEvents[eventName].count++;
            }
        });
    }

    unregisterRecalculateEvents(eventNames) {
        _.each(eventNames, eventName => {
            var event = this.recalculateEvents[eventName];
            if(event && event.count <= 1) {
                this.game.removeListener(event.name, event.handler);
                delete this.recalculateEvents[eventName];
            } else if(event) {
                event.count--;
            }
        });
    }

    recalculateEvent(event) {
        _.each(this.effects, effect => {
            if(effect.isStateDependent && effect.recalculateWhen.includes(event.name)) {
                effect.reapply(this.getTargets());
            }
        });
    }

    registerCustomDurationEvents(effect) {
        if(!effect.until) {
            return;
        }

        let eventNames = _.keys(effect.until);
        let handler = this.createCustomDurationHandler(effect);
        _.each(eventNames, eventName => {
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        });
    }

    unregisterCustomDurationEvents(effect) {
        let [eventsForEffect, remainingEvents] = _.partition(this.customDurationEvents, event => event.effect === effect);

        _.each(eventsForEffect, event => {
            this.game.removeListener(event.name, event.handler);
        });

        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(customDurationEffect) {
        return (...args) => {
            let event = args[0];
            let listener = customDurationEffect.until[event.name];
            if(listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterRecalculateEvents(customDurationEffect.recalculateWhen);
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = _.reject(this.effects, effect => effect === customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
            this.unregisterRecalculateEvents(effect.recalculateWhen);
        });
        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
