class FactionCardCost {
    constructor(action) {
        this.action = action;
    }

    canPay(context) {
        return this.action.isEligible(context.player.faction, context);
    }

    resolve(context, result = { resolved: false }) {
        context.addCost(this.action.name, context.player.faction);

        result.resolved = true;
        result.value = context.player.faction;
        return result;
    }

    pay(context) {
        this.action.pay(context.getCostValuesFor(this.action.name), context);
    }
}

export default FactionCardCost;
