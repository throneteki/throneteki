class ChooseCost {
    constructor(choices) {
        this.choices = Object.entries(choices).map(([text, cost]) => {
            return { cost, text };
        });
    }

    canPay(context) {
        return this.choices.some((choice) => choice.cost.canPay(context));
    }

    resolve(context, result = { resolved: false }) {
        let payableCosts = this.choices.filter((choice) => choice.cost.canPay(context));
        let payableCostsSize = payableCosts.length;

        if (payableCostsSize === 0) {
            result.value = false;
            result.resolved = true;
            return result;
        }

        if (payableCostsSize === 1) {
            this.chosenCost = payableCosts[0].cost;
            return this.resolveCost(this.chosenCost, context, result);
        }

        this.context = context;
        this.result = result;

        context.game.promptWithMenu(context.player, this, {
            activePrompt: {
                menuTitle: 'Choose cost to pay',
                buttons: payableCosts.map((choice) => {
                    return { text: choice.text, arg: choice.text, method: 'chooseCost' };
                })
            },
            source: context.source
        });

        return result;
    }

    chooseCost(player, choiceText) {
        this.chosenCost = this.choices.find((choice) => choice.text === choiceText).cost;
        this.resolveCost(this.chosenCost, this.context, this.result);
        return true;
    }

    resolveCost(cost, context, result) {
        if (cost.resolve) {
            return cost.resolve(context, result);
        }

        result.resolved = true;
        result.value = cost.canPay(context);
        return result;
    }

    pay(context) {
        this.chosenCost.pay(context);
    }
}

export default ChooseCost;
