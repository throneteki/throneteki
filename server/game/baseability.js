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
        this.chooseOpponentFunc = properties.chooseOpponent;
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
     * Return whether when unpay is implemented for the ability cost and the
     * cost can be unpaid.
     *
     * @returns {boolean}
     */
    canUnpayCosts(context) {
        return _.all(this.cost, cost => cost.unpay && cost.canUnpay(context));
    }

    /**
     * Unpays each cost associated with the ability.
     */
    unpayCosts(context) {
        _.each(this.cost, cost => {
            cost.unpay(context);
        });
    }

    /**
     * Returns whether the ability requires an opponent to be chosen.
     */
    needsChooseOpponent() {
        return !!this.chooseOpponentFunc;
    }

    /**
     * Returns whether there are opponents that can be chosen, if the ability
     * requires that an opponent be chosen.
     */
    canResolveOpponents(context) {
        if(!this.needsChooseOpponent()) {
            return true;
        }

        return _.any(context.game.getPlayers(), player => {
            return player !== context.player && this.canChooseOpponent(player);
        });
    }

    /**
     * Returns whether a specific player can be chosen as an opponent.
     */
    canChooseOpponent(opponent) {
        if(_.isFunction(this.chooseOpponentFunc)) {
            return this.chooseOpponentFunc(opponent);
        }

        return this.chooseOpponentFunc === true;
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        const ValidTypes = ['character', 'attachment', 'location', 'event'];
        return _.all(this.targets, target => {
            return context.game.allCards.any(card => {
                if(!ValidTypes.includes(card.getType())) {
                    return false;
                }

                return target.cardCondition(card, context);
            });
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
        let cardCondition = targetProperties.cardCondition;
        let otherProperties = _.omit(targetProperties, 'cardCondition');
        let result = { resolved: false, name: name, value: null };
        let promptProperties = {
            source: context.source,
            cardCondition: card => cardCondition(card, context),
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
        context.game.promptForSelect(context.player, _.extend(promptProperties, otherProperties));
        return result;
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) { // eslint-disable-line no-unused-vars
    }

    isAction() {
        return true;
    }

    isPlayableEventAbility() {
        return false;
    }

    isCardAbility() {
        return true;
    }

    hasMax() {
        return false;
    }
}

module.exports = BaseAbility;
