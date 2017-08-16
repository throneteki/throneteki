const _ = require('underscore');

const BaseStep = require('../gamesteps/basestep');

class PayXGoldPrompt extends BaseStep {
    constructor(limit, context, lowerLimit = 1) {
        super();

        this.limit = limit;
        this.context = context;
        this.lowerLimit = lowerLimit;
    }

    continue() {
        if(this.limit === 0 || this.lowerLimit > this.limit) {
            return;
        }

        let range = _.range(this.lowerLimit, this.limit + 1).reverse();

        let buttons = _.map(range, gold => {
            return { text: gold, method: 'resolveCost', arg: gold };
        });

        this.context.game.promptWithMenu(this.context.player, this, {
            activePrompt: {
                menuTitle: 'Select gold amount to pay',
                buttons: buttons
            },
            source: this.context.source
        });
    }

    resolveCost(player, gold) {
        this.context.goldCostAmount = gold;

        return true;
    }
}

module.exports = PayXGoldPrompt;
