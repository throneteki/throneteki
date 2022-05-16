const GameAction = require('./GameAction');
const RevealCards = require('./RevealCards');

class RevealTopCards extends GameAction {
    constructor() {
        super('revealTopCards');
    }

    canChangeGameState({ player, amount = 1 }) {
        return amount > 0 && player.drawDeck.length >= amount;
    }

    createEvent({ player, amount = 1, context }) {
        if(amount > 1) {
            throw 'Not implemented yet';
        }

        return RevealCards.createEvent({ cards: [player.drawDeck[0]], context, player: context.player });
    }
}

module.exports = new RevealTopCards();
