const _ = require('underscore');

const BaseStep = require('../gamesteps/basestep');

class PayXGoldPrompt extends BaseStep {
    constructor(min, max, context, reduction) {
        super();

        this.min = min;
        this.max = max;
        this.context = context;
        this.reduction = reduction;
    }

    continue() {
        if(this.limit === 0 || this.min > this.max) {
            return;
        }

        let range = _.range(this.min, this.max + 1).reverse();

        let buttons = _.map(range, xValue => {
            return { text: xValue.toString(), method: 'resolveCost', arg: xValue };
        });

        this.context.game.promptWithMenu(this.context.player, this, {
            activePrompt: {
                menuTitle: 'Select value of X',
                buttons: buttons
            },
            source: this.context.source
        });
    }

    resolveCost(player, xValue) {
        this.context.xValue = xValue;
        this.context.goldCost = _.max([xValue - this.reduction, 0]);

        return true;
    }
}

module.exports = PayXGoldPrompt;
