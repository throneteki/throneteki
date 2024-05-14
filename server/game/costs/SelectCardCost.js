const CardSelector = require('../CardSelector.js');

class SelectCardCost {
    constructor(action, promptProperties) {
        this.action = action;
        this.selector = this.createSelector(action, promptProperties);
        this.activePromptTitle = promptProperties.activePromptTitle;
        this.proceedOnCancel = promptProperties.optional;
    }

    createSelector(action, properties) {
        let condition = (card, context) => {
            return (
                card.controller === context.player &&
                action.isEligible(card, context) &&
                properties.cardCondition(card, context)
            );
        };

        let fullProperties = Object.assign({}, properties, { cardCondition: condition });

        return CardSelector.for(fullProperties);
    }

    canPay(context) {
        return this.selector.hasEnoughTargets(context);
    }

    resolve(context, result = { resolved: false }) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.activePromptTitle,
            context: context,
            selector: this.selector,
            source: context.source,
            onSelect: (player, cards) => {
                context.addCost(this.action.name, cards);
                result.value = true;
                result.resolved = true;

                return true;
            },
            onCancel: () => {
                result.value = this.proceedOnCancel;
                result.resolved = true;
            }
        });

        return result;
    }

    pay(context) {
        let selected = context.getCostValuesFor(this.action.name);
        let selectedAsArray = Array.isArray(selected) ? selected : [selected];
        this.action.pay(selectedAsArray, context);
    }
}

module.exports = SelectCardCost;
