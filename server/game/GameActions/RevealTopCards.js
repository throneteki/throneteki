const GameAction = require('./GameAction');
const RevealCards = require('./RevealCards');

class RevealTopCards extends GameAction {
    constructor() {
        super('revealTopCards');
    }

    canChangeGameState({ player, amount = 1 }) {
        return amount > 0 && player.drawDeck.length >= amount;
    }

    createEvent({ player, amount = 1, context, whileRevealed }) {
        const cards = player.drawDeck.slice(0, amount);
        return RevealCards.createEvent({ cards, context, player: context.player, whileRevealed });
    }
}

module.exports = new RevealTopCards();
