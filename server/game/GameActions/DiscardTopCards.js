const GameAction = require('./GameAction');
const DiscardCard = require('./DiscardCard');

class DiscardTopCards extends GameAction {
    constructor() {
        super('discardTopCards');
    }

    canChangeGameState({ player, amount }) {
        return amount > 0 && player.drawDeck.length > 0;
    }

    createEvent({ player, amount, isPillage = false, source }) {
        const actualAmount = Math.min(amount, player.drawDeck.length);
        let params = {
            amount: actualAmount,
            desiredAmount: amount,
            isFullyResolved: event => event.amount === event.desiredAmount,
            player,
            isPillage,
            source
        };
        return this.event('onTopCardsDiscarded', params, event => {
            event.topCards = event.player.drawDeck.slice(0, event.amount);
            for(const card of event.topCards) {
                event.thenAttachEvent(DiscardCard.createEvent({ card, isPillage: event.isPillage, source: event.source }));
            }
        });
    }
}

module.exports = new DiscardTopCards();
