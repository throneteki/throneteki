const _ = require('underscore');

const EventRegistrar = require('./eventregistrar.js');

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register(['onCardMoved', 'onCardTakenControl', 'onCardBlankToggled', 'onChallengeFinished', 'onPhaseEnded', 'onAtEndOfPhase', 'onRoundEnded']);
        this.effects = [];
        this.customDurationEvents = [];
        this.effectsBeingRecalculated = [];
    }

    add(effect) {
        if(!effect.isInActiveLocation()) {
            return;
        }

        this.effects.push(effect);
        this.effects = _.sortBy(this.effects, effect => effect.order);
        effect.addTargets(this.getTargets());
        if(effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
    }

    addSimultaneous(effects) {
        let sortedEffects = _.sortBy(effects, effect => effect.order);
        for(let effect of sortedEffects) {
            this.add(effect);
        }
    }

    getTargets() {
        const validLocations = ['active plot', 'being played', 'dead pile', 'discard pile', 'draw deck', 'faction', 'hand', 'play area', 'duplicate', 'plot deck'];
        let validTargets = this.game.allCards.filter(card => validLocations.includes(card.location));
        return validTargets.concat(this.game.getPlayers()).concat([this.game]);
    }

    recalculateDirtyTargets() {
        let dirtyCards = this.game.allCards.filter(card => card.isDirty);

        if(dirtyCards.length === 0) {
            return;
        }

        this.game.queueSimpleStep(() => {
            for(let card of dirtyCards) {
                this.recalculateTargetingChange(card);
                card.clearDirty();
            }
        });
    }

    reapplyStateDependentEffects() {
        let stateDependentEffects = this.effects.filter(effect => effect.isStateDependent);
        let needsRecalc = _.difference(stateDependentEffects, this.effectsBeingRecalculated);

        if(needsRecalc.length === 0) {
            return;
        }

        this.game.queueSimpleStep(() => {
            this.effectsBeingRecalculated = this.effectsBeingRecalculated.concat(needsRecalc);

            for(let effect of needsRecalc) {
                if(this.effects.includes(effect)) {
                    if(effect.hasEnded()) {
                        effect.cancel();
                        this.effects = this.effects.filter(e => e !== effect);
                    } else {
                        effect.reapply(this.getTargets());
                    }
                }
            }
        });

        this.game.queueSimpleStep(() => {
            this.effectsBeingRecalculated = _.difference(this.effectsBeingRecalculated, needsRecalc);
        });
    }

    onCardMoved(event) {
        let newArea = event.newLocation === 'hand' ? 'hand' : 'play area';
        this.removeTargetFromEffects(event.card, event.originalLocation);
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged && effect.location !== 'any'));
        this.addTargetForPersistentEffects(event.card, newArea);
    }

    onCardTakenControl(event) {
        let card = event.card;
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

    recalculateTargetingChange(card) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.hasTarget(card) && !effect.isValidTarget(card)) {
                effect.removeTarget(card);
            }
            effect.addTargets([card]);
        });

        this.addTargetForPersistentEffects(card, 'play area');
    }

    addTargetForPersistentEffects(card, targetLocation) {
        _.each(this.effects, effect => {
            if(effect.duration === 'persistent' && effect.targetLocation === targetLocation) {
                effect.addTargets([card]);
            }
        });
    }

    removeTargetFromEffects(card, location) {
        let area = location === 'hand' ? 'hand' : 'play area';
        _.each(this.effects, effect => {
            if(effect.targetLocation === area && effect.location !== 'any' || location === 'play area' && !['custom', 'persistent'].includes(effect.duration)) {
                effect.removeTarget(card);
            }
        });
    }

    onCardBlankToggled(event) {
        let { card, isBlank } = event;
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

    activatePersistentEffects() {
        let targets = this.getTargets();
        let persistentEffects = this.effects.filter(effect => effect.duration === 'persistent');
        for(let effect of persistentEffects) {
            effect.setActive(true, targets);
        }
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
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = _.reject(this.effects, effect => effect === customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = _.partition(this.effects, match);
        _.each(matchingEffects, effect => {
            effect.cancel();
        });
        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
