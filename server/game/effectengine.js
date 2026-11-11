import { partition } from '../Array.js';
import EventRegistrar from './eventregistrar.js';
import TakeControl from './GameActions/TakeControl.js';
import SimultaneousEvents from './SimultaneousEvents.js';
import EventWindow from './gamesteps/eventwindow.js';

const MaxSettlePasses = 10;

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
            'onRoundEnded'
        ]);
        this.effects = [];
        this.delayedEffects = [];
        this.customDurationEvents = [];
        this.effectsBeingRecalculated = [];
        this.reportedUnsettled = new Set();
    }

    add(effect) {
        if (!effect.isInActiveLocation()) {
            return;
        }

        if (this.game.durationHasEnded(effect.duration)) {
            return;
        }

        this.effects.push(effect);
        effect.addTargets(this.getTargets());
        if (effect.duration === 'custom') {
            this.registerCustomDurationEvents(effect);
        }
    }

    addSimultaneous(effects) {
        this.withEffectChanges(() => {
            for (const effect of effects) {
                this.add(effect);
            }
        });
    }

    withEffectChanges(callback) {
        if (this.strengthChanges) {
            return callback();
        }
        this.beginEffectChanges();
        try {
            return callback();
        } finally {
            this.endEffectChanges();
        }
    }

    beginEffectChanges() {
        this.strengthChanges = new Map();
        this.iconChanges = new Map();
        this.controlChanges = new Map();
    }

    endEffectChanges() {
        const changes = this.strengthChanges;
        const iconChanges = this.iconChanges;
        const controlChanges = this.controlChanges;
        this.strengthChanges = undefined;
        this.iconChanges = undefined;
        this.controlChanges = undefined;
        for (const [card, { oldController, source }] of controlChanges) {
            TakeControl.applyControlChange(card, oldController, source);
        }
        this.raiseStrengthChanges(changes);
        for (const { card, icon, hadIcon, applyingGain, applyingLoss } of iconChanges.values()) {
            card.raiseIconChangeEvent(icon, hadIcon, hadIcon ? applyingLoss : applyingGain);
        }
    }

    // STR changes from one batch of effects are simultaneous, so their reactions share a window.
    raiseStrengthChanges(changes) {
        const strengthChanges = [...changes].map(([card, change]) => {
            const amount = card.getStrength() - change.before;
            return { card, amount, applying: amount * change.applyingDelta > 0 };
        });
        if (strengthChanges.length === 1) {
            const [{ card, amount, applying }] = strengthChanges;
            card.raiseStrengthChangeEvent(amount, applying);
            return;
        }
        if (strengthChanges.length > 1) {
            const event = new SimultaneousEvents();
            for (const { card, amount, applying } of strengthChanges) {
                event.addChildEvent(card.createStrengthChangeEvent(amount, applying));
            }
            this.game.queueStep(new EventWindow(this.game, event));
        }
    }

    changeControlByEffect(card, source, change) {
        const oldController = card.controller;
        change();
        if (!this.controlChanges) {
            TakeControl.applyControlChange(card, oldController, source);
        } else if (!this.controlChanges.has(card)) {
            this.controlChanges.set(card, { oldController, source });
        }
    }

    recordIconChange(card, icon, hadIcon, applying) {
        if (!this.iconChanges) {
            return false;
        }
        const key = `${card.uuid}:${icon}`;
        const change = this.iconChanges.get(key) || {
            card,
            icon,
            hadIcon,
            applyingGain: false,
            applyingLoss: false
        };
        if (applying && card.hasIcon(icon) !== hadIcon) {
            if (hadIcon) {
                change.applyingLoss = true;
            } else {
                change.applyingGain = true;
            }
        }
        this.iconChanges.set(key, change);
        return true;
    }

    recordStrengthChange(card, amount, applying) {
        if (!this.strengthChanges) {
            return false;
        }
        const previous = this.strengthChanges.get(card);
        this.strengthChanges.set(card, {
            before: previous ? previous.before : card.getStrength() - amount,
            applyingDelta: (previous?.applyingDelta || 0) + (applying ? amount : 0)
        });
        return true;
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
            'revealed plots',
            'title'
        ];
        let validTargets = this.game.allCards.filter((card) =>
            validLocations.includes(card.location)
        );
        return validTargets.concat(this.game.getPlayers()).concat([this.game]);
    }

    /**
     * Recalculates effects until the game state stops changing, then raises the strength, icon
     * and control events for the net changes. Effects that keep switching each other are left as
     * they are after the last pass, and reported.
     */
    settle() {
        const needsRecalc = this.effects.filter(
            (effect) => effect.isStateDependent && !this.effectsBeingRecalculated.includes(effect)
        );
        if (needsRecalc.length === 0 && !this.game.allCards.some((card) => card.isDirty)) {
            return;
        }

        this.game.queueSimpleStep(() => {
            return this.withEffectChanges(() => {
                this.effectsBeingRecalculated = this.effectsBeingRecalculated.concat(needsRecalc);
                let previous = this.getSettleState();

                for (let pass = 0; pass < MaxSettlePasses; ++pass) {
                    this.recalculateDirtyCards();
                    this.reapplyEffects(needsRecalc);
                    const current = this.getSettleState();
                    if (current.key === previous.key) {
                        return;
                    }
                    if (pass === MaxSettlePasses - 1) {
                        this.reportUnsettledEffects(previous, current);
                    }
                    previous = current;
                }
            });
        });

        this.game.queueSimpleStep(() => {
            this.effectsBeingRecalculated = this.effectsBeingRecalculated.filter(
                (effect) => !needsRecalc.includes(effect)
            );
        });
    }

    recalculateDirtyCards() {
        const dirtyCards = this.game.allCards.filter((card) => card.isDirty);
        if (dirtyCards.length === 0) {
            return;
        }

        for (const card of dirtyCards) {
            card.clearDirty();
        }

        for (const effect of this.effects) {
            effect.clearInvalidTargets();
            effect.addTargets(dirtyCards);
            effect.updateAppliedTargets();
        }
    }

    reapplyEffects(effects) {
        for (const effect of effects) {
            if (!this.effects.includes(effect)) {
                continue;
            }
            if (effect.hasEnded()) {
                effect.cancel();
                this.effects = this.effects.filter((e) => e !== effect);
            } else {
                effect.reapply(this.getTargets());
            }
        }
    }

    getSettleState() {
        const effectTargets = this.effects.map((effect) =>
            [...(effect.appliedTargets || [])].map((target) => target.uuid || target.name).join(',')
        );
        const cards = this.game.allCards
            .filter((card) => card.location === 'play area')
            .map((card) =>
                [
                    card.uuid,
                    card.controller.name,
                    card.getStrength?.(),
                    card.getIcons?.().join(),
                    card.getTraits().join(),
                    card.getKeywords().join(),
                    card.isAnyBlank()
                ].join('|')
            );
        return { effectTargets, key: effectTargets.concat(cards).join(';') };
    }

    reportUnsettledEffects(previous, current) {
        const sources = new Set(
            this.effects
                .filter(
                    (effect, index) =>
                        previous.effectTargets[index] !== current.effectTargets[index]
                )
                .map((effect) => effect.source)
        );
        const key = [...sources].map((source) => source.uuid).join();
        if (this.reportedUnsettled.has(key)) {
            return;
        }
        this.reportedUnsettled.add(key);
        this.game.addAlert(
            'danger',
            'The effects of {0} keep switching each other on and off, so they are left as they are',
            [...sources]
        );
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
            return this.withEffectChanges(() => {
                this.effectsBeingRecalculated = this.effectsBeingRecalculated.concat(needsRecalc);
                this.reapplyEffects(needsRecalc);
            });
        });

        this.game.queueSimpleStep(() => {
            return this.withEffectChanges(() => {
                this.effectsBeingRecalculated = this.effectsBeingRecalculated.filter(
                    (effect) => !needsRecalc.includes(effect)
                );
            });
        });
    }

    onCardMoved(event) {
        return this.withEffectChanges(() => {
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
        });
    }

    onCardTakenControl(event) {
        return this.withEffectChanges(() => {
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
        });
    }

    onCardBlankToggled(event) {
        return this.withEffectChanges(() => {
            let { card, isBlank } = event;
            let targets = this.getTargets();
            let matchingEffects = this.effects.filter(
                (effect) => effect.duration === 'persistent' && effect.source === card
            );
            for (let effect of matchingEffects) {
                effect.setActive(!isBlank, targets);
            }
        });
    }

    onChallengeFinished() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfChallenge');
        this.expireDelayedEffects('untilEndOfChallenge');
    }

    onPhaseEnded() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfPhase');
        this.expireDelayedEffects('untilEndOfPhase');
    }

    onRoundEnded() {
        this.unapplyAndRemove((effect) => effect.duration === 'untilEndOfRound');
        this.expireDelayedEffects('untilEndOfRound');
    }

    addDelayedEffect(delayedEffect) {
        this.delayedEffects.push(delayedEffect);
    }

    takeDelayedEffectsTriggeredBy(events) {
        const [triggered, waiting] = partition(this.delayedEffects, (delayedEffect) =>
            events.some((event) => delayedEffect.isTriggeredBy(event))
        );
        this.delayedEffects = waiting;
        return triggered.map((delayedEffect) => ({
            delayedEffect,
            event: events.find((event) => delayedEffect.isTriggeredBy(event))
        }));
    }

    expireDelayedEffectsBy(events) {
        this.delayedEffects = this.delayedEffects.filter(
            (delayedEffect) => !events.some((event) => delayedEffect.isExpiredBy(event))
        );
    }

    expireDelayedEffects(duration) {
        this.delayedEffects = this.delayedEffects.filter(
            (delayedEffect) => delayedEffect.duration !== duration
        );
    }

    activatePersistentEffects() {
        return this.withEffectChanges(() => {
            let targets = this.getTargets();
            let persistentEffects = this.effects.filter(
                (effect) => effect.duration === 'persistent'
            );
            for (let effect of persistentEffects) {
                effect.setActive(!effect.source?.isAnyBlank?.(), targets);
            }
        });
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

        this.withEffectChanges(() => {
            for (const effect of matchingEffects) {
                effect.cancel();
            }
        });

        this.effects = remainingEffects;
    }
}

export default EffectEngine;
