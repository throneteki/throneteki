import { flatMap } from '../Array.js';
import AbilityChoosePlayerDefinition from './AbilityChoosePlayerDefinition.js';
import AbilityMessage from './AbilityMessage.js';
import AbilityTarget from './AbilityTarget.js';
import ChooseGameAction from './GameActions/ChooseGameAction.js';
import HandlerGameActionWrapper from './GameActions/HandlerGameActionWrapper.js';
import StackProperty from './PropertyTypes/StackProperty.js';

/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card, or ambushing a card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
class BaseAbility {
    /**
     * Creates an ability.
     *
     * @param {Object} properties - An object with ability related properties.
     * @param {Object|Array} properties.cost - optional property that specifies
     * the cost for the ability. Can either be a cost object or an array of cost
     * objects.
     */
    constructor(properties) {
        this.cost = this.buildCost(properties.cost);
        this.targets = this.buildTargets(properties);
        this.payingPlayer = properties.payingPlayer || ((context) => context.player);
        this.choosePlayerDefinition = AbilityChoosePlayerDefinition.create(properties);
        this.limit = properties.limit;
        this.message = AbilityMessage.create(properties.message);
        this.cannotBeCanceledStack = new StackProperty(!!properties.cannotBeCanceled);
        this.abilitySourceType = properties.abilitySourceType || 'card';
        this.gameAction = this.buildGameAction(properties);
    }

    buildCost(cost) {
        if (!cost) {
            return [];
        }

        if (!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        if (properties.target) {
            return [AbilityTarget.create('target', properties.target)];
        }

        if (properties.targets) {
            let targetPairs = Object.entries(properties.targets);
            return targetPairs.map(([name, properties]) => AbilityTarget.create(name, properties));
        }

        return [];
    }

    buildGameAction(properties) {
        if (properties.gameAction) {
            if (
                properties.target ||
                properties.targets ||
                properties.chooseOpponent ||
                properties.choosePlayer
            ) {
                throw new Error('Cannot use gameAction with abilities with choices');
            }

            return properties.gameAction;
        }

        if (properties.choices) {
            return new ChooseGameAction({ choices: properties.choices });
        }

        if (properties.handler) {
            return new HandlerGameActionWrapper({ handler: properties.handler });
        }

        return null;
    }

    canResolve(context) {
        return (
            this.meetsRequirements(context) &&
            this.canResolvePlayer(context) &&
            this.canPayCosts(context) &&
            this.canResolveTargets(context) &&
            this.isGameActionAllowed(context)
        );
    }

    meetsRequirements() {
        return true;
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context) {
        context.payingPlayer = this.payingPlayer(context);
        return this.executeWithTemporaryContext(context, 'cost', () =>
            this.cost.every((cost) => cost.canPay(context))
        );
    }

    /**
     * Executes the specified callback using the passed ability context and
     * resolution stage. This allows functions to be executed with the proper
     * ability context for immunity / cannot restrictions prior to the ability
     * context being pushed on the game's stack during the full resolution of
     * the ability.
     *
     * @param {AbilityContext} context
     * @param {string} stage
     * @param {Function} callback
     * @returns {*}
     * The return value of the callback function.
     */
    executeWithTemporaryContext(context, stage, callback) {
        let originalResolutionStage = context.resolutionStage;
        let originalCardStateWhenInitiated = context.cardStateWhenInitiated;

        try {
            context.game.pushAbilityContext(context);
            context.resolutionStage = stage;
            context.cardStateWhenInitiated = context.source
                ? context.source.createSnapshot()
                : undefined;
            return callback();
        } finally {
            context.resolutionStage = originalResolutionStage;
            context.cardStateWhenInitiated = originalCardStateWhenInitiated;
            context.game.popAbilityContext();
        }
    }

    /**
     * Resolves all costs for the ability prior to payment. Some cost objects
     * have a `resolve` method in order to prompt the user to make a choice,
     * such as choosing a card to kneel. Consumers of this method should wait
     * until all costs have a `resolved` value of `true` before proceeding.
     *
     * @returns {Array} An array of cost resolution results.
     */
    resolveCosts(context) {
        return this.cost.map((cost) => {
            if (cost.resolve) {
                return cost.resolve(context);
            }

            return { resolved: true, value: cost.canPay(context) };
        });
    }

    /**
     * Pays all costs for the ability simultaneously.
     */
    payCosts(context) {
        for (let cost of this.cost) {
            cost.pay(context);
        }
    }

    /**
     * Return whether when unpay is implemented for the ability cost and the
     * cost can be unpaid.
     *
     * @returns {boolean}
     */
    canUnpayCosts(context) {
        return this.cost.every((cost) => cost.unpay && cost.canUnpay(context));
    }

    /**
     * Unpays each cost associated with the ability.
     */
    unpayCosts(context) {
        for (let cost of this.cost) {
            cost.unpay(context);
        }
    }

    /**
     * Returns whether the ability requires a player to be chosen.
     */
    needsChoosePlayer() {
        return !!this.choosePlayerDefinition;
    }

    /**
     * Returns whether there are players that can be chosen, if the ability
     * requires that a player be chosen.
     */
    canResolvePlayer(context) {
        if (!this.needsChoosePlayer()) {
            return true;
        }

        return this.choosePlayerDefinition.canResolve(context);
    }

    /**
     * Prompts the current player to choose a player
     */
    resolvePlayer(context) {
        if (!this.needsChoosePlayer()) {
            return;
        }

        return this.choosePlayerDefinition.resolve(context);
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return this.executeWithTemporaryContext(context, 'effect', () =>
            this.targets.every((target) => target.canResolve(context))
        );
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     *
     * @returns {Array} An array of target resolution objects.
     */
    resolveTargets(context) {
        return flatMap(this.targets, (target) => target.resolve(context));
    }

    /**
     * Returns whether the gameAction for this ability is allowed to resolve.
     *
     * @returns {Boolean}
     */
    isGameActionAllowed(context) {
        return this.executeWithTemporaryContext(context, 'effect', () =>
            this.gameAction.allow(context)
        );
    }

    /**
     * Increments the usage of the ability toward its limit, if it has one.
     */
    incrementLimit() {
        if (this.limit) {
            this.limit.increment();
        }
    }

    outputMessage(context) {
        this.message.output(context.game, context);
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) {
        context.game.resolveGameAction(this.gameAction, context);
    }

    isAction() {
        return false;
    }

    isPlayableEventAbility() {
        return false;
    }

    isCardAbility() {
        return this.abilitySourceType === 'card';
    }

    isTriggeredAbility() {
        return false;
    }

    isForcedAbility() {
        return false;
    }

    hasMax() {
        return false;
    }

    shouldHideSourceInMessage() {
        return false;
    }

    get cannotBeCanceled() {
        return this.cannotBeCanceledStack.get();
    }

    setCannotBeCanceled(value, source) {
        this.cannotBeCanceledStack.set(value, source);
    }

    clearCannotBeCanceled(value, source) {
        this.cannotBeCanceledStack.remove(value, source);
    }
}

export default BaseAbility;
