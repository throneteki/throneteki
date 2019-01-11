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
        const validLocations = ['active plot', 'being played', 'dead pile', 'discard pile', 'draw deck', 'faction', 'hand', 'play area', 'duplicate', 'plot deck', 'shadows'];
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
                card.clearDirty();
            }

            for(let effect of this.effects) {
                effect.clearInvalidTargets();
                effect.addTargets(dirtyCards);
                effect.updateAppliedTargets();
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
        this.unapplyAndRemove(effect => effect.duration === 'persistent' && effect.source === event.card && (effect.location === event.originalLocation || event.parentChanged && effect.location !== 'any'));
        for(let effect of this.effects) {
            effect.clearInvalidTargets();
            effect.addTargets([event.card]);
            effect.updateAppliedTargets();
        }
    }

    onCardTakenControl(event) {
        let card = event.card;
        for(let effect of this.effects) {
            effect.clearInvalidTargets();
            if(effect.duration === 'persistent' && effect.source === card) {
                // Since the controllers have changed, explicitly cancel the
                // effect for existing targets and then recalculate effects for
                // the new controller from scratch.
                effect.addTargets(this.getTargets());
            } else {
                effect.addTargets([card]);
            }

            effect.updateAppliedTargets();
        }
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

        // Explicitly cancel effects in reverse order that they were applied so
        // that problems with STR reduction and burn are avoided.
        for(let effect of matchingEffects.reverse()) {
            effect.cancel();
        }

        this.effects = remainingEffects;
    }
}

module.exports = EffectEngine;
