const GameAction = require('./GameAction');
const RevealCards = require('./RevealCards');

class RevealTopCards extends GameAction {
    constructor() {
        super('revealTopCards');
    }
    message({ amount = 1, player, context }) {
        player = player || context.player;
        const cards = player.drawDeck.slice(0, amount);
        return RevealCards.message({ player, context: { ...context, revealed: cards } });
    }

    canChangeGameState({ amount = 1, player, context }) {
        player = player || context.player;
        return amount > 0 && player.drawDeck.length >= amount;
    }

    createEvent({
        amount = 1,
        player,
        whileRevealed,
        revealWithMessage = true,
        highlight = true,
        source,
        context
    }) {
        player = player || context.player;
        const cards = player.drawDeck.slice(0, amount);
        return RevealCards.createEvent({
            cards,
            player,
            whileRevealed,
            revealWithMessage,
            highlight,
            source,
            context
        });
    }
}

module.exports = new RevealTopCards();
