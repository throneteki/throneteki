class ParentCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return !!context.source.parent && this.action.isEligible(context.source.parent, context);
    }

    resolve(context, result = { resolved: false }) {
        context.addCost(this.action.name, context.source.parent);

        result.resolved = true;
        result.value = context.source.parent;
        return result;
    }

    pay(context) {
        this.action.pay(context.getCostValuesFor(this.action.name), context);
    }
}

module.exports = ParentCost;
