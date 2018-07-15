const _ = require('underscore');

const PlayAreaLocations = ['play area', 'active plot'];

/**
 * Represents a card based effect applied to one or more targets.
 *
 * Properties:
 * match            - function that takes a card and context object and returns
 *                    a boolean about whether the passed card should have the
 *                    effect applied. Alternatively, a card can be passed as the
 *                    match property to match that single card.
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
 * targetType       - string that determines whether cards or players are the
 *                    target for the effect. Can be 'card' (default) or 'player'
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
        this.targetType = properties.targetType || 'card';
        this.targetLocation = properties.targetLocation || 'play area';
        this.effect = this.buildEffect(properties.effect);
        this.gameAction = this.effect.gameAction || 'genericEffect';
        this.targets = [];
        this.appliedTargets = new Set();
        this.context = { game: game, source: source };
        this.active = !source.facedown;
        this.isConditional = !!properties.condition || this.targetType === 'player' && _.isFunction(properties.match);
        this.isStateDependent = this.isConditional || this.effect.isStateDependent;
    }

    static flattenProperties(properties) {
        if(Array.isArray(properties.effect)) {
            let effects = _.flatten(properties.effect);
            return effects.map(effect => Object.assign({}, properties, { effect: effect }));
        }

        return [properties];
    }

    buildEffect(effect) {
        if(_.isArray(effect)) {
            throw new '`effect` cannot be an array';
        }

        return effect;
    }

    isInActiveLocation() {
        return ['any', this.source.location].includes(this.location);
    }

    addTargets(targets) {
        if(!this.active || !this.condition()) {
            return;
        }

        let newTargets = targets.filter(target => !this.targets.includes(target) && this.isValidTarget(target));

        this.targets = this.targets.concat(newTargets);

        let applicableTargets = newTargets.filter(target => this.canApplyEffect(target));

        for(let target of applicableTargets) {
            this.applyTo(target);
        }
    }

    isValidTarget(target) {
        if(this.targetType === 'card' && target.getGameElementType() === 'card') {
            if(this.targetLocation === 'play area' && !PlayAreaLocations.includes(target.location)) {
                return false;
            }

            if(!['any', 'play area'].includes(this.targetLocation) && target.location !== this.targetLocation) {
                return false;
            }
        }

        if(!_.isFunction(this.match)) {
            return target === this.match;
        }

        if(this.targetType !== target.getGameElementType()) {
            return false;
        }

        if(!this.match(target, this.context)) {
            return false;
        }

        if(this.targetType === 'card') {
            if(this.targetController === 'current') {
                return target.controller === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target.controller !== this.source.controller;
            }
        } else if(this.targetType === 'player') {
            if(this.targetController === 'current') {
                return target === this.source.controller;
            }

            if(this.targetController === 'opponent') {
                return target !== this.source.controller;
            }

            if(this.targetController !== 'any') {
                return target === this.targetController;
            }
        }

        return true;
    }

    removeTarget(card) {
        if(!this.targets.includes(card)) {
            return;
        }

        if(this.appliedTargets.has(card)) {
            this.unapplyFrom(card);
        }

        this.targets = this.targets.filter(target => target !== card);
    }

    hasTarget(card) {
        return this.targets.includes(card);
    }

    setActive(newActive, newTargets) {
        let oldActive = this.active;

        this.active = newActive;

        if(oldActive && !newActive) {
            this.cancel();
        }

        if(!oldActive && newActive) {
            this.addTargets(newTargets);
        }
    }

    cancel() {
        this.unapplyAll();
        this.targets = [];
    }

    reapply(newTargets) {
        if(!this.active || !this.condition()) {
            this.cancel();
            return;
        }

        let invalidTargets = this.targets.filter(target => !this.isValidTarget(target));
        for(let target of invalidTargets) {
            this.removeTarget(target);
        }

        this.updateImmunityStatus();

        if(this.duration === 'persistent' || this.isConditional) {
            this.addTargets(newTargets);
        }

        if(this.effect.isStateDependent) {
            for(let target of this.appliedTargets) {
                this.reapplyTo(target);
            }
        }
    }

    updateImmunityStatus() {
        let needsUnapply = [...this.appliedTargets].filter(target => !this.canApplyEffect(target));
        let shouldBeApplied = this.targets.filter(target => this.canApplyEffect(target));
        let needsApply = shouldBeApplied.filter(target => !this.appliedTargets.has(target));

        for(let target of needsApply) {
            this.applyTo(target);
        }

        if(this.duration === 'persistent') {
            for(let target of needsUnapply) {
                this.unapplyFrom(target);
            }
        }
    }

    canApplyEffect(target) {
        if(target.getGameElementType() !== 'card') {
            return true;
        }

        let gameAction = typeof this.gameAction === 'function' ? this.gameAction(target, this.context) : this.gameAction;

        return target.allowGameAction(gameAction, { source: this.source, resolutionStage: 'effect' });
    }

    get order() {
        return this.effect.order || 0;
    }

    applyTo(target) {
        this.effect.apply(target, this.context);
        this.appliedTargets.add(target);
    }

    reapplyTo(target) {
        if(this.effect.reapply) {
            this.effect.reapply(target, this.context);
            return;
        }

        this.effect.unapply(target, this.context);
        this.effect.apply(target, this.context);
    }

    unapplyFrom(target) {
        this.effect.unapply(target, this.context);
        this.appliedTargets.delete(target);
    }

    unapplyAll() {
        for(let target of this.appliedTargets) {
            this.effect.unapply(target, this.context);
        }
        this.appliedTargets.clear();
    }
}

module.exports = Effect;
