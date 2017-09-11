const _ = require('underscore');

const BaseStep = require('../gamesteps/basestep');

class PayXGoldPrompt extends BaseStep {
    constructor(min, max, context) {
        super();

        this.min = min;
        this.max = max;
        this.context = context;
    }

    continue() {
        if(this.limit === 0 || this.min > this.max) {
            return;
        }

        let range = _.range(this.min, this.max + 1).reverse();

        let buttons = _.map(range, gold => {
            return { text: gold.toString(), method: 'resolveCost', arg: gold };
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
