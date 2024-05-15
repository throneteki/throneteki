import XValuePrompt from './XValuePrompt.js';

export default class AnyNumberCost {
    constructor(properties) {
        this.innerCost = properties.cost;
        this.maxFunc = properties.max;
    }

    canPay(context) {
        return this.innerCost.canPay(context);
    }

    resolve(context, result = { resolved: false }) {
        let max = this.maxFunc(context);

        context.game.queueStep(new XValuePrompt(1, max, context));
        this.innerCost.resolve(context, result);

        return result;
    }

    pay(context) {
        this.innerCost.pay(context);
    }
}
