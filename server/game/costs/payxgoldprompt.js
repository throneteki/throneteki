const _ = require('underscore');

const BaseStep = require('../gamesteps/basestep');

class payXGoldPrompt extends BaseStep {
    constructor(list, context) {
        super();

        this.list = list;
        this.context = context;
    }

    continue() {
        let limit = _.min(this.list);
        let range = _.range(1, limit + 1).reverse();

        if(limit === 0) {
            return;
        }

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

module.exports = payXGoldPrompt;
