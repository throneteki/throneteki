const GameAction = require('./GameAction');
const DiscardCard = require('./DiscardCard');

class DiscardTopCards extends GameAction {
    constructor() {
        super('discardTopCards');
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.drawDeck.length > 0;
    }

    createEvent({ player, amount }) {
        const actualAmount = Math.min(amount, player.drawDeck.length);
        let params = {
            amount: actualAmount,
            desiredAmount: amount,
            player
        };
        return this.event('onTopCardsDiscarded', params, event => {
            event.topCards = event.player.drawDeck.slice(0, event.amount);
            for(const card of event.topCards) {
                event.thenAttachEvent(DiscardCard.createEvent({ card }));
            }
        });
    }
}

module.exports = new DiscardTopCards();
