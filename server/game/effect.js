import { flatten } from '../Array.js';

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card, or an array of
 *                    cards to match each of them.
 * duration         - string representing how long the effect lasts.
 * until            - optional object to specify events that will cancel the
 *                    effect when duration is 'custom'. The keys of the object
 *                    represent event names that will be listened to and the
 *                    corresponding values should be handler functions for those
 *                    events that return true when the effect should be
 *                    cancelled.
 * condition        - function that returns a boolean determining whether the
 *                    effect can be applied. Use with cards that have a
 *                    condition that must be met before applying a persistent
 *                    effect (e.g. "when there are more Summer plots revealed
 *                    than Winter plots").
 * targetController - string that determines which player's cards are targeted.
 *                    Can be 'current' (default), 'opponent' or 'any'.
 * targetLocation   - string that determines the location of cards that can be
 *                    applied by the effect. Can be 'play area' (default) or
 *                    'hand'.
 * effect           - object representing the effect to be applied.
 * effect.apply     - function that takes a card and a context object and modifies
 *                    the card to apply the effect.
 * effect.unapply   - function that takes a card and a context object and modifies
 *                    the card to remove the previously applied effect.
 */
class Effect {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.match = properties.match || (() => true);
        this.duration = properties.duration;
        this.until = properties.until || {};
        this.condition = properties.condition || (() => true);
        this.location = properties.location || 'play area';
        this.targetController = properties.targetController || 'current';
        this.targetType = properties.effect.targetType || 'card';
        this.targetLocation = this.buildTargetLocation(properties.targetLocation);
        this.effect = this.buildEffect(properties.effect);
        this.gameAction = this.effect.gameAction || 'genericEffect';
        this.targets = [];
        this.appliedTargets = new Set();
        this.context = { game: game, source: source, effectObject: this };
        this.active = !source.facedown;
        this.isConditional =
            !!properties.condition ||
            (this.targetType === 'player' && typeof properties.match === 'function');
        this.isStateDependent = this.isConditional || this.effect.isStateDependent;
        this.appliedInitialTargets = false;
    }

    static flattenProperties(properties) {
        if (Array.isArray(properties.effect)) {
            let effects = flatten(properties.effect);
            return effects.map((effect) => Object.assign({}, properties, { effect: effect }));
        }

        return [properties];
    }

    buildTargetLocation(targetLocation) {
        if (Array.isArray(targetLocation)) {
            return targetLocation;
        }

        return targetLocation || ['play area', 'active plot'];
    }

    buildEffect(effect) {
        if (Array.isArray(effect)) {
            throw new '`effect` cannot be an array'();
        }

        return effect;
    }

    isInActiveLocation() {
        return ['any', this.source.location].includes(this.location);
    }

    hasEnded() {
        return (
            this.duration === 'custom' && Object.keys(this.until).length === 0 && !this.condition()
        );
    }

    addTargets(targets) {
        if (!this.active || !this.condition()) {
            return;
        }

        if (
            this.duration !== 'persistent' &&
            typeof this.match !== 'function' &&
            this.appliedInitialTargets
        ) {
            return;
        }

        this.appliedInitialTargets = true;

        let newTargets = targets.filter(
            (target) => !this.targets.includes(target) && this.isValidTarget(target)
        );

        for (let target of newTargets) {
            this.targets.push(target);

            if (this.canApply(target)) {
                this.effect.apply(target, this.context);
                this.appliedTargets.add(target);
            }
        }
    }

    canApply(target) {
        if (!target.allowGameAction) {
            return true;
        }

        let gameAction =
            typeof this.gameAction === 'function'
                ? this.gameAction(target, this.context)
                : this.gameAction;

        return target.allowGameAction(gameAction, {
            source: this.source,
            resolutionStage: 'effect'
        });
    }

    isValidTarget(target) {
        if (this.targetType === 'card' && target.getGameElementType() === 'card') {
            if (
                !this.targetLocation.includes('any') &&
                !this.targetLocation.includes(target.location)
            ) {
                return false;
            }
        }

        if (Array.isArray(this.match)) {
            return this.match.includes(target);
        } else if (typeof this.match !== 'function') {
            return target === this.match;
        }

        if (this.targetType !== target.getGameElementType()) {
            return false;
        }

        if (!this.match(target, this.context)) {
            return false;
        }

        if (this.targetType === 'card') {
            if (this.targetController === 'current') {
                return target.controller === this.source.controller;
            }

            if (this.targetController === 'opponent') {
                return target.controller !== this.source.controller;
            }
        } else if (this.targetType === 'player') {
            if (this.targetController === 'current') {
                return target === this.source.controller;
            }

            if (this.targetController === 'opponent') {
                return target !== this.source.controller;
            }

            if (this.targetController !== 'any') {
                return target === this.targetController;
            }
        }

        return true;
    }

    removeTarget(card) {
        if (!this.targets.includes(card)) {
            return;
        }

        if (this.appliedTargets.has(card)) {
            this.effect.unapply(card, this.context);
            this.appliedTargets.delete(card);
        }

        this.targets = this.targets.filter((target) => target !== card);
    }

    hasTarget(card) {
        return this.targets.includes(card);
    }

    isAppliedTo(target) {
        return this.appliedTargets.has(target);
    }

    setActive(newActive, newTargets) {
        let oldActive = this.active;

        this.active = newActive;

        if (oldActive && !newActive) {
            this.cancel();
        }

        if (!oldActive && newActive) {
            this.addTargets(newTargets);
        }
    }

    cancel() {
        for (let target of this.appliedTargets) {
            this.effect.unapply(target, this.context);
        }

        this.targets = [];
        this.appliedTargets.clear();
    }

    clearInvalidTargets() {
        if (!this.condition()) {
            this.cancel();
            return;
        }

        for (let target of this.targets) {
            if (!this.isValidTarget(target)) {
                this.removeTarget(target);
            }
        }
    }

    updateAppliedTargets() {
        let unappliedTargets = this.targets.filter((target) => !this.appliedTargets.has(target));
        let needsApply = unappliedTargets.filter((target) => this.canApply(target));

        for (let target of needsApply) {
            this.effect.apply(target, this.context);
            this.appliedTargets.add(target);
        }

        // Gaining immunity to a persistent effect should unapply the effect,
        // but not for lasting effects.
        if (this.duration === 'persistent') {
            let needsUnapply = [...this.appliedTargets].filter((target) => !this.canApply(target));

            for (let target of needsUnapply) {
                this.effect.unapply(target, this.context);
                this.appliedTargets.delete(target);
            }
        }
    }

    reapply(newTargets) {
        if (!this.active) {
            return;
        }

        if (this.isConditional) {
            let newCondition = this.condition();

            if (!newCondition) {
                this.cancel();
                return;
            }

            if (newCondition) {
                let invalidTargets = this.targets.filter((target) => !this.isValidTarget(target));
                for (let target of invalidTargets) {
                    this.removeTarget(target);
                }
                this.addTargets(newTargets);
            }
        }

        if (this.effect.isStateDependent) {
            let reapplyFunc = this.createReapplyFunc();
            for (let target of this.appliedTargets) {
                reapplyFunc(target);
            }
        }
    }

    createReapplyFunc() {
        if (this.effect.reapply) {
            return (target) => this.effect.reapply(target, this.context);
        }

        return (target) => {
            this.effect.unapply(target, this.context);
            this.effect.apply(target, this.context);
        };
    }

    get order() {
        return this.effect.order || 0;
    }
}

export default Effect;
