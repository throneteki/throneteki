const _ = require('underscore');

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
    }

    buildCost(cost) {
        if(!cost) {
            return [];
        }

        if(!_.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        if(properties.target) {
            return {
                target: properties.target
            };
        }

        if(properties.targets) {
            return properties.targets;
        }

        return {};
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context) {
        return _.all(this.cost, cost => cost.canPay(context));
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
        return _.map(this.cost, cost => {
            if(cost.resolve) {
                return cost.resolve(context);
            }

            return { resolved: true, value: cost.canPay(context) };
        });
    }

    /**
     * Pays all costs for the ability simultaneously.
     */
    payCosts(context) {
        _.each(this.cost, cost => {
            cost.pay(context);
        });
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return _.all(this.targets, target => {
            return context.game.allCards.any(card => target.cardCondition(card));
        });
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     *
     * @returns {Array} An array of target resolution objects.
     */
    resolveTargets(context) {
        return _.map(this.targets, (targetProperties, name) => {
            return this.resolveTarget(context, name, targetProperties);
        });
    }

    resolveTarget(context, name, targetProperties) {
        var result = { resolved: false, name: name, value: null };
        var promptProperties = {
            source: context.source,
            onSelect: (player, card) => {
                result.resolved = true;
                result.value = card;
                return true;
            },
            onCancel: () => {
                result.resolved = true;
                return true;
            }
        };
        context.game.promptForSelect(context.player, _.extend(promptProperties, targetProperties));
        return result;
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) { // eslint-disable-line no-unused-vars
    }
}

module.exports = BaseAbility;
