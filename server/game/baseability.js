const _ = require('underscore');

const AbilityResolver = require('./gamesteps/abilityresolver.js');

class BaseAbility {
    constructor(game, source, properties) {
        this.game = game;
        this.source = source;
        this.cost = this.buildCost(properties.cost);
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

    queueResolver(context) {
        this.game.queueStep(new AbilityResolver(this.game, this, context));
    }

    canPayCosts(context) {
        return _.all(this.cost, cost => cost.canPay(context));
    }

    resolveCosts(context) {
        return _.map(this.cost, cost => {
            if(cost.resolve) {
                return cost.resolve(context);
            }

            return { resolved: true, value: cost.canPay(context) };
        });
    }

    payCosts(context) {
        _.each(this.cost, cost => {
            cost.pay(context);
        });
    }

    executeHandler(context) {
        // Should be overriden by inheritors
    }
}

module.exports = BaseAbility;
