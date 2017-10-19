class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        return this.action.isEligible(this.cardFunc(), context);
    }

    resolve(context, result = { resolved: false }) {
        let card = this.cardFunc();
        context.costs[this.action.name] = card;

        result.resolved = true;
        result.value = card;
        return result;
    }

    pay(context) {
        this.action.pay([context.costs[this.action.name]], context);
    }
}

module.exports = SpecificCardCost;
