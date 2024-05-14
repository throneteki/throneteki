class SpecificCardCost {
    constructor(action, cardFunc) {
        this.action = action;
        this.cardFunc = cardFunc;
    }

    canPay(context) {
        let card = this.cardFunc(context);
        return this.action.isEligible(card, context);
    }

    resolve(context, result = { resolved: false }) {
        let card = this.cardFunc(context);
        context.addCost(this.action.name, card);

        result.resolved = true;
        result.value = card;
        return result;
    }

    pay(context) {
        this.action.pay(context.getCostValuesFor(this.action.name), context);
    }
}

export default SpecificCardCost;
