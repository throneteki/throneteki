const GameActions = require('../GameActions');

class DiscardFromDeckCost {
    canPay(context) {
        return context.player.drawDeck.length > 0;
    }

    resolve(context, result = { resolved: false }) {
        let topCard = context.player.drawDeck[0];

        context.addCost('discardFromDeck', topCard);

        result.resolved = true;
        result.value = topCard;
        return result;
    }

    pay(context) {
        context.game.resolveGameAction(
            GameActions.discardCard((context) => ({ card: context.player.drawDeck[0] })),
            context
        );
    }

    canUnpay() {
        return false;
    }

    unpay() {}
}

module.exports = DiscardFromDeckCost;
