import CardSelector from '../CardSelector.js';
import { Tokens } from '../Constants/Tokens.js';

class MoveGoldFromCardCost {
    constructor({
        target,
        amount = 1,
        condition = (card) => card.location === 'play area' && card.tokens[Tokens.gold] >= amount
    }) {
        this.name = 'moveGoldFromCard';
        this.amount = amount;
        this.selector = CardSelector.for({
            cardCondition: condition,
            cardType: ['attachment', 'character', 'location', 'faction', 'plot']
        });
        this.target = target;
        this.activePromptTitle = `Select card to move ${amount} gold from`;
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
        let sourceCard = context.getCostValuesFor(this.name)[0];

        context.game.transferGold({
            from: sourceCard,
            to: this.target,
            amount: this.amount,
            activePlayer: context.player
        });
    }
}

export default MoveGoldFromCardCost;
