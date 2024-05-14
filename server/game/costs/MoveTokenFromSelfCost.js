import CardSelector from '../CardSelector.js';

class MoveTokenFromSelfCost {
    constructor(token, amount = 1, condition = (card) => card.location === 'play area') {
        this.name = 'moveTokenFromSelf';
        this.token = token;
        this.amount = amount;
        this.selector = CardSelector.for({ cardCondition: condition });
        this.activePromptTitle = `Select card to move ${amount} ${token} token to`;
    }

    canPay(context) {
        return (
            context.source.tokens[this.token] >= this.amount &&
            this.selector.hasEnoughTargets(context)
        );
    }

    resolve(context, result = { resolved: false }) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: this.activePromptTitle,
            context: context,
            selector: this.selector,
            source: context.source,
            onSelect: (player, card) => {
                context.addCost(this.name, card);
                result.value = true;
                result.resolved = true;

                return true;
            },
            onCancel: () => {
                result.value = false;
                result.resolved = true;
            }
        });

        return result;
    }

    pay(context) {
        let destinationCard = context.getCostValuesFor(this.name)[0];

        context.source.modifyToken(this.token, -this.amount);
        destinationCard.modifyToken(this.token, this.amount);
    }
}

export default MoveTokenFromSelfCost;
