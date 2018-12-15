const _ = require('underscore');

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

    buildTargetLocation(targetLocation) {
        if(Array.isArray(targetLocation)) {
            return targetLocation;
        }

        return targetLocation || ['play area', 'active plot'];
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

    hasEnded() {
        return this.duration === 'custom' && Object.keys(this.until).length === 0 && !this.condition();
    }

    addTargets(targets) {
        if(!this.active || !this.condition()) {
            return;
        }

        let newTargets = _.difference(targets, this.targets);

        _.each(newTargets, target => {
            if(this.isValidTarget(target)) {
                this.targets.push(target);
                this.effect.apply(target, this.context);
            }
        });
    }

    isValidTarget(target) {
        if(this.targetType === 'card' && target.getGameElementType() === 'card') {
            if(!this.targetLocation.includes('any') && !this.targetLocation.includes(target.location)) {
                return false;
            }

            let gameAction = typeof this.gameAction === 'function' ? this.gameAction(target, this.context) : this.gameAction;

            if(!target.allowGameAction(gameAction, { source: this.source, resolutionStage: 'effect' })) {
                return false;
            }
        }

        if(Array.isArray(this.match)) {
            return this.match.includes(target);
        } else if(typeof(this.match) !== 'function') {
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
        if(!_.contains(this.targets, card)) {
            return;
        }

        this.effect.unapply(card, this.context);

        this.targets = _.reject(this.targets, target => target === card);
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
        _.each(this.targets, target => this.effect.unapply(target, this.context));
        this.targets = [];
    }

    reapply(newTargets) {
        if(!this.active) {
            return;
        }

        if(this.isConditional) {
            let newCondition = this.condition();

            if(!newCondition) {
                this.cancel();
                return;
            }

            if(newCondition) {
                let invalidTargets = _.filter(this.targets, target => !this.isValidTarget(target));
                _.each(invalidTargets, target => {
                    this.removeTarget(target);
                });
                this.addTargets(newTargets);
            }
        }

        if(this.effect.isStateDependent) {
            let reapplyFunc = this.createReapplyFunc();
            _.each(this.targets, target => reapplyFunc(target));
        }
    }

    createReapplyFunc() {
        if(this.effect.reapply) {
            return target => this.effect.reapply(target, this.context);
        }

        return target => {
            this.effect.unapply(target, this.context);
            this.effect.apply(target, this.context);
        };
    }

    get order() {
        return this.effect.order || 0;
    }
}

module.exports = Effect;
