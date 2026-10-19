import { flatMap } from '../Array.js';
import AbilityChoosePlayerDefinition from './AbilityChoosePlayerDefinition.js';
import AbilityMessage from './AbilityMessage.js';
import AbilityTarget from './AbilityTarget.js';
import ChooseGameAction from './GameActions/ChooseGameAction.js';
import HandlerGameActionWrapper from './GameActions/HandlerGameActionWrapper.js';
import SimultaneousActions from './GameActions/SimultaneousActions.js';
import StackProperty from './PropertyTypes/StackProperty.js';
import { Requirements } from './Constants/index.js';

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
        const definitions = properties.target
            ? [['target', properties.target]]
            : Object.entries(properties.targets || {});
        const singleTarget = !!properties.target;

        this.targetGameActions = [];

        return definitions.map(([name, targetProperties]) => {
            let { gameAction, ...rest } = targetProperties;
            let filterAction = singleTarget ? properties.gameAction : undefined;

            // A target's own game action is what the ability does to that target. A string
            // only names the action checked for immunity.
            if (gameAction && typeof gameAction === 'object') {
                this.targetGameActions.push(gameAction);
                filterAction = gameAction;
                gameAction = undefined;
            }

            const gameActionFilter = filterAction
                ? (selection, context) =>
                      BaseAbility.allowsTarget(filterAction, selection, context, name)
                : undefined;

            return AbilityTarget.create(name, { ...rest, gameAction, gameActionFilter });
        });
    }

    /**
     * Whether a game action could change the game state if the selection were chosen as the
     * named target. Used to rule out targets the ability could do nothing to.
     */
    static allowsTarget(gameAction, selection, context, name = 'target') {
        const candidate = Object.create(context);
        candidate.targets = Object.create(context.targets);
        candidate.targets[name] = selection;
        if (name === 'target') {
            candidate.target = selection;
        }
        return gameAction.allow(candidate);
    }

    buildGameAction(properties) {
        if (this.targetGameActions.length > 0) {
            if (properties.gameAction || properties.handler || properties.choices) {
                throw new Error(
                    'An ability whose targets have their own game actions cannot also have a gameAction, handler or choices'
                );
            }

            this.gameActionDependsOnChoices = true;
            return new SimultaneousActions(this.targetGameActions);
        }

        if (properties.gameAction) {
            // Choices are made after the ability is checked, so whether the game action can change
            // the game state depends on what is chosen. A single target, or the chosen player, is
            // filtered by the action instead; several targets are only filtered by their own
            // game actions.
            this.gameActionDependsOnChoices = !!(
                properties.target ||
                properties.targets ||
                properties.chooseOpponent ||
                properties.choosePlayer
            );

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
        return !this.getUnresolvableReason(context);
    }

    /**
     * Returns why the ability can't be resolved, as one of the `Requirements` reasons, or
     * undefined if it can be.
     */
    getUnresolvableReason(context) {
        return this.getUnmetRequirement(context) || this.getResolutionFailure(context);
    }

    meetsRequirements(context) {
        return !this.getUnmetRequirement(context);
    }

    /**
     * Returns the first requirement for using the ability that isn't met, as one of the
     * `Requirements` reasons, or undefined if they all are. Subclasses override this rather than
     * `meetsRequirements`.
     */
    getUnmetRequirement() {
        return undefined;
    }

    getResolutionFailure(context, { checkGameAction = true } = {}) {
        if (!this.canResolvePlayer(context)) {
            return Requirements.player;
        }

        if (!this.canPayCosts(context)) {
            return Requirements.cost;
        }

        if (!this.canResolveTargets(context)) {
            return Requirements.target;
        }

        if (checkGameAction && !this.isGameActionAllowed(context)) {
            return Requirements.noEffect;
        }

        return undefined;
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
        if (this.gameActionDependsOnChoices) {
            return true;
        }

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

    isWhenRevealedAbility() {
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
