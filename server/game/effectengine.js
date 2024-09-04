import { partition, sortBy } from '../Array.js';
import EventRegistrar from './eventregistrar.js';

class EffectEngine {
    constructor(game) {
        this.game = game;
        this.events = new EventRegistrar(game, this);
        this.events.register([
            'onCardMoved',
            'onCardTakenControl',
            'onCardBlankToggled',
            'onChallengeFinished',
            'onPhaseEnded',
            'onAtEndOfChallenge',
            'onAtEndOfPhase',
            'onRoundEnded',
            'onAtEndOfRound'
        ]);
        this.effects = [];
        this.customDurationEvents = [];
        this.effectsBeingRecalculated = [];
    }

    add(effect) {
        if (!effect.isInActiveLocation()) {
            return;
        }

        this.effects.push(effect);
        this.effects = sortBy(this.effects, (effect) => effect.order);
        effect.addTargets(this.getTargets());
        if (effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
    }

    addSimultaneous(effects) {
        let sortedEffects = sortBy(effects, (effect) => effect.order);
        for (let effect of sortedEffects) {
            this.add(effect);
        }
    }

    getTargets() {
        const validLocations = [
            'active plot',
            'being played',
            'dead pile',
            'discard pile',
            'draw deck',
            'faction',
            'hand',
            'play area',
            'duplicate',
            'plot deck',
            'shadows',
            'revealed plots'
        ];
        let validTargets = this.game.allCards.filter((card) =>
            validLocations.includes(card.location)
        );
        return validTargets.concat(this.game.getPlayers()).concat([this.game]);
    }

    recalculateDirtyTargets() {
        let dirtyCards = this.game.allCards.filter((card) => card.isDirty);

        if (dirtyCards.length === 0) {
            return;
        }

        this.game.queueSimpleStep(() => {
            for (let card of dirtyCards) {
                card.clearDirty();
            }

            for (let effect of this.effects) {
                effect.clearInvalidTargets();
                effect.addTargets(dirtyCards);
                effect.updateAppliedTargets();
            }
        });
    }

    reapplyStateDependentEffects() {
        let stateDependentEffects = this.effects.filter((effect) => effect.isStateDependent);
        let needsRecalc = stateDependentEffects.filter(
            (effect) => !this.effectsBeingRecalculated.includes(effect)
        );

        if (needsRecalc.length === 0) {
            return;
        }

        this.game.queueSimpleStep(() => {
            this.effectsBeingRecalculated = this.effectsBeingRecalculated.concat(needsRecalc);

            for (let effect of needsRecalc) {
                if (this.effects.includes(effect)) {
                    if (effect.hasEnded()) {
                        effect.cancel();
                        this.effects = this.effects.filter((e) => e !== effect);
                    } else {
                        effect.reapply(this.getTargets());
                    }
                }
            }
        });

        this.game.queueSimpleStep(() => {
            this.effectsBeingRecalculated = this.effectsBeingRecalculated.filter(
                (effect) => !needsRecalc.includes(effect)
            );
        });
    }

    onCardMoved(event) {
        this.unapplyAndRemove(
            (effect) =>
                effect.duration === 'persistent' &&
                effect.source === event.card &&
                !event.facedownChanged &&
                (effect.location === event.originalLocation ||
                    (event.parentChanged && effect.location !== 'any'))
        );
        for (let effect of this.effects) {
            effect.clearInvalidTargets();
            effect.addTargets([event.card]);
            effect.updateAppliedTargets();
        }
    }

    onCardTakenControl(event) {
        let card = event.card;
        for (let effect of this.effects) {
            effect.clearInvalidTargets();
            if (effect.duration === 'persistent' && effect.source === card) {
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
        let matchingEffects = this.effects.filter(
            (effect) => effect.duration === 'persistent' && effect.source === card
        );
        for (let effect of matchingEffects) {
            effect.setActive(!isBlank, targets);
        }
    }

    onChallengeFinished() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfChallenge');
    }

    onPhaseEnded() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfPhase');
    }

    onAtEndOfChallenge() {
        this.unapplyAndRemove((effect) => effect.duration === 'atEndOfChallenge');
    }

    onAtEndOfPhase() {
        this.unapplyAndRemove((effect) => effect.duration === 'atEndOfPhase');
    }

    onRoundEnded() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfRound');
    }

    onAtEndOfRound() {
        this.unapplyAndRemove((effect) => effect.duration === 'atEndOfRound');
    }

    activatePersistentEffects() {
        let targets = this.getTargets();
        let persistentEffects = this.effects.filter((effect) => effect.duration === 'persistent');
        for (let effect of persistentEffects) {
            effect.setActive(true, targets);
        }
    }

    registerCustomDurationEvents(effect) {
        if (!effect.until) {
            return;
        }

        let eventNames = Object.keys(effect.until);
        for (let eventName of eventNames) {
            let handler = this.createCustomDurationHandler(eventName, effect);
            this.customDurationEvents.push({
                name: eventName,
                handler: handler,
                effect: effect
            });
            this.game.on(eventName, handler);
        }
    }

    unregisterCustomDurationEvents(effect) {
        let [eventsForEffect, remainingEvents] = partition(
            this.customDurationEvents,
            (event) => event.effect === effect
        );

        for (let event of eventsForEffect) {
            this.game.removeListener(event.name, event.handler);
        }

        this.customDurationEvents = remainingEvents;
    }

    createCustomDurationHandler(eventName, customDurationEffect) {
        return (...args) => {
            let listener = customDurationEffect.until[eventName];
            if (listener && listener(...args)) {
                customDurationEffect.cancel();
                this.unregisterCustomDurationEvents(customDurationEffect);
                this.effects = this.effects.filter((effect) => effect !== customDurationEffect);
            }
        };
    }

    unapplyAndRemove(match) {
        var [matchingEffects, remainingEffects] = partition(this.effects, match);

        // Explicitly cancel effects in reverse order that they were applied so
        // that problems with STR reduction and burn are avoided.
        for (let effect of matchingEffects.reverse()) {
            effect.cancel();
        }

        this.effects = remainingEffects;
    }
}

export default EffectEngine;
